import { useState, useEffect } from 'react';
import { generarImagenHorario } from '@/lib/compartir';

const preloadHtml2Canvas = () => import('html2canvas-pro');

/**
 * Gestiona la generación, copia y descarga de la imagen del horario.
 */
export function useCompartir({ horarioActivo, resolvedTheme, onAbrirModal, setMensajeModal, onExito, onError }) {
    const [shareDataUrl, setShareDataUrl] = useState(null);
    const [shareFilename, setShareFilename] = useState('mi-horario.png');

    useEffect(() => { preloadHtml2Canvas(); }, []);

    const abrirShareModal = async () => {
        const filename = `horario-${horarioActivo}.png`;
        setShareFilename(filename);
        setShareDataUrl(null);
        onAbrirModal?.();
        const dataUrl = await generarImagenHorario({ tema: resolvedTheme });
        setShareDataUrl(dataUrl);
    };

    const copiarImagen = async () => {
        if (!shareDataUrl) return;
        try {
            const res = await fetch(shareDataUrl);
            const blob = await res.blob();
            const pngBlob = blob.type === 'image/png'
                ? blob
                : new Blob([await blob.arrayBuffer()], { type: 'image/png' });

            if (navigator.clipboard && window.ClipboardItem) {
                await navigator.clipboard.write([new window.ClipboardItem({ 'image/png': pngBlob })]);
                setMensajeModal?.('Imagen copiada al portapapeles.');
                onExito?.();
            } else {
                setMensajeModal?.('Tu dispositivo no permite copiar la imagen directamente. Mantén presionada la imagen de arriba para copiarla.');
                onError?.();
            }
        } catch (e) {
            console.error('Fallo al copiar la imagen', e);
            setMensajeModal?.('Tu dispositivo no permite copiar la imagen directamente. Mantén presionada la imagen de arriba para copiarla.');
            onError?.();
        }
    };

    const descargarImagen = () => {
        if (!shareDataUrl) return;
        const link = document.createElement('a');
        link.download = shareFilename;
        link.href = shareDataUrl;
        link.click();
    };

    return { shareDataUrl, shareFilename, abrirShareModal, copiarImagen, descargarImagen };
}
