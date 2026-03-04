import { useState } from 'react';
import { procesarArchivoExcel, aliasCorrecciones } from '@/lib/excel';
import { normalizar } from '@/lib/horario';

/**
 * Gestiona la carga y procesamiento del archivo Excel de horarios.
 * Soporta un segundo Excel exclusivo para talleres.
 */
export function useExcel({ limpiarHorarioActual, setMensajeModal, onExito, onError }) {
    const [horariosBase, setHorariosBase] = useState({});
    const [horariosTalleres, setHorariosTalleres] = useState({});
    const [cargandoArchivo, setCargandoArchivo] = useState(false);
    const [cargandoTalleres, setCargandoTalleres] = useState(false);
    const [nombreArchivo, setNombreArchivo] = useState('');
    const [nombreArchivoTalleres, setNombreArchivoTalleres] = useState('');

    // Combinar horarios base + talleres
    const horariosDisponibles = { ...horariosBase, ...horariosTalleres };

    const mapaHorariosNormalizados = (() => {
        const map = new Map();
        for (const [clave, valor] of Object.entries(horariosDisponibles)) {
            map.set(normalizar(clave), valor);
        }
        return map;
    })();

    const mapaAliasNormalizados = (() => {
        const map = new Map();
        for (const [k, v] of Object.entries(aliasCorrecciones)) {
            map.set(normalizar(k), normalizar(v));
        }
        return map;
    })();

    const obtenerHorariosPorCurso = (nombreCurso) => {
        const key = normalizar(nombreCurso);
        if (mapaHorariosNormalizados.has(key)) return mapaHorariosNormalizados.get(key);
        const alias = mapaAliasNormalizados.get(key);
        if (alias && mapaHorariosNormalizados.has(alias)) return mapaHorariosNormalizados.get(alias);
        return [];
    };

    const procesarArchivo = async (archivo) => {
        setCargandoArchivo(true);
        try {
            const nuevosHorarios = await procesarArchivoExcel(archivo);
            setHorariosBase(nuevosHorarios);
        } catch (error) {
            console.error('Error al procesar archivo Excel:', error);
            setMensajeModal?.('Error al cargar el archivo Excel. Por favor, verifica el formato.');
            onError?.();
        } finally {
            setCargandoArchivo(false);
        }
    };

    const procesarArchivoTalleres = async (archivo) => {
        setCargandoTalleres(true);
        try {
            const nuevosHorarios = await procesarArchivoExcel(archivo);
            setHorariosTalleres(nuevosHorarios);
        } catch (error) {
            console.error('Error al procesar archivo Excel de talleres:', error);
            setMensajeModal?.('Error al cargar el Excel de talleres. Por favor, verifica el formato.');
            onError?.();
        } finally {
            setCargandoTalleres(false);
        }
    };

    const manejarCargaArchivo = (evento) => {
        const archivo = evento.target.files[0];
        if (!archivo) return;
        setNombreArchivo(archivo.name);
        limpiarHorarioActual?.();
        procesarArchivo(archivo);
    };

    const manejarCargaTalleres = (evento) => {
        const archivo = evento.target.files[0];
        if (!archivo) return;
        setNombreArchivoTalleres(archivo.name);
        procesarArchivoTalleres(archivo);
    };

    return {
        nombreArchivo, cargandoArchivo,
        nombreArchivoTalleres, cargandoTalleres,
        horariosDisponibles, obtenerHorariosPorCurso,
        manejarCargaArchivo, manejarCargaTalleres,
    };
}
