import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Menu, MenuItem } from '@mui/material';

// Importamos los iconos
import EmailIcon from '@mui/icons-material/Email';
import Brightness4Icon from '@mui/icons-material/Brightness4'; 
import Brightness7Icon from '@mui/icons-material/Brightness7'; 
import MenuIcon from '@mui/icons-material/Menu'; // <-- Icono de Menú Hamburguesa

// Componentes y estado
import LanguageSelector from './LanguageSelector';
import { useLanguageStore } from '../store/useLanguage'; // Ajusta la ruta si es necesario
import { translations } from '../language/translate';           // Ajusta la ruta si es necesario

export default function Navbar({ onOpenContact, toggleTheme, isDarkMode }) {
  const { language } = useLanguageStore();
  const t = translations[language].navbar;

  // Estado para controlar si el menú hamburguesa está abierto o cerrado
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="sticky" elevation={1} color="inherit">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          
          {/* LOGO */}
          <Typography variant="h6" fontWeight="bold" color="primary">
            MiPortafolio
          </Typography>

          {/* CONTENEDOR DERECHO: Enlaces, Menú y Botones */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 } }}>
            
            {/* --- ENLACES VERSIÓN ESCRITORIO (Ocultos en móviles) --- */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, mr: 1 }}>
              <Button color="inherit" href="#inicio" sx={{ textTransform: 'none', fontWeight: 600 }}>{t.home}</Button>
              <Button color="inherit" href="#sobre-mi" sx={{ textTransform: 'none', fontWeight: 600 }}>{t.about}</Button>
              <Button color="inherit" href="#experiencia" sx={{ textTransform: 'none', fontWeight: 600 }}>{t.experience}</Button>
              <Button color="inherit" href="#proyectos" sx={{ textTransform: 'none', fontWeight: 600 }}>{t.projects}</Button>
            </Box>

            {/* Divisor visual (Solo en escritorio) */}
            <Box sx={{ display: { xs: 'none', md: 'block' }, borderLeft: '1px solid #ccc', height: '24px', mx: 1 }} />

            {/* --- MENÚ HAMBURGUESA VERSIÓN MÓVIL (Oculto en escritorio) --- */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              
              {/* Desplegable del menú hamburguesa */}
              <Menu
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {/* Usamos component="a" para que funcionen como enlaces ancla */}
                <MenuItem onClick={handleCloseNavMenu} component="a" href="#inicio">
                  <Typography textAlign="center" color="text.primary">{t.home}</Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu} component="a" href="#sobre-mi">
                  <Typography textAlign="center" color="text.primary">{t.about}</Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu} component="a" href="#experiencia">
                  <Typography textAlign="center" color="text.primary">{t.experience}</Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu} component="a" href="#proyectos">
                  <Typography textAlign="center" color="text.primary">{t.projects}</Typography>
                </MenuItem>
              </Menu>
            </Box>

            {/* --- CONTROLES GLOBALES (Siempre visibles afuera) --- */}
            
            {/* Selector de idioma */}
            <LanguageSelector />

            {/* Botón de Tema (Sol / Luna) */}
            <IconButton onClick={toggleTheme} color="inherit">
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            
            {/* --- BOTÓN DE CONTACTO DINÁMICO --- */}
            
            {/* 1. Versión Escritorio: Botón con texto e icono */}
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<EmailIcon />}
              onClick={onOpenContact}
              sx={{ display: { xs: 'none', md: 'flex' }, borderRadius: '20px', ml: 1, textTransform: 'none', fontWeight: 'bold' }}
            >
              {t.contact}
            </Button>

            {/* 2. Versión Móvil: Solo el icono circular */}
            <IconButton
              color="primary"
              onClick={onOpenContact}
              sx={{ display: { xs: 'flex', md: 'none' }, ml: 0.5 }}
            >
              <EmailIcon />
            </IconButton>

          </Box>
          
        </Toolbar>
      </Container>
    </AppBar>
  );
}