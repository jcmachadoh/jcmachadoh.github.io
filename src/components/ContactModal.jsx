import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Typography, Button, IconButton, TextField, Box,
    Switch, FormControlLabel, FormGroup
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';

const ContactModal = ({ open, handleClose }) => {
    // Estados para guardar los datos del formulario
    const [nombre, setNombre] = useState('');
    const [mensaje, setMensaje] = useState('');
    
    // Estado para el Switch (true = WhatsApp, false = Email)
    const [isWhatsApp, setIsWhatsApp] = useState(true);

    // TUS DATOS DE CONTACTO (Cámbialos por los tuyos)
    const miNumeroWhatsApp = "5354722617"; 
    const miCorreoElectronico = "jcmachadoh93@gmail.com"; 

    const handleSubmit = (e) => {
        e.preventDefault(); // Evita que la página se recargue

        if (isWhatsApp) {
            // --- LÓGICA DE WHATSAPP ---
            const textoBase = `¡Hola JC! Soy *${nombre}*.%0A%0A${mensaje}%0A%0AEnviado desde tu portafolio web.`;
            const url = `https://wa.me/${miNumeroWhatsApp}?text=${textoBase}`;
            window.open(url, '_blank');
        } else {
            // --- LÓGICA DE EMAIL ---
            // encodeURIComponent asegura que los espacios y saltos de línea se lean bien en el correo
            const asunto = encodeURIComponent(`Nuevo mensaje de ${nombre} (Desde Portafolio)`);
            const cuerpo = encodeURIComponent(`Hola JC,\n\nSoy ${nombre}.\n\n${mensaje}\n\n---\nEnviado desde tu portafolio web.`);
            const mailtoLink = `mailto:${miCorreoElectronico}?subject=${asunto}&body=${cuerpo}`;
            
            // Abrimos el cliente de correo del usuario
            window.location.href = mailtoLink;
        }
        
        // Cerramos el modal y limpiamos el formulario
        setNombre('');
        setMensaje('');
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" component="span" fontWeight="bold" color="primary">
                    Contáctame
                </Typography>
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    
                    {/* --- SWITCH MODERN0 --- */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, p: 1, bgcolor: 'background.default', borderRadius: 2 }}>
                        <FormGroup>
                            <FormControlLabel 
                                control={
                                    <Switch 
                                        checked={isWhatsApp} 
                                        onChange={(e) => setIsWhatsApp(e.target.checked)} 
                                        color="success"
                                    />
                                } 
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {isWhatsApp ? <WhatsAppIcon color="success" /> : <EmailIcon color="primary" />}
                                        <Typography fontWeight="bold">
                                            {isWhatsApp ? "Enviar por WhatsApp" : "Enviar por Email"}
                                        </Typography>
                                    </Box>
                                }
                            />
                        </FormGroup>
                    </Box>

                    <Typography variant="body2" color="text.secondary" paragraph textAlign="center">
                        {isWhatsApp 
                            ? "Escribe tu mensaje y continuaremos la charla de forma rápida por WhatsApp." 
                            : "Escribe tu mensaje y se abrirá tu aplicación de correo para enviármelo."}
                    </Typography>

                    <TextField
                        fullWidth
                        label="Tu Nombre o Empresa"
                        variant="outlined"
                        margin="normal"
                        required
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    
                    <TextField
                        fullWidth
                        label="¿De qué trata tu mensaje?"
                        variant="outlined"
                        margin="normal"
                        multiline
                        rows={4}
                        required
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                    />
                </DialogContent>

                <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
                    <Button onClick={handleClose} color="inherit" sx={{ textTransform: 'none' }}>
                        Cancelar
                    </Button>
                    
                    {/* Botón dinámico que cambia según el Switch */}
                    <Button
                        type="submit"
                        variant="contained"
                        color={isWhatsApp ? "success" : "primary"}
                        startIcon={isWhatsApp ? <WhatsAppIcon /> : <EmailIcon />}
                        sx={{ textTransform: 'none', fontWeight: 'bold' }}
                    >
                        {isWhatsApp ? "Enviar por WhatsApp" : "Preparar Email"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ContactModal;