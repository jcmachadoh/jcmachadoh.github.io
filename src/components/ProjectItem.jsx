import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";

const baseImg = '/src/assets/projects/';

export const ProjectItem = ({ project, handleOpenModal }) => {
    return (
        <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            boxShadow: 3,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
            }
        }}>
            <CardMedia
                component="img"
                height="220"
                image={baseImg + project.thumbnail}
                alt={`Portada de ${project.name}`}
                sx={{ objectFit: 'cover' }}
            />

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
                        textOverflow: 'ellipsis'
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