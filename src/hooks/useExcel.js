import { useState, useMemo, useCallback } from 'react';
import { procesarArchivoExcel, mapeoEspecial } from '@/lib/excel';
import { normalizar } from '@/lib/horario';

/**
 * Gestiona la carga y procesamiento del archivo Excel de horarios.
 */
export function useExcel({ limpiarHorarioActual, setMensajeModal, onExito, onError }) {
    const [horariosDisponibles, setHorariosDisponibles] = useState({});
    const [cargandoArchivo, setCargandoArchivo] = useState(false);
    const [nombreArchivo, setNombreArchivo] = useState('');

    const mapaHorariosNormalizados = useMemo(() => {
        const map = new Map();
        for (const [clave, valor] of Object.entries(horariosDisponibles)) {
            map.set(normalizar(clave), valor);
        }
        return map;
    }, [horariosDisponibles]);

    const mapaAliasNormalizados = useMemo(() => {
        const map = new Map();
        for (const [k, v] of Object.entries(mapeoEspecial)) {
            map.set(normalizar(k), normalizar(v));
        }
        return map;
    }, []);

    const obtenerHorariosPorCurso = useCallback((nombreCurso) => {
        const key = normalizar(nombreCurso);
        if (mapaHorariosNormalizados.has(key)) return mapaHorariosNormalizados.get(key);
        const alias = mapaAliasNormalizados.get(key);
        if (alias && mapaHorariosNormalizados.has(alias)) return mapaHorariosNormalizados.get(alias);
        return [];
    }, [mapaHorariosNormalizados, mapaAliasNormalizados]);

    const procesarArchivo = useCallback(async (archivo) => {
        setCargandoArchivo(true);
        try {
            const nuevosHorarios = await procesarArchivoExcel(archivo);
            setHorariosDisponibles(nuevosHorarios);
            setMensajeModal?.('¡Archivo Excel cargado exitosamente!');
            onExito?.();
        } catch (error) {
            console.error('Error al procesar archivo Excel:', error);
            setMensajeModal?.('Error al cargar el archivo Excel. Por favor, verifica el formato.');
            onError?.();
        } finally {
            setCargandoArchivo(false);
        }
    }, [setMensajeModal, onExito, onError]);

    const manejarCargaArchivo = useCallback((evento) => {
        const archivo = evento.target.files[0];
        if (!archivo) return;
        setNombreArchivo(archivo.name);
        limpiarHorarioActual?.();
        procesarArchivo(archivo);
    }, [limpiarHorarioActual, procesarArchivo]);

    return { nombreArchivo, cargandoArchivo, horariosDisponibles, obtenerHorariosPorCurso, manejarCargaArchivo };
}
