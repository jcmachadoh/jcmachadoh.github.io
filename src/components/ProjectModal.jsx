import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Typography, Button, IconButton, Box, Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';

const baseImg = '/projects/'

export const ProjectModal = ({ project, open, handleClose }) => {
    // Estado para saber qué imagen del array estamos mostrando en grande
    const [activeImage, setActiveImage] = useState(0);

    // Si no hay proyecto seleccionado, no renderizamos nada
    if (!project) return null;

    // Al cerrar, reseteamos la imagen a la primera
    const onClose = () => {
        setActiveImage(0);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" component="span" fontWeight="bold" color="primary">
                    {project.name}
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {/* Descripción Completa */}
                <Typography variant="body1" paragraph>
                    {project.fullDescription}
                </Typography>

                {/* Galería / Carrusel Visual */}
                {project.images && project.images.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                        {/* Imagen Principal */}
                        <Box
                            component="img"
                            src={baseImg + project.images[activeImage]}
                            alt={`Vista de ${project.name}`}
                            sx={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover', borderRadius: 2, mb: 2, boxShadow: 3 }}
                        />

                        {/* Miniaturas (Thumbnails) para seleccionar */}
                        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
                            {project.images.map((img, index) => (
                                <Box
                                    key={index}
                                    component="img"
                                    src={baseImg + img}
                                    onClick={() => setActiveImage(index)}
                                    sx={{
                                        width: '80px',
                                        height: '60px',
                                        objectFit: 'cover',
                                        borderRadius: 1,
                                        cursor: 'pointer',
                                        border: activeImage === index ? '3px solid #e56e24' : '2px solid transparent',
                                        opacity: activeImage === index ? 1 : 0.6,
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': { opacity: 1 }
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                {/* Chips informativos */}
                <Box>
                    {project.isOnline ? (
                        <Chip label="Online" color="success" size="small" variant="outlined" />
                    ) : (
                        <Chip label="Desarrollo / Local" color="default" size="small" variant="outlined" />
                    )}
                </Box>

                {/* Botones de Acción */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {project.githubUrl && (
                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<GitHubIcon />}
                            href={project.githubUrl}
                            target="_blank"
                        >
                            Código
                        </Button>
                    )}
                    {project.liveUrl && (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<LaunchIcon />}
                            href={project.liveUrl}
                            target="_blank"
                        >
                            Visitar Proyecto
                        </Button>
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    );
};