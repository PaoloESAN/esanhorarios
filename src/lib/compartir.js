import html2canvas from 'html2canvas-pro';

export const generarImagenHorario = async ({ tema }) => {
    try {
        const elemento = document.getElementById('tabla-horario');
        if (!elemento) {
            console.error('No se encontró el elemento del horario');
            return null;
        }

        const canvas = await html2canvas(elemento, {
            backgroundColor: tema === 'dark' ? '#18181b' : '#ffffff',
            scale: 2,
            useCORS: true,
            logging: false,
        });

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
