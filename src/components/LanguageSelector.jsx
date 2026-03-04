import { useState } from 'react';
import { IconButton, Menu, MenuItem, Tooltip, Box, Typography } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useLanguageStore } from '../store/useLanguage';

export default function LanguageSelector() {

    const { language, setLanguage } = useLanguageStore();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (lang) => {
        // Validación para evitar que cierre haciendo clic fuera lance un error
        if (lang && typeof lang === 'string') {
            setLanguage(lang);
        }
        setAnchorEl(null);
    };

    return (
        <Box>
            <Tooltip title="Cambiar idioma">
                <IconButton
                    onClick={handleClick}
                    color="inherit"
                    sx={{ ml: 1 }}
                >
                    <LanguageIcon />
                    <Typography variant="button" sx={{ ml: 0.5, fontWeight: 'bold' }}>
                        {language.toUpperCase()}
                    </Typography>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleClose(null)}
                PaperProps={{
                    elevation: 3,
                    // Aumenté un poco el minWidth para que el texto y la bandera quepan perfectos
                    sx: { mt: 1.5, minWidth: 150 } 
                }}
            >
                <MenuItem
                    onClick={() => handleClose('es')}
                    selected={language === 'es'}
                    sx={{ gap: 1.5 }} // Esto añade la separación perfecta entre la bandera y el texto
                >
                    <span role="img" aria-label="Español">🇪🇸</span> Español (ES)
                </MenuItem>

                <MenuItem
                    onClick={() => handleClose('en')}
                    selected={language === 'en'}
                    sx={{ gap: 1.5 }}
                >
                    <span role="img" aria-label="English">🇺🇸</span> English (EN)
                </MenuItem>

                <MenuItem
                    onClick={() => handleClose('pt')}
                    selected={language === 'pt'}
                    sx={{ gap: 1.5 }}
                >
                    <span role="img" aria-label="Português">🇧🇷</span> Português (PT)
                </MenuItem>
            </Menu>
        </Box>
    );
}