import { create } from 'zustand';

// Creamos el store. Por defecto, empezará en español ('es')
export const useLanguageStore = create((set) => ({
    language: 'es',
    setLanguage: (newLanguage) => set({ language: newLanguage }),
}));