import { useState, useEffect } from 'react';
import { crearHorariosVacios, crearSetsVacios, crearMapasVacios } from '@/constants';
import { useCarrera } from '@/app/[slug]/CarreraContext';
import { CursoItem } from './useCursos';
import { ColorCelda } from '@/lib/colores';

/**
 * Centraliza el estado multi-horario (5 opciones de horario) con persistencia en localStorage.
 * Expone accesores del horario activo y operaciones de limpieza.
 */
export function useHorarios() {
    const { slug, obtenerCreditos } = useCarrera();
    const storageKey = `esan_horarios_state_${slug}`;

    const [horarioActivo, setHorarioActivo] = useState<number>(1);
    const [horariosPersonales, setHorariosPersonales] = useState<Record<number, Record<string, CursoItem>>>(crearHorariosVacios);
    const [cursosSeleccionadosPorHorario, setCursosSeleccionadosPorHorario] = useState<Record<number, Set<string>>>(crearSetsVacios);
    const [coloresAsignadosPorHorario, setColoresAsignadosPorHorario] = useState<Record<number, Map<string, ColorCelda>>>(crearMapasVacios);

    // Restaurar desde localStorage al montar
    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const data = JSON.parse(saved);
                // eslint-disable-next-line react-hooks/set-state-in-effect
                if (data.horarioActivo) setHorarioActivo(data.horarioActivo);
                if (data.horariosPersonales) setHorariosPersonales(data.horariosPersonales);
                if (data.cursosSeleccionadosPorHorario) {
                    const restoredSets: Record<number, Set<string>> = {};
                    for (const [k, v] of Object.entries(data.cursosSeleccionadosPorHorario)) {
                        restoredSets[Number(k)] = new Set(v as string[]);
                    }
                    setCursosSeleccionadosPorHorario(restoredSets);
                }
                if (data.coloresAsignadosPorHorario) {
                    const restoredMaps: Record<number, Map<string, ColorCelda>> = {};
                    for (const [k, v] of Object.entries(data.coloresAsignadosPorHorario)) {
                        restoredMaps[Number(k)] = new Map(v as [string, ColorCelda][]);
                    }
                    setColoresAsignadosPorHorario(restoredMaps);
                }
            }
        } catch (e) {
            console.error('Error al restaurar horarios desde localStorage:', e);
        }
    }, [storageKey]);

    // Guardar cambios en localStorage
    useEffect(() => {
        try {
            const setsArr: Record<number, string[]> = {};
            for (const [k, v] of Object.entries(cursosSeleccionadosPorHorario)) {
                setsArr[Number(k)] = Array.from(v || []);
            }
            const mapsArr: Record<number, [string, ColorCelda][]> = {};
            for (const [k, v] of Object.entries(coloresAsignadosPorHorario)) {
                mapsArr[Number(k)] = Array.from(v?.entries() || []);
            }

            localStorage.setItem(storageKey, JSON.stringify({
                horarioActivo,
                horariosPersonales,
                cursosSeleccionadosPorHorario: setsArr,
                coloresAsignadosPorHorario: mapsArr,
            }));
        } catch (e) {
            console.error('Error al guardar horarios en localStorage:', e);
        }
    }, [storageKey, horarioActivo, horariosPersonales, cursosSeleccionadosPorHorario, coloresAsignadosPorHorario]);

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
