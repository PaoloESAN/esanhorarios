export const generarImagenHorario = async ({ tema }) => {
    try {
        const { default: html2canvas } = await import('html2canvas-pro');

        const elemento = document.getElementById('tabla-horario');
        if (!elemento) {
            console.error('No se encontró el elemento del horario');
            return null;
        }

        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        const clon = elemento.cloneNode(true);
        const fullWidth = elemento.scrollWidth;

        Object.assign(clon.style, {
            position: 'fixed',
            top: '0',
            left: '-99999px',
            width: `${fullWidth}px`,
            minWidth: `${fullWidth}px`,
            overflow: 'visible',
            overflowX: 'visible',
            zIndex: '-9999',
            pointerEvents: 'none',
        });

        document.body.appendChild(clon);

        const canvas = await html2canvas(clon, {
            backgroundColor: tema === 'dark' ? '#18181b' : '#ffffff',
            scale: 2,
            useCORS: true,
            logging: false,
            windowWidth: fullWidth,
            width: fullWidth,
            scrollX: 0,
            scrollY: 0,
        });

        document.body.removeChild(clon);

        window.scrollTo(scrollX, scrollY);

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
