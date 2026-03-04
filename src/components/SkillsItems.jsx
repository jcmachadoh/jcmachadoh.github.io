import { Box, Typography } from "@mui/material";
import { keyframes } from '@mui/system';

// Animación más rápida que incluye el movimiento del líquido
// y asegura que termine con las esquinas derechas curvas (18px)
const fillAndWave = (width) => keyframes`
  0% { 
    width: 0%; 
    border-top-right-radius: 30px; 
    border-bottom-right-radius: 5px; 
  }
  50% { 
    border-top-right-radius: 5px; 
    border-bottom-right-radius: 30px; 
  }
  100% { 
    width: ${width}%; 
    border-top-right-radius: 18px; 
    border-bottom-right-radius: 18px; 
  }
`;

export const SkillsItems = ({ items, color }) => {
    // Tomamos el porcentaje; 50% por defecto si no existe
    const fillPercentage = items.overage || 50;

    return (
        <Box
            sx={{
                position: 'relative',
                width: 150,
                height: 36,
                borderRadius: '18px', // Bordes redondos del contenedor principal
                bgcolor: 'action.hover', // Color vacío de la barra
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.1)'
            }}
        >
            {/* CAPA DE AGUA TRASERA (Más rápida y tenue) */}
            <Box
                sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    bgcolor: color,
                    opacity: 0.3, // Semitransparente
                    borderRadius: '18px', // Garantiza curvatura
                    // Animación de 0.6 segundos
                    animation: `${fillAndWave(fillPercentage + 3)} 0.6s ease-out forwards`,
                }}
            />

            {/* CAPA DE AGUA FRONTAL (Principal) */}
            <Box
                sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    bgcolor: color,
                    opacity: 0.85,
                    borderRadius: '18px', // Garantiza que termine redondeado en la punta derecha
                    // Animación de 0.8 segundos (un poco más lenta que la trasera para el efecto líquido)
                    animation: `${fillAndWave(fillPercentage)} 0.8s ease-out forwards`,
                }}
            />

            {/* TEXTO DE LA HABILIDAD */}
            <Typography 
                variant="body2" 
                sx={{ 
                    position: 'relative', 
                    zIndex: 1, 
                    fontWeight: 'bold', 
                    color: 'text.primary',
                    textShadow: '0px 0px 4px rgba(255,255,255,0.9)' // Sombra para legibilidad
                }}
            >
                {items.name}
            </Typography>
        </Box>
    );
};