import { Container, Typography, Box, Button, ImageListItem, Avatar } from '@mui/material';
import { useLanguageStore } from '../store/useLanguage';
import { translations } from '../language/translate';
import bandera from '../assets/flag.jpg';
const Home = () => {
    const { language } = useLanguageStore();
    const t = translations[language].hero;
    return (
        <Container id="inicio" maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', py: 10 }}>

            <Avatar sx={{ width: 120, height: 120, mx: 'auto', mb: 3 }} src={bandera} alt="Foto de perfil" />

            <Typography variant="h3" fontWeight="bold" gutterBottom>
                {t.greeting} <Box component="span" color="primary.main">José Carlos Machado Hernández</Box>
            </Typography>
            <Typography variant="h5" color="text.secondary" fontWeight="bold" gutterBottom>
                {t.role}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                {t.description}
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button variant="contained" size="large" sx={{ borderRadius: '30px', textTransform: 'none' }} href="#proyectos">
                    {t.btnProjects}
                </Button>
                <Button variant="outlined" size="large" sx={{ borderRadius: '30px', textTransform: 'none' }} href='/download/jcmachadoh93.pdf'>
                    {t.btnCV}
                </Button>
            </Box>
        </Container>
    )
}

export default Home;