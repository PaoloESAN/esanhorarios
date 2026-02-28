import html2canvas from 'html2canvas-pro';

export const generarImagenHorario = async ({ tema }) => {
    try {
        const elemento = document.getElementById('tabla-horario');
        if (!elemento) {
            console.error('No se encontró el elemento del horario');
            return null;
        }

        const originalOverflow = elemento.style.overflow;
        const originalOverflowX = elemento.style.overflowX;
        const originalWidth = elemento.style.width;
        const originalMinWidth = elemento.style.minWidth;

        const fullWidth = elemento.scrollWidth;
        elemento.style.overflow = 'visible';
        elemento.style.overflowX = 'visible';
        elemento.style.width = `${fullWidth}px`;
        elemento.style.minWidth = `${fullWidth}px`;

        const canvas = await html2canvas(elemento, {
            backgroundColor: tema === 'dark' ? '#18181b' : '#ffffff',
            scale: 2,
            useCORS: true,
            logging: false,
            windowWidth: fullWidth,
            width: fullWidth,
            scrollX: 0,
            scrollY: -window.scrollY,
        });

        elemento.style.overflow = originalOverflow;
        elemento.style.overflowX = originalOverflowX;
        elemento.style.width = originalWidth;
        elemento.style.minWidth = originalMinWidth;

        return canvas.toDataURL('image/png');
    } catch (error) {
        console.error('Error al generar la imagen:', error);
        return null;
    }
};

export const compartirHorario = async ({ tema, filename = 'mi-horario.png' }) => {
    const dataUrl = await generarImagenHorario({ tema });
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
};
