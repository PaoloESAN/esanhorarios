import domtoimage from 'dom-to-image';

export const compartirHorario = async () => {
    try {
        const elemento = document.getElementById('tabla-horario');
        if (!elemento) {
            console.error('No se encontró el elemento del horario');
            return;
        }

        const dataUrl = await domtoimage.toPng(elemento, {
            quality: 0.95,
            bgcolor: '#ffffff',
            style: {
                transform: 'scale(1)',
                transformOrigin: 'top left'
            }
        });

        const link = document.createElement('a');
        link.download = 'mi-horario.png';
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error('Error al generar la imagen:', error);
    }
};

export const compartirHorarioAlternativo = async () => {
    try {
        const elemento = document.getElementById('horario-grid');
        if (!elemento) {
            console.error('No se encontró el elemento del horario');
            return;
        }

        const canvas = await domtoimage.toCanvas(elemento);
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = 'mi-horario.png';
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        });
    } catch (error) {
        console.error('Error al generar la imagen alternativa:', error);
    }
};
