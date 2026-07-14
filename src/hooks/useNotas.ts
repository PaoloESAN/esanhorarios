import { useState } from 'react';
import { crearHorariosVacios } from '@/constants';

export interface NotaCelda {
    texto: string;
    color: string;
    textColor: string;
}

export const NOTA_DEFAULT: NotaCelda = { texto: '', color: '#fde68a', textColor: '#111827' };

/**
 * Gestiona las notas de celdas para todos los horarios.
 * @param {number} horarioActivo
 */
export function useNotas(horarioActivo: number) {
    const [notasPorHorario, setNotasPorHorario] = useState<Record<number, Record<string, NotaCelda>>>(crearHorariosVacios);

    const notasCelda = notasPorHorario[horarioActivo] ?? {};

    const setNotasCelda = (updater: any) => {
        setNotasPorHorario(prev => ({
            ...prev,
            [horarioActivo]: typeof updater === 'function' ? updater(prev[horarioActivo] ?? {}) : updater
        }));
    };

    const guardarNota = (key: string, datos: Partial<NotaCelda>, onClose?: () => void) => {
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

    const quitarNota = (key: string) => {
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
