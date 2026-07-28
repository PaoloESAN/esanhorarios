import { describe, it, expect } from 'vitest';
import { extraerHorarios, parsearDatosExcel, aliasCorrecciones } from '../../src/lib/excel';

describe('Pruebas del módulo Excel (excel.ts)', () => {
    describe('extraerHorarios()', () => {
        it('debe extraer la hora y el aula de un texto con formato estándar', () => {
            const resultado = extraerHorarios('08:30-10:15 (A-201)');
            expect(resultado).toHaveLength(1);
            expect(resultado[0]).toEqual({
                horario: '08:30-09:15',
                aula: 'A-201'
            });
        });

        it('debe extraer el horario cuando no incluye aula explícita', () => {
            const resultado = extraerHorarios('14:30 - 16:15');
            expect(resultado).toHaveLength(1);
            expect(resultado[0]).toEqual({
                horario: '14:30-15:15',
                aula: 'Por definir'
            });
        });

        it('debe manejar horarios usando el conector "a"', () => {
            const resultado = extraerHorarios('11:30 a 13:15 (Lab-3)');
            expect(resultado).toHaveLength(1);
            expect(resultado[0]).toEqual({
                horario: '11:30-12:15',
                aula: 'Lab-3'
            });
        });
    });

    describe('aliasCorrecciones', () => {
        it('debe tener mapeados los nombres de cursos especiales correctamente', () => {
            expect(aliasCorrecciones['PRECALCULO']).toBe('PRE CALCULO');
            expect(aliasCorrecciones['CAPSTONE PROJECT I']).toBe('CAPSTONE PROJECT');
        });
    });

    describe('parsearDatosExcel()', () => {
        it('debe ignorar filas antes de los encabezados y parsear los cursos válidos', () => {
            const datosMock = [
                ['UNIVERSIDAD ESAN', '', '', ''],
                ['HORARIOS DE CLASES 2026-1', '', '', ''],
                ['CURSO', 'PROFESOR', 'SECCION', 'LUNES', 'MARTES'],
                ['ALGEBRA LINEAL', 'Perez Juan', 'S-101', '08:30-10:15 (A-101)', '']
            ];

            const resultado = parsearDatosExcel(datosMock);

            expect(resultado).toHaveProperty('ALGEBRA LINEAL');
            expect(resultado['ALGEBRA LINEAL']).toHaveLength(1);
            expect(resultado['ALGEBRA LINEAL'][0].profesor).toBe('Perez Juan');
            expect(resultado['ALGEBRA LINEAL'][0].seccion).toBe('S-101');
            expect(resultado['ALGEBRA LINEAL'][0].horarios).toContainEqual({
                dia: 'Lunes',
                horario: '08:30-09:15',
                aula: 'A-101'
            });
        });

        it('debe devolver un objeto vacío si no encuentra la fila de encabezados', () => {
            const datosInvalidos = [
                ['TITULO CUALQUIERA', 'OTRO DATO'],
                ['123', '456']
            ];

            const resultado = parsearDatosExcel(datosInvalidos);
            expect(resultado).toEqual({});
        });
    });
});
