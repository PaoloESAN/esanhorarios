import { useState, useRef, useTransition } from 'react';
import { obtenerColoresActuales, reasignarColores } from '@/lib/colores';

/**
 * Gestiona la paleta de colores con debounce + requestIdleCallback.
 */
export function usePaleta({ cursosSeleccionados, horarioPersonal, setColoresAsignados }) {
    const [paletaSeleccionada, setPaletaSeleccionada] = useState('default');
    const debounceRef = useRef(null);
    const idleRef = useRef(null);
    const [, startTransition] = useTransition();

    const coloresActuales = obtenerColoresActuales(paletaSeleccionada);

    const cambiarPaleta = (nuevaPaleta) => {
        setPaletaSeleccionada(nuevaPaleta);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (idleRef.current) {
            (window.cancelIdleCallback ?? clearTimeout)(idleRef.current);
        }

        debounceRef.current = setTimeout(() => {
            const nuevosColores = obtenerColoresActuales(nuevaPaleta);
            const scheduleIdle = (cb) => {
                const ric = typeof window !== 'undefined' && window.requestIdleCallback;
                return ric ? ric(cb, { timeout: 300 }) : setTimeout(() => cb({ didTimeout: true }), 150);
            };
            idleRef.current = scheduleIdle(() => {
                startTransition(() => {
                    setColoresAsignados(reasignarColores(cursosSeleccionados, horarioPersonal, nuevosColores));
                });
            });
        }, 120);
    };

    return { paletaSeleccionada, coloresActuales, cambiarPaleta };
}
