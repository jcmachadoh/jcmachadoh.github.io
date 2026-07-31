import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box, Container, Typography, Button, IconButton, Chip, Paper, List, ListItem,
    ListItemAvatar, Avatar, ListItemText, Divider, Alert, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useAdminStore } from '../store';
import { projects as initialProjects } from '../../data/projects';
import { toDraft, slugify, sanitizeFileName, serializeProjects } from '../utils';
import { ADMIN_CONFIG } from '../config';
import { uploadImage, deleteImage, updateFile, getFileSha, testToken } from '../api/github';
import { ProjectEditor } from './ProjectEditor';

const uniqueFileName = (name) => {
    const match = /\.([a-z0-9]+)$/i.exec(name);
    const ext = match ? match[1] : 'png';
    const base = name.replace(/\.[^/.]+$/, '');
    return `${base}-${Date.now().toString(36)}.${ext}`;
};

const newDraft = () => ({
    draftKey: `nueva-${Date.now()}`,
    id: '',
    isOnline: false,
    githubUrl: '',
    liveUrl: '',
    es: { name: '', smartDescription: '', fullDescription: '' },
    en: { name: '', smartDescription: '', fullDescription: '' },
    pt: { name: '', smartDescription: '', fullDescription: '' },
    folder: '',
    images: [],
    thumbnailPath: '',
    removedPaths: [],
});

