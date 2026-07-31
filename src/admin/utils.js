export const slugify = (text) =>
    String(text || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `proyecto-${Date.now()}`;

export const sanitizeFileName = (name) => {
    const clean = String(name || '').trim();
    const extMatch = clean.match(/\.([a-zA-Z0-9]+)$/);
    const ext = extMatch ? `.${extMatch[1].toLowerCase()}` : '';
    const base = clean
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return `${base || 'imagen'}${ext}`;
};

export const toDraft = (project) => {
    const images = (project.images || []).map((path) => ({ path, kind: 'existing' }));
    const firstPath = images[0]?.path || project.thumbnail || '';
    const folder = firstPath.split('/')[0] || project.id || '';

    return {
        draftKey: String(project.id),
        id: String(project.id),
        isOnline: Boolean(project.isOnline),
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        es: project.es || { name: '', smartDescription: '', fullDescription: '' },
        en: project.en || { name: '', smartDescription: '', fullDescription: '' },
        pt: project.pt || { name: '', smartDescription: '', fullDescription: '' },
        folder,
        images,
        thumbnailPath: project.thumbnail || firstPath || '',
        removedPaths: [],
    };
};

export const serializeProjects = (projects) =>
    `// ============================================================\n` +
    `// DATOS DE LOS PROYECTOS DEL CV\n` +
    `// Este archivo se actualiza desde el panel de administracion (/admin).\n` +
    `// No lo edites a mano si usas el panel.\n` +
    `// ============================================================\n\n` +
    `export const projects = ${JSON.stringify(projects, null, 4)};\n`;
