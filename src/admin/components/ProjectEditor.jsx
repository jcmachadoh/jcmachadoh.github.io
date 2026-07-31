import { useRef, useState } from 'react';
import {
    Box, Button, Typography, TextField, Switch, FormControlLabel, Tab, Tabs,
    IconButton, Chip, Grid, Divider, Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { slugify, sanitizeFileName } from '../utils';

const LANGS = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' },
    { code: 'pt', label: 'Português' },
];

const EMPTY_LANG = { name: '', smartDescription: '', fullDescription: '' };

export const ProjectEditor = ({ draft, onSave, onCancel }) => {
    const [localDraft, setLocalDraft] = useState(() => ({
        ...draft,
        es: draft.es || EMPTY_LANG,
        en: draft.en || EMPTY_LANG,
        pt: draft.pt || EMPTY_LANG,
    }));
    const [lang, setLang] = useState('es');
    const fileInputRef = useRef(null);

    const updateGeneral = (field, value) => {
        setLocalDraft((prev) => ({ ...prev, [field]: value }));
    };

    const updateLang = (langCode, field, value) => {
        setLocalDraft((prev) => ({
            ...prev,
            [langCode]: { ...prev[langCode], [field]: value },
        }));
    };

    const handleFiles = (files) => {
        Array.from(files || []).forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                setLocalDraft((prev) => ({
                    ...prev,
                    images: [
                        ...prev.images,
                        {
                            key: `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                            kind: 'new',
                            name: sanitizeFileName(file.name),
                            dataUrl: reader.result,
                        },
                    ],
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setLocalDraft((prev) => {
            const image = prev.images[index];
            const removedPaths = image.kind === 'existing'
                ? [...prev.removedPaths, image.path]
                : prev.removedPaths;
            const images = prev.images.filter((_, i) => i !== index);
            const thumbnailPath = prev.thumbnailPath === image.path || prev.thumbnailPath === image.key
                ? (images[0]?.path || images[0]?.key || '')
                : prev.thumbnailPath;
            return { ...prev, images, removedPaths, thumbnailPath };
        });
    };

    const moveImage = (index, direction) => {
        setLocalDraft((prev) => {
            const images = [...prev.images];
            const target = index + direction;
            if (target < 0 || target >= images.length) return prev;
            [images[index], images[target]] = [images[target], images[index]];
            return { ...prev, images };
        });
    };

    const setThumbnail = (index) => {
        setLocalDraft((prev) => {
            const image = prev.images[index];
            return { ...prev, thumbnailPath: image.path || image.key };
        });
    };

    const imageSource = (image) => (image.kind === 'new' ? image.dataUrl : `/projects/${image.path}`);

    const isThumbnail = (image) => localDraft.thumbnailPath === (image.path || image.key);

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <IconButton onClick={onCancel} color="inherit">
                    <ArrowBackIcon />
                </IconButton>
                <Box>
                    <Typography variant="h5" fontWeight="bold">
                        {localDraft.id ? `Editar: ${localDraft.es?.name || localDraft.id}` : 'Nuevo proyecto'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {localDraft.id ? `Identificador: ${localDraft.id}` : 'Se generará un identificador a partir del nombre'}
                    </Typography>
                </Box>
            </Box>

            <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                    Información general
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Identificador (slug)"
                            variant="outlined"
                            size="small"
                            value={localDraft.id}
                            onChange={(e) => updateGeneral('id', slugify(e.target.value))}
                            helperText="Se usa como carpeta de imágenes. Letras, números y guiones."
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={localDraft.isOnline}
                                    onChange={(e) => updateGeneral('isOnline', e.target.checked)}
                                    color="success"
                                />
                            }
                            label={<Typography fontWeight="bold">Proyecto publicado / Online</Typography>}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="URL del repositorio (GitHub)"
                            variant="outlined"
                            size="small"
                            value={localDraft.githubUrl}
                            onChange={(e) => updateGeneral('githubUrl', e.target.value)}
                            placeholder="https://github.com/..."
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="URL del proyecto en vivo"
                            variant="outlined"
                            size="small"
                            value={localDraft.liveUrl}
                            onChange={(e) => updateGeneral('liveUrl', e.target.value)}
                            placeholder="https://..."
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                    Contenido por idioma
                </Typography>
                <Tabs
                    value={lang}
                    onChange={(_, value) => setLang(value)}
                    sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
                >
                    {LANGS.map((l) => (
                        <Tab key={l.code} label={l.label} value={l.code} />
                    ))}
                </Tabs>

                <Grid container spacing={2}>
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            label="Nombre del proyecto"
                            variant="outlined"
                            value={localDraft[lang].name}
                            onChange={(e) => updateLang(lang, 'name', e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            label="Descripción corta (vista de tarjeta)"
                            variant="outlined"
                            multiline
                            rows={3}
                            value={localDraft[lang].smartDescription}
                            onChange={(e) => updateLang(lang, 'smartDescription', e.target.value)}
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            label="Descripción completa (modal)"
                            variant="outlined"
                            multiline
                            rows={8}
                            value={localDraft[lang].fullDescription}
                            onChange={(e) => updateLang(lang, 'fullDescription', e.target.value)}
                            helperText="Puedes usar saltos de línea para separar párrafos."
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                        Imágenes ({localDraft.images.length})
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddPhotoAlternateIcon />}
                        onClick={() => fileInputRef.current?.click()}
                        sx={{ textTransform: 'none' }}
                    >
                        Subir imágenes
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={(e) => {
                            handleFiles(e.target.files);
                            e.target.value = '';
                        }}
                    />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Haz clic en la estrella para elegir la imagen de portada de la tarjeta.
                </Typography>

                {localDraft.images.length === 0 ? (
                    <Box
                        sx={{
                            border: '2px dashed',
                            borderColor: 'divider',
                            borderRadius: 2,
                            p: 4,
                            textAlign: 'center',
                            color: 'text.secondary',
                        }}
                    >
                        <AddPhotoAlternateIcon sx={{ fontSize: 48, mb: 1 }} />
                        <Typography>No hay imágenes. Sube las capturas del proyecto.</Typography>
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        {localDraft.images.map((image, index) => (
                            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={image.key || image.path}>
                                <Box sx={{ position: 'relative', border: 1, borderColor: 'divider', borderRadius: 2, p: 0.5 }}>
                                    <Box
                                        component="img"
                                        src={imageSource(image)}
                                        alt={image.path || image.name}
                                        sx={{
                                            width: '100%',
                                            height: 110,
                                            objectFit: 'cover',
                                            borderRadius: 1.5,
                                            display: 'block',
                                        }}
                                    />
                                    {isThumbnail(image) && (
                                        <Chip
                                            label="Portada"
                                            size="small"
                                            color="primary"
                                            sx={{ position: 'absolute', top: 6, left: 6, fontWeight: 'bold' }}
                                        />
                                    )}
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mt: 0.5 }}>
                                        <IconButton size="small" onClick={() => moveImage(index, -1)} disabled={index === 0}>
                                            <KeyboardArrowUpIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="warning"
                                            onClick={() => setThumbnail(index)}
                                            title="Usar como portada"
                                        >
                                            {isThumbnail(image) ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                                        </IconButton>
                                        <IconButton size="small" onClick={() => moveImage(index, 1)} disabled={index === localDraft.images.length - 1}>
                                            <KeyboardArrowDownIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => removeImage(index)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" color="inherit" onClick={onCancel} sx={{ textTransform: 'none' }}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={() => onSave(localDraft)}
                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                >
                    Guardar cambios
                </Button>
            </Box>
        </Box>
    );
};
