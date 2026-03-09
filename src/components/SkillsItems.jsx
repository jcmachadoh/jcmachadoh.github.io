import { Box, Typography } from "@mui/material";
import { keyframes } from '@mui/system';

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
    const fillPercentage = items.overage || 50;

    return (
        <Box
            sx={{
                position: 'relative',
                width: 150,
                height: 36,
                borderRadius: '18px',
                bgcolor: 'action.hover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.1)'
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    bgcolor: color,
                    opacity: 0.3,
                    borderRadius: '18px',
                    animation: `${fillAndWave(fillPercentage + 3)} 0.6s ease-out forwards`,
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    bgcolor: color,
                    opacity: 0.85,
                    borderRadius: '18px',
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
                }}
            >
                {items.name}
            </Typography>
        </Box>
    );
};