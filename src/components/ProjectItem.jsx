import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";

const baseImg = '/projects/';

export const ProjectItem = ({ project, handleOpenModal }) => {
    return (
        <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: 3,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
            }
        }}>
            <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', bgcolor: 'background.default' }}>
                <CardMedia
                    component="img"
                    image={baseImg + project.thumbnail}
                    alt={`Portada de ${project.name}`}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                />
            </Box>

            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary.main">
                    {project.name}
                </Typography>
                {/* MAGIA AQUÍ: Forzamos a que el texto ocupe máximo 3 líneas */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {project.smartDescription}
                </Typography>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => handleOpenModal(project)}
                    fullWidth
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                >
                    Ver Detalles del Proyecto
                </Button>
            </CardActions>
        </Card>
    );
}