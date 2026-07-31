import { useState } from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ContactModal from '../components/ContactModal';
import Home from '../pages/Home';
import { AboutMe } from '../pages/AboutMe';
import { Experience } from '../pages/Experience';
import { Projects } from '../pages/Projects';

export const SiteLayout = ({ isDarkMode, toggleTheme }) => {
    const [isContactOpen, setIsContactOpen] = useState(false);

    return (
        <>
            <Navbar onOpenContact={() => setIsContactOpen(true)} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <ContactModal open={isContactOpen} handleClose={() => setIsContactOpen(false)} />
            <Home />
            <AboutMe />
            <Experience />
            <Projects />
            <Box sx={{ bgcolor: '#333333', color: 'white', py: 4, textAlign: 'center' }}>
                <Typography variant="body2" gutterBottom>
                    &copy; {new Date().getFullYear()} José Carlos Machado Hernández. Construido con React y Material UI.
                </Typography>
                <MuiLink
                    component={Link}
                    to="/admin"
                    underline="hover"
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: 'rgba(255,255,255,0.55)',
                        fontSize: '0.75rem',
                        '&:hover': { color: 'white' }
                    }}
                >
                    <LockIcon sx={{ fontSize: 14 }} />
                    Admin
                </MuiLink>
            </Box>
        </>
    );
};
