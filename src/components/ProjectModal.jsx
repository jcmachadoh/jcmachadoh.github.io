import React, { useState, useEffect, useCallback } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Typography, Button, IconButton, Box, Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const baseImg = '/projects/';

export const ProjectModal = ({ project, open, handleClose }) => {
    const [activeImage, setActiveImage] = useState(0);

    const images = project?.images || [];

    const goTo = useCallback((direction) => {
        setActiveImage((current) => (current + direction + images.length) % images.length);
    }, [images.length]);

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (event) => {
            if (event.key === 'ArrowLeft') goTo(-1);
            if (event.key === 'ArrowRight') goTo(1);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open, goTo]);

    if (!project) return null;

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
                <Typography
                    variant="body1"
                    paragraph
                    sx={{
                        whiteSpace: 'pre-line',
                        textAlign: 'justify'
                    }}>
                    {project.fullDescription}
                </Typography>

                {/* Galería / Carrusel Visual */}
                {images.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                        {/* Imagen Principal con navegación */}
                        <Box sx={{ position: 'relative', mb: 2 }}>
                            <Box
                                component="img"
                                src={baseImg + images[activeImage]}
                                alt={`Vista de ${project.name}`}
                                sx={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover', borderRadius: 2, boxShadow: 3, display: 'block' }}
                            />

                            {images.length > 1 && (
                                <>
                                    <IconButton
                                        onClick={() => goTo(-1)}
                                        aria-label="Imagen anterior"
                                        sx={{
                                            position: 'absolute',
                                            left: 8,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            bgcolor: 'rgba(0,0,0,0.45)',
                                            color: 'white',
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' }
                                        }}
                                    >
                                        <ChevronLeftIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => goTo(1)}
                                        aria-label="Imagen siguiente"
                                        sx={{
                                            position: 'absolute',
                                            right: 8,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            bgcolor: 'rgba(0,0,0,0.45)',
                                            color: 'white',
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' }
                                        }}
                                    >
                                        <ChevronRightIcon />
                                    </IconButton>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 8,
                                            right: 12,
                                            bgcolor: 'rgba(0,0,0,0.55)',
                                            color: 'white',
                                            px: 1,
                                            py: 0.25,
                                            borderRadius: 1
                                        }}
                                    >
                                        {activeImage + 1} / {images.length}
                                    </Typography>
                                </>
                            )}
                        </Box>

                        {/* Miniaturas (Thumbnails) para seleccionar */}
                        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
                            {images.map((img, index) => (
                                <Box
                                    key={index}
                                    component="img"
                                    src={baseImg + img}
                                    alt={`Miniatura ${index + 1} de ${project.name}`}
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
                            rel="noopener noreferrer"
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
                            rel="noopener noreferrer"
                        >
                            Visitar Proyecto
                        </Button>
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    );
};
