import { Box, Typography } from '@mui/material';

export const TechMarquee = ({ items, direction = 'normal', speed = '20s' }) => {
    // Duplicamos el array varias veces para crear el efecto de bucle infinito sin cortes
    const duplicatedItems = [...items, ...items, ...items, ...items];

    return (
        <Box
            sx={{
                display: 'flex',
                overflow: 'hidden',
                width: '100%',
                position: 'relative',
                py: 2,
                // Este gradiente hace que los bordes izquierdo y derecho se difuminen (Fade effect)
                maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: { xs: 4, md: 8 },
                    width: 'max-content',
                    // Animación CSS pura para el scroll
                    animation: `scroll ${speed} linear infinite ${direction}`,
                    '&:hover': {
                        animationPlayState: 'paused', // Se detiene al pasar el mouse
                    },
                    '@keyframes scroll': {
                        '0%': { transform: 'translateX(0)' },
                        '100%': { transform: 'translateX(-50%)' }
                    }
                }}
            >
                {duplicatedItems.map((item, index) => {
                    // Formateamos el nombre del JSON para que coincida con el nombre de tu archivo
                    // Ejemplo: "React Native" -> "react-native"
                    const fileName = item.name.toLowerCase().replace(/\s+/g, '-');

                    return (
                        <Box
                            key={`${item.id}-${index}`}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '80px',
                                transition: 'transform 0.3s ease',
                                '&:hover': { transform: 'scale(1.15)' } // Efecto lupa al pasar el mouse
                            }}
                        >
                            <Box
                                component="img"
                                src={`/skills/${fileName}.svg`}
                                alt={item.name}
                                // Si no encuentra el SVG, no rompe la imagen, muestra un cuadro vacío
                                onError={(e) => { e.target.style.display = 'none' }}
                                sx={{
                                    width: 50,
                                    height: 50,
                                    objectFit: 'contain',
                                    mb: 1,
                                    // Sombra blanca sutil para que los logos oscuros se vean bien en modo oscuro
                                    filter: 'drop-shadow(0px 2px 4px rgba(255,255,255,0.1))'
                                }}
                            />
                            <Typography variant="body2" fontWeight="bold" color="text.secondary" textAlign="center">
                                {item.name}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};