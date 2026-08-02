export const diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const generarHorarios = (): string[] => {
    const horarios: string[] = [];
    for (let hora = 7; hora <= 22; hora++) {
        const h = hora.toString().padStart(2, '0');
        const hs = (hora + 1).toString().padStart(2, '0');
        horarios.push(`${h}:30-${hs}:15`);
    }
    return horarios;
};

/**
 * Normaliza un texto: mayúsculas, sin tildes, sin puntuación especial, sin espacios extra.
 */
export const normalizar = (texto: string): string =>
    texto
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
