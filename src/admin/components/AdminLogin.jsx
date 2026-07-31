import { useState } from 'react';
import {
    Box, Card, CardContent, Typography, TextField, Button, Alert,
    CircularProgress, IconButton, InputAdornment, Link, Stepper, Step, StepLabel
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ADMIN_CONFIG } from '../config';
import { sha256 } from '../api/password';
import { sendVerificationCode, verifyVerificationCode } from '../api/twoFactor';
import { testToken } from '../api/github';
import { useAdminStore } from '../store';

const steps = ['Credenciales', 'Verificación 2FA', 'Conexión GitHub'];

export const AdminLogin = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [code, setCode] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');

    const clearStatus = () => {
        setError('');
        setInfo('');
    };

    const handleCredentials = async (e) => {
        e.preventDefault();
        clearStatus();

        if (username.trim() !== ADMIN_CONFIG.username) {
            setError('El usuario no es correcto.');
            return;
        }
        if (!ADMIN_CONFIG.passwordHash) {
            setError('Configura tu contraseña en src/admin/config.js. Ejecuta: node scripts/hash-password.js "tuClave"');
            return;
        }
        if (!password) {
            setError('Escribe tu contraseña.');
            return;
        }

        const hash = await sha256(password);
        if (hash !== ADMIN_CONFIG.passwordHash) {
            setError('La contraseña no es correcta.');
            return;
        }

        setLoading(true);
        try {
            await sendVerificationCode();
            setInfo(`Enviamos un código de 6 dígitos a ${ADMIN_CONFIG.adminEmail}. Revisa tu bandeja de entrada.`);
            setActiveStep(1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCode = (e) => {
        e.preventDefault();
        clearStatus();

        const result = verifyVerificationCode(code);
        if (!result.ok) {
            setError(result.message);
            return;
        }

        const { githubToken, login } = useAdminStore.getState();
        if (githubToken) {
            login();
        } else {
            setActiveStep(2);
        }
    };

    const resendCode = async () => {
        clearStatus();
        setLoading(true);
        try {
            await sendVerificationCode();
            setInfo('Enviamos un nuevo código a tu email.');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleToken = async (e) => {
        e.preventDefault();
        clearStatus();
        setLoading(true);
        const { setGithubToken, clearGithubToken, login } = useAdminStore.getState();
        try {
            setGithubToken(token);
            await testToken();
            login();
        } catch (err) {
            clearGithubToken();
            setError(`${err.message} Verifica que el token tenga permiso de escritura (Contents: read/write) sobre el repositorio.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                p: 2,
            }}
        >
            <Card sx={{ width: '100%', maxWidth: 460, borderRadius: 3, boxShadow: 6 }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 1.5,
                            }}
                        >
                            <LockIcon sx={{ color: 'white', fontSize: 30 }} />
                        </Box>
                        <Typography variant="h5" fontWeight="bold">
                            Panel de Administración
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Acceso restringido
                        </Typography>
                    </Box>

                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {info && <Alert severity="info" sx={{ mb: 2 }}>{info}</Alert>}

                    {activeStep === 0 && (
                        <form onSubmit={handleCredentials}>
                            <TextField
                                fullWidth
                                label="Usuario"
                                variant="outlined"
                                margin="normal"
                                autoComplete="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Contraseña"
                                variant="outlined"
                                margin="normal"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ArrowForwardIcon />}
                                sx={{ mt: 2, textTransform: 'none', fontWeight: 'bold' }}
                            >
                                Continuar
                            </Button>
                        </form>
                    )}

                    {activeStep === 1 && (
                        <form onSubmit={handleCode}>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Introduce el código de 6 dígitos que recibiste por email.
                            </Typography>
                            <TextField
                                fullWidth
                                label="Código de verificación"
                                variant="outlined"
                                margin="normal"
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                inputProps={{ inputMode: 'numeric', maxLength: 6, style: { letterSpacing: '0.5em', fontSize: '1.4rem', textAlign: 'center' } }}
                                required
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                startIcon={<EmailIcon />}
                                sx={{ mt: 2, textTransform: 'none', fontWeight: 'bold' }}
                            >
                                Verificar y entrar
                            </Button>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5 }}>
                                <Button size="small" color="inherit" startIcon={<ArrowBackIcon />} onClick={() => setActiveStep(0)}>
                                    Volver
                                </Button>
                                <Button size="small" color="primary" disabled={loading} onClick={resendCode}>
                                    Reenviar código
                                </Button>
                            </Box>
                        </form>
                    )}

                    {activeStep === 2 && (
                        <form onSubmit={handleToken}>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Para poder guardar los cambios y subir imágenes, el panel hace commit directo a tu
                                repositorio de GitHub. Configura un{' '}
                                <Link
                                    href="https://github.com/settings/tokens?type=beta"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    token de acceso personal
                                </Link>{' '}
                                con permiso de lectura y escritura (Contents: read/write) sobre el repositorio{' '}
                                <b>{ADMIN_CONFIG.github.owner}/{ADMIN_CONFIG.github.repo}</b>.
                            </Typography>
                            <TextField
                                fullWidth
                                label="GitHub Personal Access Token"
                                variant="outlined"
                                margin="normal"
                                type="password"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="github_pat_..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <GitHubIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                required
                            />
                            <Typography variant="caption" color="text.secondary">
                                El token se guarda únicamente en tu navegador (localStorage) y nunca se sube al repositorio.
                            </Typography>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <GitHubIcon />}
                                sx={{ mt: 2, textTransform: 'none', fontWeight: 'bold' }}
                            >
                                Conectar y entrar
                            </Button>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5 }}>
                                <Button size="small" color="inherit" startIcon={<ArrowBackIcon />} onClick={() => setActiveStep(1)}>
                                    Volver
                                </Button>
                            </Box>
                        </form>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};
