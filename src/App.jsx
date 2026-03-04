import React, { useMemo, useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Typography, Box, Button, Chip, Grid, Card, CardContent, CardMedia } from '@mui/material';
import Navbar from './components/Navbar';
import ContactModal from './components/ContactModal';
import Home from './pages/Home';
import { AboutMe } from './pages/AboutMe';
import { Projects } from './pages/Projects';
import { Experience } from './pages/Experience';

// Personalizamos los colores para que coincidan con tu imagen

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  // 1. Estado para el modo oscuro (por defecto falso/claro)
  const [darkMode, setDarkMode] = useState(false);

  // 2. Función para alternar el tema
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // 3. Creamos el tema dinámicamente usando useMemo
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#e56e24'
          },
          secondary: {
            main: '#e52451'
          },
          background: {
            default: darkMode ? '#121212' : '#ffffff',
            paper: darkMode ? '#1e1e1e' : '#f8fafc'
          },
        },
        typography: {
          fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
        },
      }),
    [darkMode], // Se vuelve a calcular solo cuando darkMode cambia
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar onOpenContact={() => setIsContactOpen(true)} isDarkMode={darkMode} toggleTheme={toggleTheme} />
      <ContactModal open={isContactOpen} handleClose={() => setIsContactOpen(false)} />
      <Home />
      <AboutMe />
      <Experience />
      <Projects />
      <Box sx={{ bgcolor: '#333333', color: 'white', py: 4, textAlign: 'center' }}>
        <Typography variant="body2">&copy; 2024 Tu Nombre. Construido con React y Material UI.</Typography>
      </Box>

    </ThemeProvider>
  );
}