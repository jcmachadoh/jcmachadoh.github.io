import { useState } from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import { useLanguageStore } from '../store/useLanguage';
import { translations } from '../language/translate';

import { projects } from '../data/projects';

import { ProjectItem } from '../components/ProjectItem';
import { ProjectModal } from '../components/ProjectModal';

export const Projects = () => {
    const language = useLanguageStore((state) => state.language);
    const t = translations[language].sections;

    const [selectedProject, setSelectedProject] = useState(null);

    const handleOpenModal = (project) => {
        setSelectedProject(project);
    };

    const handleCloseModal = () => {
        setSelectedProject(null);
    };

    const localizedProjects = projects.map((project) => ({
        ...project,
        ...project[language],
    }));

    return (
        <Box id="proyectos" sx={{ bgcolor: 'background.paper', py: 8 }}>
            <Container maxWidth="lg">
                <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom mb={5}>
                    {t.projects}
                </Typography>

                <Grid container spacing={3} alignItems="stretch">
                    {localizedProjects.map((project) => (
                        <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: 'flex' }}>
                            <Box sx={{ width: '100%' }}>
                                <ProjectItem project={project} handleOpenModal={handleOpenModal} />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <ProjectModal
                project={selectedProject}
                open={Boolean(selectedProject)}
                handleClose={handleCloseModal}
            />
        </Box>
    );
};
