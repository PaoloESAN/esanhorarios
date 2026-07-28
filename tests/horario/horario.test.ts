import { describe, it, expect } from 'vitest';
import { generarHorarios, diasSemana } from '../../src/lib/horario';

describe('Pruebas del módulo de Horario (horario.ts)', () => {
    describe('diasSemana', () => {
        it('debe contener los 6 días de la semana académica', () => {
            expect(diasSemana).toEqual(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']);
            expect(diasSemana.length).toBe(6);
        });
    });

    describe('generarHorarios()', () => {
        it('debe generar la lista de franjas horarias correctamente de 07:30 a 22:15', () => {
            const horarios = generarHorarios();
            expect(horarios.length).toBe(16);
            expect(horarios[0]).toBe('07:30-08:15');
            expect(horarios[horarios.length - 1]).toBe('22:30-23:15');
        });
    });
});
