import { Container, Typography, Box } from '@mui/material';
import { useLanguageStore } from '../store/useLanguage';
import { translations } from '../language/translate';
import skillsData from '../language/skills.json';
import { SkillsItems } from '../components/SkillsItems';
// Importamos el nuevo carrusel
import { TechMarquee } from '../components/TechMarquee';

export const AboutMe = () => {

    const languajes = skillsData.filter(item => item.type === 'Language');
    const frameworks = skillsData.filter(item => item.type === 'Framework');
    const database = skillsData.filter(item => item.type === 'Database');
    const tools = skillsData.filter(item => item.type === 'Tool');

    const toolsAndDb = [...database, ...tools];

    const { language } = useLanguageStore();
    const t = translations[language];
    const { aboutMe, sections } = t;

    return (
        <Box id="sobre-mi" sx={{ bgcolor: 'background.paper', py: 8, overflow: 'hidden' }}>
            {/* Cambiamos a maxWidth="lg" para que coincida EXACTAMENTE con la sección de proyectos */}
            <Container maxWidth="lg">
                <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
                    {sections.about}
                </Typography>

                {/* Le damos un maxWidth a la descripción para que no se estire demasiado a lo ancho y sea fácil de leer */}
                <Typography variant="body1" paragraph textAlign="center" color="text.secondary" sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}>
                    {aboutMe.description}
                </Typography>

                {/* --- AHORA LOS CARRUSELES ESTÁN DENTRO DEL CONTAINER --- */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                    <Box>
                        <Typography variant="subtitle2" fontWeight="bold" textAlign="center" color="primary" gutterBottom>
                            {aboutMe.languages.toUpperCase()}
                        </Typography>
                        <TechMarquee items={languajes} direction="normal" speed="20s" />
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" fontWeight="bold" textAlign="center" color="primary" gutterBottom mt={2}>
                            {aboutMe.frameworks.toUpperCase()}
                        </Typography>
                        <TechMarquee items={frameworks} direction="reverse" speed="25s" />
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" fontWeight="bold" textAlign="center" color="primary" gutterBottom mt={2}>
                            {aboutMe.databases.toUpperCase()} & {aboutMe.tools.toUpperCase()}
                        </Typography>
                        <TechMarquee items={toolsAndDb} direction="normal" speed="30s" />
                    </Box>

                </Box>
            </Container>
        </Box>
    );
}