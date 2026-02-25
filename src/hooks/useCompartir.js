import { useState } from 'react';
import { generarImagenHorario } from '@/lib/compartir';

/**
 * Gestiona la generación, copia y descarga de la imagen del horario.
 */
export function useCompartir({ horarioActivo, resolvedTheme, onAbrirModal, setMensajeModal, onExito, onError }) {
    const [shareDataUrl, setShareDataUrl] = useState(null);
    const [shareFilename, setShareFilename] = useState('mi-horario.png');

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
                setMensajeModal?.('Tu navegador no permite copiar imágenes. Usa "Descargar".');
                onError?.();
            }
        } catch (e) {
            console.error('Fallo al copiar la imagen', e);
            setMensajeModal?.('No se pudo copiar la imagen.');
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
