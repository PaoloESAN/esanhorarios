export const generarHorarios = () => {
    const horarios = [];

    for (let hora = 7; hora <= 22; hora++) {
        const horaStr = hora.toString().padStart(2, '0');
        const siguienteHora = hora + 1;
        const siguienteHoraStr = siguienteHora.toString().padStart(2, '0');

        horarios.push(`${horaStr}:30-${siguienteHoraStr}:15`);
    }

    return horarios;
};

export const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