export const AdminDashboard = () => {
    const githubToken = useAdminStore((state) => state.githubToken);
    const logout = useAdminStore((state) => state.logout);

    const [projects, setProjects] = useState(() => initialProjects.map(toDraft));
    const [editing, setEditing] = useState(null);
    const [dirty, setDirty] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState('');

    const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
    const [tokenInput, setTokenInput] = useState('');
    const [tokenSaving, setTokenSaving] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const saveDraft = (draft) => {
        setProjects((prev) => prev.map((p) => (p.draftKey === draft.draftKey ? draft : p)));
        setEditing(null);
        setDirty(true);
        setResult('');
    };

    const addNew = () => {
        const draft = newDraft();
        setProjects((prev) => [...prev, draft]);
        setEditing(draft);
        setDirty(true);
        setResult('');
    };

    const moveProject = (index, direction) => {
        setProjects((prev) => {
            const next = [...prev];
            const target = index + direction;
            if (target < 0 || target >= next.length) return prev;
            [next[index], next[target]] = [next[target], next[index]];
            return next;
        });
        setDirty(true);
    };

    const removeProject = (draft) => {
        setProjects((prev) => prev.filter((p) => p.draftKey !== draft.draftKey));
        setConfirmDelete(null);
        setDirty(true);
    };

    const handleSaveToken = async () => {
        const { setGithubToken, clearGithubToken } = useAdminStore.getState();
        if (!tokenInput.trim()) {
            clearGithubToken();
            setTokenDialogOpen(false);
            return;
        }
        setTokenSaving(true);
        setError('');
        try {
            setGithubToken(tokenInput);
            await testToken();
            setTokenDialogOpen(false);
            setResult('Token de GitHub configurado correctamente.');
        } catch (err) {
            clearGithubToken();
            setError(`Token inválido: ${err.message}`);
        } finally {
            setTokenSaving(false);
        }
    };

    const handlePublish = async () => {
        setError('');
        setResult('');
        setSaving(true);
        try {
            const finalProjects = [];
            const filesToDelete = new Set();
            const drafts = projects.map((p) => structuredClone(p));

            for (const draft of drafts) {
                if (!draft.id) {
                    draft.id = slugify(draft.es?.name) || `proyecto-${Date.now()}`;
                }
                const folder = draft.folder || draft.id;
                const keyToPath = {};
                const finalImages = [];

                for (const img of draft.images) {
                    if (img.kind === 'new') {
                        const fileName = uniqueFileName(sanitizeFileName(img.name || 'imagen.png'));
                        const path = `${folder}/${fileName}`;
                        const base64 = img.dataUrl.split(',')[1];
                        await uploadImage({
                            path: `${ADMIN_CONFIG.imagesFolderPath}/${path}`,
                            base64,
                            message: `Admin: subir imagen ${path}`,
                        });
                        keyToPath[img.key] = path;
                        finalImages.push(path);
                    } else {
                        finalImages.push(img.path);
                    }
                }

                draft.removedPaths.forEach((p) => filesToDelete.add(p));

                let thumbnail = draft.thumbnailPath || finalImages[0] || '';
                if (keyToPath[thumbnail]) thumbnail = keyToPath[thumbnail];
                if (!finalImages.includes(thumbnail)) thumbnail = finalImages[0] || '';

                finalProjects.push({
                    id: draft.id,
                    thumbnail,
                    images: finalImages,
                    isOnline: Boolean(draft.isOnline),
                    githubUrl: draft.githubUrl || '',
                    liveUrl: draft.liveUrl || '',
                    es: draft.es,
                    en: draft.en,
                    pt: draft.pt,
                });
            }

            for (const path of filesToDelete) {
                const stillUsed = finalProjects.some(
                    (p) => p.images.includes(path) || p.thumbnail === path
                );
                if (!stillUsed) {
                    await deleteImage({
                        path: `${ADMIN_CONFIG.imagesFolderPath}/${path}`,
                        message: `Admin: eliminar imagen ${path}`,
                    });
                }
            }

            const content = serializeProjects(finalProjects);
            const sha = await getFileSha(ADMIN_CONFIG.dataFilePath).catch(() => null);
            await updateFile({
                path: ADMIN_CONFIG.dataFilePath,
                content,
                sha,
                message: 'Admin: actualizar proyectos del CV',
            });

            setProjects(finalProjects.map(toDraft));
            setDirty(false);
            setResult('Cambios publicados correctamente. El deploy se ejecutará automáticamente y en unos minutos verás los cambios en el sitio.');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (editing) {
        return (
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
                <ProjectEditor
                    draft={editing}
                    onSave={saveDraft}
                    onCancel={() => setEditing(null)}
                />
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 6 }}>
            <Paper elevation={1} sx={{ borderRadius: 0, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">
                        Panel de Administración
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                            icon={<GitHubIcon />}
                            label={githubToken ? 'GitHub conectado' : 'Token no configurado'}
                            color={githubToken ? 'success' : 'warning'}
                            size="small"
                            onClick={() => setTokenDialogOpen(true)}
                        />
                        <Button component={Link} to="/" size="small" startIcon={<VisibilityIcon />} sx={{ textTransform: 'none' }}>
                            Ver sitio
                        </Button>
                        <Button color="inherit" size="small" startIcon={<LogoutIcon />} onClick={logout} sx={{ textTransform: 'none' }}>
                            Salir
                        </Button>
                    </Box>
                </Container>
            </Paper>

            <Container maxWidth="lg" sx={{ mt: 3 }}>
                {!githubToken && (
                    <Alert severity="warning" sx={{ mb: 2 }} action={
                        <Button color="inherit" size="small" onClick={() => setTokenDialogOpen(true)}>
                            Configurar
                        </Button>
                    }>
                        No has configurado tu token de GitHub. Sin él no podrás publicar los cambios.
                    </Alert>
                )}

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {result && <Alert severity="success" sx={{ mb: 2 }}>{result}</Alert>}

                <Paper sx={{ p: 2, mb: 3, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Box>
                        <Typography fontWeight="bold">
                            {projects.length} proyecto{projects.length !== 1 ? 's' : ''}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Los cambios se publican en el repositorio con un commit, lo que activa el deploy automático.
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button variant="outlined" startIcon={<AddIcon />} onClick={addNew} sx={{ textTransform: 'none' }}>
                            Nuevo proyecto
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <CloudUploadIcon />}
                            onClick={handlePublish}
                            disabled={saving || !dirty}
                            sx={{ textTransform: 'none', fontWeight: 'bold' }}
                        >
                            Guardar y publicar
                        </Button>
                    </Box>
                </Paper>

                <Paper sx={{ borderRadius: 2 }}>
                    <List disablePadding>
                        {projects.map((project, index) => (
                            <Box key={project.draftKey}>
                                {index > 0 && <Divider component="li" />}
                                <ListItem sx={{ gap: 2 }} secondaryAction={
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                        <IconButton size="small" onClick={() => moveProject(index, -1)} disabled={index === 0} title="Subir">
                                            <ArrowUpwardIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => moveProject(index, 1)} disabled={index === projects.length - 1} title="Bajar">
                                            <ArrowDownwardIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => setEditing(project)} title="Editar">
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => setConfirmDelete(project)} title="Eliminar">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                }>
                                    <ListItemAvatar>
                                        <Avatar
                                            variant="rounded"
                                            src={project.thumbnailPath
                                                ? (project.thumbnailPath.startsWith('data:')
                                                    ? project.thumbnailPath
                                                    : `/projects/${project.thumbnailPath}`)
                                                : undefined}
                                            sx={{ width: 72, height: 48, borderRadius: 1.5 }}
                                        >
                                            {project.id}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                <Typography fontWeight="bold">
                                                    {project.es?.name || project.id || 'Proyecto sin nombre'}
                                                </Typography>
                                                <Chip
                                                    label={project.isOnline ? 'Online' : 'Local'}
                                                    color={project.isOnline ? 'success' : 'default'}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                                <Chip label={`${project.images.length} img`} size="small" variant="outlined" />
                                            </Box>
                                        }
                                        secondary={`${project.id} · ${project.images.filter((i) => i.kind === 'new').length} imagen(es) pendiente(s) de subir`}
                                    />
                                </ListItem>
                            </Box>
                        ))}
                    </List>
                </Paper>
            </Container>

            <Dialog open={tokenDialogOpen} onClose={() => setTokenDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Token de GitHub</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" paragraph sx={{ mt: 1 }}>
                        Se guarda solo en tu navegador y se usa para hacer commit en{' '}
                        <b>{ADMIN_CONFIG.github.owner}/{ADMIN_CONFIG.github.repo}</b>. Crea uno en{' '}
                        <a href="https://github.com/settings/tokens?type=beta" target="_blank" rel="noopener noreferrer">
                            GitHub Settings
                        </a>{' '}
                        con permiso de escritura (Contents: read/write).
                    </Typography>
                    <TextField
                        fullWidth
                        label="Personal Access Token"
                        type="password"
                        variant="outlined"
                        value={tokenInput}
                        onChange={(e) => setTokenInput(e.target.value)}
                        placeholder="github_pat_..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button color="inherit" onClick={() => setTokenDialogOpen(false)} sx={{ textTransform: 'none' }}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveToken}
                        disabled={tokenSaving}
                        startIcon={tokenSaving ? <CircularProgress size={18} color="inherit" /> : <GitHubIcon />}
                        sx={{ textTransform: 'none' }}
                    >
                        Guardar token
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={Boolean(confirmDelete)} onClose={() => setConfirmDelete(null)} maxWidth="xs" fullWidth>
                <DialogTitle>¿Eliminar proyecto?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        Se eliminará <b>{confirmDelete?.es?.name || confirmDelete?.id}</b> del listado. Las imágenes
                        subidas no se borran del repositorio automáticamente.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button color="inherit" onClick={() => setConfirmDelete(null)} sx={{ textTransform: 'none' }}>
                        Cancelar
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        onClick={() => removeProject(confirmDelete)}
                        sx={{ textTransform: 'none' }}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
