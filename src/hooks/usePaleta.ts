import { useState, useRef, useTransition } from 'react';
import { obtenerColoresActuales, reasignarColores, ColorCelda } from '@/lib/colores';

export interface UsePaletaParams {
    cursosSeleccionados: Set<string>;
    horarioPersonal: any;
    setColoresAsignados: (colores: Map<string, ColorCelda>) => void;
}

/**
 * Gestiona la paleta de colores con debounce + requestIdleCallback.
 */
export function usePaleta({ cursosSeleccionados, horarioPersonal, setColoresAsignados }: UsePaletaParams) {
    const [paletaSeleccionada, setPaletaSeleccionada] = useState<string>('default');
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const idleRef = useRef<any>(null);
    const [, startTransition] = useTransition();

    const coloresActuales = obtenerColoresActuales(paletaSeleccionada);

    const cambiarPaleta = (nuevaPaleta: string) => {
        setPaletaSeleccionada(nuevaPaleta);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (idleRef.current) {
            const cancelIdCb = typeof window !== 'undefined' ? (window as any).cancelIdleCallback : undefined;
            (cancelIdCb ?? clearTimeout)(idleRef.current);
        }

        debounceRef.current = setTimeout(() => {
            const nuevosColores = obtenerColoresActuales(nuevaPaleta);
            const scheduleIdle = (cb: any) => {
                const ric = typeof window !== 'undefined' && (window as any).requestIdleCallback;
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
