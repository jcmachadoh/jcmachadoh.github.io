import { ADMIN_CONFIG, GITHUB_TOKEN_STORAGE_KEY } from '../config';

const API = 'https://api.github.com';
const { owner, repo, branch } = ADMIN_CONFIG.github;

export class GitHubError extends Error {}

const getHeaders = () => {
    const token = localStorage.getItem(GITHUB_TOKEN_STORAGE_KEY);
    if (!token) {
        throw new GitHubError('No hay token de GitHub. Configúralo en el panel.');
    }
    return {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
    };
};

async function request(path, options = {}) {
    let res;
    try {
        res = await fetch(`${API}${path}`, { ...options, headers: getHeaders() });
    } catch {
        throw new GitHubError('No se pudo conectar con GitHub. Revisa tu conexión.');
    }

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new GitHubError(body.message || `GitHub respondió con error ${res.status}`);
    }

    return res.status === 204 ? null : res.json();
}

const utf8ToBase64 = (text) => {
    const bytes = new TextEncoder().encode(text);
    let binary = '';
    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });
    return btoa(binary);
};

// Verifica que el token tenga acceso al repositorio configurado
export const testToken = () => request(`/repos/${owner}/${repo}`);

export const getFileSha = async (path) => {
    const data = await request(`/repos/${owner}/${repo}/contents/${path}?ref=${branch}`);
    return data.sha;
};

export const updateFile = async ({ path, content, sha, message }) => {
    await request(`/repos/${owner}/${repo}/contents/${path}`, {
        method: 'PUT',
        body: JSON.stringify({
            message,
            branch,
            content: utf8ToBase64(content),
            ...(sha ? { sha } : {}),
        }),
    });
};

// Sube (o sobrescribe) una imagen ya codificada en base64
export const uploadImage = async ({ path, base64, message }) => {
    const sha = await getFileSha(path).catch(() => null);
    await request(`/repos/${owner}/${repo}/contents/${path}`, {
        method: 'PUT',
        body: JSON.stringify({
            message,
            branch,
            content: base64,
            ...(sha ? { sha } : {}),
        }),
    });
};

// Elimina una imagen del repositorio si existe
export const deleteImage = async ({ path, message }) => {
    const sha = await getFileSha(path).catch(() => null);
    if (!sha) return;
    await request(`/repos/${owner}/${repo}/contents/${path}`, {
        method: 'DELETE',
        body: JSON.stringify({ message, branch, sha }),
    });
};
