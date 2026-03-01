export const generarImagenHorario = async ({ tema }) => {
    try {
        const { toPng } = await import('html-to-image');

        const elemento = document.getElementById('tabla-horario');
        if (!elemento) {
            console.error('No se encontró el elemento del horario');
            return null;
        }

        const dataUrl = await toPng(elemento, {
            backgroundColor: tema === 'dark' ? '#18181b' : '#ffffff',
            pixelRatio: 2,
            width: elemento.scrollWidth,
            height: elemento.scrollHeight,
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
