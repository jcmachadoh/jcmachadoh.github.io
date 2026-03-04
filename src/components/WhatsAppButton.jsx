import React from 'react';
import { Fab } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export default function WhatsAppButton() {
    // Aquí pones tu número real. 
    // IMPORTANTE: Usa el código de tu país pero sin el signo '+'. 
    // Ejemplo para México (+52) sería: 521234567890
    const phoneNumber = "521234567890";
    const message = "¡Hola! Vi tu portafolio y me gustaría hablar contigo sobre una oportunidad.";

    // Generamos el enlace oficial de la API de WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <Fab
            color="success"
            aria-label="whatsapp"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
                position: 'fixed',
                bottom: 24, // Distancia desde abajo
                right: 24,  // Distancia desde la derecha
                bgcolor: '#25D366', // El verde oficial de WhatsApp
                '&:hover': { bgcolor: '#128C7E' }, // Verde un poco más oscuro al pasar el mouse
                zIndex: 1000 // Asegura que siempre esté por encima de todo
            }}
        >
            <WhatsAppIcon sx={{ color: 'white', fontSize: 32 }} />
        </Fab>
    );
}