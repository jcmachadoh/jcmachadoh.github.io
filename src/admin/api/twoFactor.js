import emailjs from '@emailjs/browser';
import { ADMIN_CONFIG } from '../config';

let pending = null;

export const sendVerificationCode = async () => {
    const { serviceId, templateId, publicKey, codeVariableName } = ADMIN_CONFIG.emailjs;

    if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS no está configurado en src/admin/config.js');
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    pending = { code, expiresAt: Date.now() + 5 * 60 * 1000 };

    await emailjs.send(
        serviceId,
        templateId,
        {
            to_email: ADMIN_CONFIG.adminEmail,
            [codeVariableName]: code,
        },
        { publicKey }
    );

    return true;
};

export const verifyVerificationCode = (input) => {
    const value = String(input || '').trim();

    if (!pending) {
        return { ok: false, message: 'No hay un código pendiente. Solicita uno nuevo.' };
    }
    if (Date.now() > pending.expiresAt) {
        pending = null;
        return { ok: false, message: 'El código ha expirado. Solicita uno nuevo.' };
    }
    if (value !== pending.code) {
        return { ok: false, message: 'El código introducido no es correcto.' };
    }

    pending = null;
    return { ok: true };
};
