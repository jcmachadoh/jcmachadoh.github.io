import { Container, Typography, Box } from '@mui/material';
import { ExperienceItem } from '../components/ExperienceItem';

import { useLanguageStore } from '../store/useLanguage';
import { translations } from '../language/translate';
import experienceES from '../language/es/experience_es.json';
import experienceEN from '../language/en/experience_en.json';
import experiencePT from '../language/pt/experience_pt.json';

export const Experience = () => {
    const language = useLanguageStore((state) => state.language);
    const t = translations[language].sections.experience;

    const dataMap = {
        es: experienceES,
        en: experienceEN,
        pt: experiencePT
    };

    const experienceData = dataMap[language] || experienceES;

    return (
        <Container id="experiencia" maxWidth="md" sx={{ py: 8 }}>
            <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom mb={5}>{t}</Typography>

            <Box sx={{ ml: { xs: 2, md: 10 }, borderLeft: '3px solid #2563eb', pl: 4, position: 'relative' }}>
                {experienceData.map(experience => <ExperienceItem key={experience.id} experience={experience} />)}
            </Box>
        </Container>
    )
}
