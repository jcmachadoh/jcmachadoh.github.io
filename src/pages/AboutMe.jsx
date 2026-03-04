import { Container, Typography, Box } from '@mui/material';

import { useLanguageStore } from '../store/useLanguage'; // Ajusta la ruta si es necesario
import { translations } from '../language/translate';           // Ajusta la ruta si es necesario

import skillsData from '../language/skills.json';                // Ajusta la ruta a donde tengas el json
import { SkillsItems } from '../components/SkillsItems';

export const AboutMe = () => {

    const languajes = skillsData.filter(item => item.type === 'Language');
    const frameworks = skillsData.filter(item => item.type === 'Framework');
    const database = skillsData.filter(item => item.type === 'Database');
    const tools = skillsData.filter(item => item.type === 'Tool');

    const language = useLanguageStore((state) => state.language);
    const t = translations[language];
    const { aboutMe, sections } = t;

    return (
        <Box id="sobre-mi" sx={{ bgcolor: 'background.paper', py: 8 }}>
            <Container maxWidth="md">
                <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>{sections.about}</Typography>
                <Typography variant="body1" paragraph>
                    {aboutMe.description}
                </Typography>

                <Typography variant="subtitle1" fontWeight="bold" gutterBottom mt={3}>{aboutMe.languages}</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {languajes.map(languaje => (
                        // Azul Rey
                        <SkillsItems key={languaje.id} items={languaje} color="#3b82f6" />
                    ))}
                </Box>

                <Typography variant="subtitle1" fontWeight="bold" gutterBottom mt={3}>{aboutMe.frameworks}</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {frameworks.map(framework => (
                        // Rojo/Rosado (Tu color secundario)
                        <SkillsItems key={framework.id} items={framework} color="#e52451" />
                    ))}
                </Box>

                <Typography variant="subtitle1" fontWeight="bold" gutterBottom mt={3}>{aboutMe.databases}</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {database.map(db => (
                        // Verde Esmeralda
                        <SkillsItems key={db.id} items={db} color="#10b981" />
                    ))}
                </Box>

                <Typography variant="subtitle1" fontWeight="bold" gutterBottom mt={3}>{aboutMe.tools}</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {tools.map(tecnologie => (
                        // Naranja (Tu color principal)
                        <SkillsItems key={tecnologie.id} items={tecnologie} color="#e56e24" />
                    ))}
                </Box>
            </Container>
        </Box>
    )
}