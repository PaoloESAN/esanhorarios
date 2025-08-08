import domtoimage from 'dom-to-image';

export const generarImagenHorario = async ({ tema }) => {
    try {
        const elemento = document.getElementById('tabla-horario');
        if (!elemento) {
            console.error('No se encontró el elemento del horario');
            return null;
        }

        const dataUrl = await domtoimage.toPng(elemento, {
            quality: 0.95,
            bgcolor: tema === 'dark' ? '#18181b' : '#ffffff',
            style: {
                transform: 'scale(1)',
                transformOrigin: 'top left'
            }
        });

        return dataUrl;
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
