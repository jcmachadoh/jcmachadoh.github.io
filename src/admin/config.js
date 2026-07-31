// ============================================================
// CONFIGURACIÓN DEL PANEL DE ADMINISTRACIÓN (/admin)
// ------------------------------------------------------------
// Completa los valores con TUS datos antes de usar el panel.
// NO subas contraseñas en texto plano: usa un hash.
// ============================================================

export const ADMIN_CONFIG = {
    // --- Credenciales del panel ---
    // Usuario que permitirá entrar al panel.
    username: 'admin',

    // Hash SHA-256 de tu contraseña (NUNCA la contraseña en texto plano).
    // Genera el hash con el script incluido:
    //   node scripts/hash-password.js "tuClaveSegura"
    passwordHash: 'fdc7e16a71e905e571c2d4e8f8ad193daf9da3bb1e02310768c84ec25ffe473c',

    // Email que recibirá el código de verificación 2FA.
    // Debe ser una cuenta verificada en tu cuenta de EmailJS (plan gratuito).
    adminEmail: 'dev.jcmachadoh@gmail.com',

    // --- EmailJS (se usa para enviar el código 2FA) ---
    emailjs: {
        // Service ID de EmailJS (https://dashboard.emailjs.com/admin/integration)
        serviceId: 'service_ubd7ryb',
        // Template ID del email del código 2FA
        templateId: 'template_nfko3s7',
        // Public Key de EmailJS
        publicKey: 'vB82pXr_KbBJFN8zN',
        // Nombre de la variable en tu template de EmailJS que recibirá el código
        codeVariableName: 'code',
    },

    // --- GitHub (repositorio donde vive el CV) ---
    github: {
        owner: 'jcmachadoh',
        repo: 'jcmachadoh.github.io',
        branch: 'main',
    },

    // Archivo que se actualiza al guardar los proyectos
    dataFilePath: 'src/data/projects.js',

    // Carpeta base donde se suben las imágenes de los proyectos
    imagesFolderPath: 'public/projects',
};

// Duración de la sesión de admin (por defecto 2 horas)
export const SESSION_DURATION_MS = 2 * 60 * 60 * 1000;

// Claves de almacenamiento en el navegador
export const SESSION_STORAGE_KEY = 'jcmachadoh.admin.session';
export const GITHUB_TOKEN_STORAGE_KEY = 'jcmachadoh.github.token';
export const REDIRECT_STORAGE_KEY = 'jcmachadoh.redirect';
