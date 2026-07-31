const TARGET_W = 1280;
const TARGET_H = 720;
const MIN_RATIO = 1.4;
const MAX_RATIO = 2.2;
const QUALITY = 0.9;

const loadImage = (file) =>
    new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('No se pudo leer la imagen.'));
        };
        img.src = url;
    });

const canvasToImage = (canvas) =>
    new Promise((resolve) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    resolve({ dataUrl: canvas.toDataURL('image/png'), ext: 'png' });
                    return;
                }
                const reader = new FileReader();
                reader.onload = () =>
                    resolve({
                        dataUrl: reader.result,
                        ext: blob.type === 'image/webp' ? 'webp' : 'png',
                    });
                reader.readAsDataURL(blob);
            },
            'image/webp',
            QUALITY
        );
    });

export const normalizeImage = async (file) => {
    const img = await loadImage(file);
    const srcW = img.naturalWidth;
    const srcH = img.naturalHeight;
    const ratio = srcW / srcH;

    const canvas = document.createElement('canvas');
    canvas.width = TARGET_W;
    canvas.height = TARGET_H;
    const ctx = canvas.getContext('2d');

    const coverScale = Math.max(TARGET_W / srcW, TARGET_H / srcH);
    const coverW = srcW * coverScale;
    const coverH = srcH * coverScale;
    const coverX = (TARGET_W - coverW) / 2;
    const coverY = (TARGET_H - coverH) / 2;

    if (ratio >= MIN_RATIO && ratio <= MAX_RATIO) {
        ctx.drawImage(img, coverX, coverY, coverW, coverH);
    } else {
        ctx.drawImage(img, coverX, coverY, coverW, coverH);
        ctx.filter = 'blur(40px) saturate(0.85)';
        ctx.drawImage(img, coverX, coverY, coverW, coverH);
        ctx.filter = 'none';

        const fitScale = Math.min(TARGET_W / srcW, TARGET_H / srcH);
        const fitW = srcW * fitScale;
        const fitH = srcH * fitScale;
        ctx.drawImage(img, (TARGET_W - fitW) / 2, (TARGET_H - fitH) / 2, fitW, fitH);
    }

    const { dataUrl, ext } = await canvasToImage(canvas);
    const base = String(file.name || 'imagen').replace(/\.[^/.]+$/, '');
    return { name: `${base}.${ext}`, dataUrl };
};
