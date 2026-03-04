import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, IconButton, Typography, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

export default function ContactModal({ open, handleClose }) {
    // Manejamos el estado de la petición: '', 'loading', 'success', 'error'
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        const form = e.target;
        const data = new FormData(form);

        try {
            // REEMPLAZA ESTA URL CON LA QUE TE DIO FORMSPREE
            const response = await fetch('https://formspree.io/f/TU_ID_DE_FORMSPREE', {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                setStatus('success');
                form.reset(); // Limpia el formulario
                // Esperamos 3 segundos para que el usuario lea el éxito y cerramos el modal
                setTimeout(() => {
                    setStatus('');
                    handleClose();
                }, 3000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
            console.log(error);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="span" fontWeight="bold">
                    Envíame un mensaje
                </Typography>
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent dividers>

                    {/* Alertas de éxito o error */}
                    {status === 'success' && <Alert severity="success" sx={{ mb: 2 }}>¡Mensaje enviado con éxito! Te responderé pronto.</Alert>}
                    {status === 'error' && <Alert severity="error" sx={{ mb: 2 }}>Hubo un error al enviar. Por favor, intenta de nuevo.</Alert>}

                    {/* IMPORTANTE: Observa que agregamos la propiedad "name" a cada input */}
                    <TextField fullWidth name="nombre" label="Tu Nombre" variant="outlined" margin="normal" required />
                    <TextField fullWidth name="email" label="Tu Correo" type="email" variant="outlined" margin="normal" required />
                    <TextField fullWidth name="mensaje" label="Mensaje" variant="outlined" margin="normal" multiline rows={4} required />

                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose} color="inherit" disabled={status === 'loading'}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" color="primary" endIcon={<SendIcon />} disabled={status === 'loading'}>
                        {status === 'loading' ? 'Enviando...' : 'Enviar Mensaje'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}