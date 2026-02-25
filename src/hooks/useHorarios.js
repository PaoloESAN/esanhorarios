import { useState } from 'react';
import { crearHorariosVacios, crearSetsVacios, crearMapasVacios } from '@/constants';
import { useCarrera } from '@/app/[slug]/CarreraContext';

/**
 * Centraliza el estado multi-horario (5 opciones de horario).
 * Expone accesores del horario activo y operaciones de limpieza.
 */
export function useHorarios() {
    const { obtenerCreditos } = useCarrera();
    const [horarioActivo, setHorarioActivo] = useState(1);
    const [horariosPersonales, setHorariosPersonales] = useState(crearHorariosVacios);
    const [cursosSeleccionadosPorHorario, setCursosSeleccionadosPorHorario] = useState(crearSetsVacios);
    const [coloresAsignadosPorHorario, setColoresAsignadosPorHorario] = useState(crearMapasVacios);

    const horarioPersonal = horariosPersonales[horarioActivo];
    const cursosSeleccionados = cursosSeleccionadosPorHorario[horarioActivo] ?? new Set();
    const coloresAsignados = coloresAsignadosPorHorario[horarioActivo] ?? new Map();

    const cambiarHorario = (n) => setHorarioActivo(n);

    const setHorarioPersonal = (updater) => {
        setHorariosPersonales(prev => ({
            ...prev,
            [horarioActivo]: typeof updater === 'function' ? updater(prev[horarioActivo] ?? {}) : updater
        }));
    };

    const setCursosSeleccionados = (updater) => {
        setCursosSeleccionadosPorHorario(prev => ({
            ...prev,
            [horarioActivo]: typeof updater === 'function' ? updater(prev[horarioActivo] ?? new Set()) : updater
        }));
    };

    const setColoresAsignados = (updater) => {
        setColoresAsignadosPorHorario(prev => ({
            ...prev,
            [horarioActivo]: typeof updater === 'function' ? updater(prev[horarioActivo] ?? new Map()) : updater
        }));
    };

    const limpiarHorarioActual = () => {
        setHorarioPersonal({});
        setCursosSeleccionados(new Set());
        setColoresAsignados(new Map());
    };

    const limpiarTodosLosHorarios = () => {
        setHorariosPersonales(crearHorariosVacios());
        setCursosSeleccionadosPorHorario(crearSetsVacios());
        setColoresAsignadosPorHorario(crearMapasVacios());
    };

    const creditosTotales = (() => {
        const vistos = new Map();
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
