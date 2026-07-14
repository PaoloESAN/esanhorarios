import { useState } from 'react';
import { crearHorariosVacios, crearSetsVacios, crearMapasVacios } from '@/constants';
import { useCarrera } from '@/app/[slug]/CarreraContext';
import { CursoItem } from './useCursos';
import { ColorCelda } from '@/lib/colores';

/**
 * Centraliza el estado multi-horario (5 opciones de horario).
 * Expone accesores del horario activo y operaciones de limpieza.
 */
export function useHorarios() {
    const { obtenerCreditos } = useCarrera();
    const [horarioActivo, setHorarioActivo] = useState<number>(1);
    const [horariosPersonales, setHorariosPersonales] = useState<Record<number, Record<string, CursoItem>>>(crearHorariosVacios);
    const [cursosSeleccionadosPorHorario, setCursosSeleccionadosPorHorario] = useState<Record<number, Set<string>>>(crearSetsVacios);
    const [coloresAsignadosPorHorario, setColoresAsignadosPorHorario] = useState<Record<number, Map<string, ColorCelda>>>(crearMapasVacios);

    const horarioPersonal = horariosPersonales[horarioActivo] ?? {};
    const cursosSeleccionados = cursosSeleccionadosPorHorario[horarioActivo] ?? new Set<string>();
    const coloresAsignados = coloresAsignadosPorHorario[horarioActivo] ?? new Map<string, ColorCelda>();

    const cambiarHorario = (n: number) => setHorarioActivo(n);

    const setHorarioPersonal = (updater: any) => {
        setHorariosPersonales(prev => ({
            ...prev,
            [horarioActivo]: typeof updater === 'function' ? updater(prev[horarioActivo] ?? {}) : updater
        }));
    };

    const setCursosSeleccionados = (updater: any) => {
        setCursosSeleccionadosPorHorario(prev => ({
            ...prev,
            [horarioActivo]: typeof updater === 'function' ? updater(prev[horarioActivo] ?? new Set<string>()) : updater
        }));
    };

    const setColoresAsignados = (updater: any) => {
        setColoresAsignadosPorHorario(prev => ({
            ...prev,
            [horarioActivo]: typeof updater === 'function' ? updater(prev[horarioActivo] ?? new Map<string, ColorCelda>()) : updater
        }));
    };

    const limpiarHorarioActual = () => {
        setHorarioPersonal({});
        setCursosSeleccionados(new Set<string>());
        setColoresAsignados(new Map<string, ColorCelda>());
    };

    const limpiarTodosLosHorarios = () => {
        setHorariosPersonales(crearHorariosVacios());
        setCursosSeleccionadosPorHorario(crearSetsVacios());
        setColoresAsignadosPorHorario(crearMapasVacios());
    };

    const creditosTotales = (() => {
        const vistos = new Map<string, number>();
        Object.values(horarioPersonal).forEach(clase => {
            if (!clase?.curso) return;
            const key = `${clase.curso}-${clase.seccion}`;
            if (!vistos.has(key)) {
                vistos.set(key, clase.creditos ?? obtenerCreditos(clase.curso));
            }
        });
        return Array.from(vistos.values()).reduce((s, c) => s + c, 0);
    })();

    return {
        horarioActivo, cambiarHorario,
        horarioPersonal, setHorarioPersonal,
        cursosSeleccionados, setCursosSeleccionados,
        coloresAsignados, setColoresAsignados,
        limpiarHorarioActual, limpiarTodosLosHorarios,
        creditosTotales,
    };
}
