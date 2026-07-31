import { create } from 'zustand';
import { SESSION_STORAGE_KEY, GITHUB_TOKEN_STORAGE_KEY, SESSION_DURATION_MS } from './config';

const readSession = () => {
    try {
        const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (!raw) return null;
        const { expiresAt } = JSON.parse(raw);
        if (expiresAt > Date.now()) return { expiresAt };
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
        /* ignorar */
    }
    return null;
};

export const useAdminStore = create((set) => ({
    isAuthenticated: Boolean(readSession()),
    githubToken: localStorage.getItem(GITHUB_TOKEN_STORAGE_KEY) || '',

    restoreSession: () => {
        set({ isAuthenticated: Boolean(readSession()) });
    },

    login: () => {
        sessionStorage.setItem(
            SESSION_STORAGE_KEY,
            JSON.stringify({ expiresAt: Date.now() + SESSION_DURATION_MS })
        );
        set({ isAuthenticated: true });
    },

    logout: () => {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        set({ isAuthenticated: false });
    },

    setGithubToken: (token) => {
        const clean = token.trim();
        localStorage.setItem(GITHUB_TOKEN_STORAGE_KEY, clean);
        set({ githubToken: clean });
    },

    clearGithubToken: () => {
        localStorage.removeItem(GITHUB_TOKEN_STORAGE_KEY);
        set({ githubToken: '' });
    },
}));
