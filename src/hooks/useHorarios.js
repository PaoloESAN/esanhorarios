import { useState, useCallback, useMemo } from 'react';
import { crearHorariosVacios, crearSetsVacios, crearMapasVacios } from '@/constants';
import { obtenerCreditosCurso } from '@/lib/creditos';

/**
 * Centraliza el estado multi-horario (5 opciones de horario).
 * Expone accesores del horario activo y operaciones de limpieza.
 */
export function useHorarios() {
    const [horarioActivo, setHorarioActivo] = useState(1);
    const [horariosPersonales, setHorariosPersonales] = useState(crearHorariosVacios);
    const [cursosSeleccionadosPorHorario, setCursosSeleccionadosPorHorario] = useState(crearSetsVacios);
    const [coloresAsignadosPorHorario, setColoresAsignadosPorHorario] = useState(crearMapasVacios);

    const horarioPersonal = horariosPersonales[horarioActivo];
    const cursosSeleccionados = cursosSeleccionadosPorHorario[horarioActivo] ?? new Set();
    const coloresAsignados = coloresAsignadosPorHorario[horarioActivo] ?? new Map();

    const cambiarHorario = useCallback((n) => setHorarioActivo(n), []);

    const setHorarioPersonal = useCallback((updater) => {
        setHorariosPersonales(prev => ({
            ...prev,
            [horarioActivo]: typeof updater === 'function' ? updater(prev[horarioActivo] ?? {}) : updater
        }));
    }, [horarioActivo]);

    const setCursosSeleccionados = useCallback((updater) => {
        setCursosSeleccionadosPorHorario(prev => ({
            ...prev,
            [horarioActivo]: typeof updater === 'function' ? updater(prev[horarioActivo] ?? new Set()) : updater
        }));
    }, [horarioActivo]);

    const setColoresAsignados = useCallback((updater) => {
        setColoresAsignadosPorHorario(prev => ({
            ...prev,
            [horarioActivo]: typeof updater === 'function' ? updater(prev[horarioActivo] ?? new Map()) : updater
        }));
    }, [horarioActivo]);

    const limpiarHorarioActual = useCallback(() => {
        setHorarioPersonal({});
        setCursosSeleccionados(new Set());
        setColoresAsignados(new Map());
    }, [setHorarioPersonal, setCursosSeleccionados, setColoresAsignados]);

    const limpiarTodosLosHorarios = useCallback(() => {
        setHorariosPersonales(crearHorariosVacios());
        setCursosSeleccionadosPorHorario(crearSetsVacios());
        setColoresAsignadosPorHorario(crearMapasVacios());
    }, []);

    const creditosTotales = useMemo(() => {
        const vistos = new Map();
        Object.values(horarioPersonal).forEach(clase => {
            if (!clase?.curso) return;
            const key = `${clase.curso}-${clase.seccion}`;
            if (!vistos.has(key)) {
                vistos.set(key, clase.creditos ?? obtenerCreditosCurso(clase.curso));
            }
        });
        return Array.from(vistos.values()).reduce((s, c) => s + c, 0);
    }, [horarioPersonal]);

    return {
        horarioActivo, cambiarHorario,
        horarioPersonal, setHorarioPersonal,
        cursosSeleccionados, setCursosSeleccionados,
        coloresAsignados, setColoresAsignados,
        limpiarHorarioActual, limpiarTodosLosHorarios,
        creditosTotales,
    };
}
