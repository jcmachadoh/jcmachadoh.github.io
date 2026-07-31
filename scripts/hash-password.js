/* global process */
import { createHash } from 'node:crypto';

const password = process.argv[2];

if (!password) {
    console.error('Uso: node scripts/hash-password.js "tuContraseña"');
    console.error('Copia el hash resultante y pégalo en ADMIN_CONFIG.passwordHash de src/admin/config.js');
    process.exit(1);
}

const hash = createHash('sha256').update(password).digest('hex');
console.log(`Hash SHA-256: ${hash}`);
