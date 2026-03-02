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

        Object.assign(clon.style, {
            position: 'fixed',
            top: '0',
            left: '-99999px',
            width: '1200px',
            minWidth: '1200px',
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
            windowWidth: 1200,
            width: 1200,
            scrollX: 0,
            scrollY: 0,
            onclone: (documentClone) => {
                const tabla = documentClone.getElementById('tabla-horario');
                if (tabla) {
                    tabla.classList.remove('min-w-[640px]', 'md:min-w-[900px]');
                    const spansMobile = tabla.querySelectorAll('.block.md\\:hidden');
                    const spansDesktop = tabla.querySelectorAll('.hidden.md\\:block');
                    const textosSize = tabla.querySelectorAll('.text-xs');

                    spansMobile.forEach(el => el.style.display = 'none');
                    spansDesktop.forEach(el => el.style.display = 'block');
                    textosSize.forEach(el => {
                        el.style.fontSize = '0.875rem';
                        el.style.lineHeight = '1.25rem';
                    });
                }
            }
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
