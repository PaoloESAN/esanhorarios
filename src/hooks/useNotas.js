import { useState, useCallback } from 'react';
import { crearHorariosVacios } from '@/constants';

const NOTA_DEFAULT = { texto: '', color: '#fde68a', textColor: '#111827' };

/**
 * Gestiona las notas de celdas para todos los horarios.
 * @param {number} horarioActivo
 */
export function useNotas(horarioActivo) {
    const [notasPorHorario, setNotasPorHorario] = useState(crearHorariosVacios);

    const notasCelda = notasPorHorario[horarioActivo] ?? {};

    const setNotasCelda = useCallback((updater) => {
        setNotasPorHorario(prev => ({
            ...prev,
            [horarioActivo]: typeof updater === 'function' ? updater(prev[horarioActivo] ?? {}) : updater
        }));
    }, [horarioActivo]);

    const guardarNota = useCallback((key, datos, onClose) => {
        if (!key) return;
        setNotasCelda(prev => ({
            ...prev,
            [key]: {
                texto: (datos?.texto ?? '').trim(),
                color: datos?.color ?? NOTA_DEFAULT.color,
                textColor: datos?.textColor ?? NOTA_DEFAULT.textColor,
            }
        }));
        onClose?.();
    }, [setNotasCelda]);

    const quitarNota = useCallback((key) => {
        setNotasCelda(prev => {
            const copia = { ...prev };
            delete copia[key];
            return copia;
        });
    }, [setNotasCelda]);

    /** Limpia las notas del horario activo */
    const limpiarNotasActivas = useCallback(() => setNotasCelda({}), [setNotasCelda]);

    /** Limpia TODAS las notas de todos los horarios */
    const limpiarTodasLasNotas = useCallback(() => {
        setNotasPorHorario(crearHorariosVacios());
    }, []);

    return { notasCelda, guardarNota, quitarNota, limpiarNotasActivas, limpiarTodasLasNotas };
}
