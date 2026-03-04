import { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useLanguageStore } from '../store/useLanguage'; // Ajusta la ruta si es necesario
import { translations } from '../language/translate';           // Ajusta la ruta si es necesario

// Importamos tus JSON (ajusta las rutas a tu proyecto real)
import projectsES from '../language/es/projects_es.json';
import projectsEN from '../language/en/projects_en.json';
import projectsPT from '../language/pt/projects_pt.json';

import { ProjectItem } from '../components/ProjectItem';
import { ProjectModal } from '../components/ProjectModal';

// --- IMPORTACIONES DE SWIPER ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// Importamos los estilos de Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const Projects = () => {
    const language = useLanguageStore((state) => state.language);
    const t = translations[language].sections;

    // Lógica para cambiar el JSON
    let projectsData = projectsES;
    if (language === 'en') {
        projectsData = projectsEN;
    } else if (language === 'pt') {
        projectsData = projectsPT;
    }

    const [selectedProject, setSelectedProject] = useState(null);

    const handleOpenModal = (project) => {
        setSelectedProject(project);
    };

    const handleCloseModal = () => {
        setSelectedProject(null);
    };

    return (
        <Box id="proyectos" sx={{ bgcolor: 'background.paper', py: 8 }}>
            <Container maxWidth="lg">
                <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom mb={5}>
                    {t.projects}
                </Typography>

                {/* Contenedor del Carrusel con un poco de padding para que las flechas no corten las tarjetas */}
                <Box sx={{ px: { xs: 1, md: 4 } }}>
                    <Swiper
                        // Modulos que activamos
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1} // 1 tarjeta por defecto (celulares)
                        breakpoints={{
                            768: { slidesPerView: 2 }, // 2 tarjetas en PC/Tablets
                        }}
                        navigation // Flechas a los lados
                        pagination={{
                            clickable: true,
                            dynamicBullets: true // Bolitas dinámicas debajo
                        }}
                        autoplay={{
                            delay: 3500, // Tiempo entre cada movimiento (3.5 segundos)
                            disableOnInteraction: false, // Sigue moviéndose aunque el usuario haga clic
                            pauseOnMouseEnter: true // Se detiene al hacer hover
                        }}
                        // El padding bottom es vital para que las bolitas no tapen las tarjetas
                        style={{ paddingBottom: '50px', paddingTop: '10px' }}
                    >
                        {projectsData.map((item) => (
                            // height: 'auto' hace que todas las slides tengan el alto de la más grande
                            <SwiperSlide key={item.id} style={{ height: 'auto' }}>
                                <ProjectItem project={item} handleOpenModal={handleOpenModal} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
            </Container>

            {/* Modal que se abre al hacer clic */}
            <ProjectModal
                project={selectedProject}
                open={Boolean(selectedProject)}
                handleClose={handleCloseModal}
            />
        </Box>
    );
};