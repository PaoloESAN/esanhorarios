import { useState } from 'react';
import { crearHorariosVacios } from '@/constants';

const NOTA_DEFAULT = { texto: '', color: '#fde68a', textColor: '#111827' };

/**
 * Gestiona las notas de celdas para todos los horarios.
 * @param {number} horarioActivo
 */
export function useNotas(horarioActivo) {
    const [notasPorHorario, setNotasPorHorario] = useState(crearHorariosVacios);

    const notasCelda = notasPorHorario[horarioActivo] ?? {};

    const setNotasCelda = (updater) => {
        setNotasPorHorario(prev => ({
            ...prev,
            [horarioActivo]: typeof updater === 'function' ? updater(prev[horarioActivo] ?? {}) : updater
        }));
    };

    const guardarNota = (key, datos, onClose) => {
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
    };

    const quitarNota = (key) => {
        setNotasCelda(prev => {
            const copia = { ...prev };
            delete copia[key];
            return copia;
        });
    };

    /** Limpia las notas del horario activo */
    const limpiarNotasActivas = () => setNotasCelda({});

    /** Limpia TODAS las notas de todos los horarios */
    const limpiarTodasLasNotas = () => {
        setNotasPorHorario(crearHorariosVacios());
    };

    return { notasCelda, guardarNota, quitarNota, limpiarNotasActivas, limpiarTodasLasNotas };
}
