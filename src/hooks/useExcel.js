import { useState } from 'react';
import { procesarArchivoExcel, aliasCorrecciones } from '@/lib/excel';
import { normalizar } from '@/lib/horario';

export function useExcel({ limpiarHorarioActual, setMensajeModal, onExito, onError }) {
    const [horariosBase, setHorariosBase] = useState({});
    const [horariosTalleres, setHorariosTalleres] = useState({});
    const [cargandoArchivo, setCargandoArchivo] = useState(false);
    const [cargandoTalleres, setCargandoTalleres] = useState(false);
    const [nombreArchivo, setNombreArchivo] = useState('');
    const [nombreArchivoTalleres, setNombreArchivoTalleres] = useState('');

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

    const esTallerExcel = (horarios) => {
        const claves = Object.keys(horarios);
        return claves.length > 0 && claves.every(k => k.toUpperCase().includes('TALLER'));
    };

    const manejarCargaArchivo = async (evento) => {
        const archivos = Array.from(evento.target.files);
        if (archivos.length === 0) return;

        limpiarHorarioActual?.();
        setCargandoArchivo(true);
        setCargandoTalleres(true);

        try {
            const resultados = await Promise.all(
                archivos.map(async (archivo) => ({
                    nombre: archivo.name,
                    horarios: await procesarArchivoExcel(archivo),
                }))
            );

            let base = {};
            let talleres = {};
            let nombreBase = '';
            let nombreTalleres = '';

            for (const r of resultados) {
                if (esTallerExcel(r.horarios)) {
                    talleres = { ...talleres, ...r.horarios };
                    nombreTalleres = r.nombre;
                } else {
                    base = { ...base, ...r.horarios };
                    nombreBase = r.nombre;
                }
            }

            if (nombreBase) {
                setHorariosBase(base);
                setNombreArchivo(nombreBase);
            }

            if (nombreTalleres) {
                setHorariosTalleres(talleres);
                setNombreArchivoTalleres(nombreTalleres);
            }
        } catch (error) {
            console.error('Error al procesar archivos Excel:', error);
            setMensajeModal?.('Error al cargar el archivo Excel. Por favor, verifica el formato.');
            onError?.();
        } finally {
            setCargandoArchivo(false);
            setCargandoTalleres(false);
        }
    };

    const manejarCargaTalleres = async (evento) => {
        const archivo = evento.target.files[0];
        if (!archivo) return;
        setCargandoTalleres(true);
        try {
            const nuevosHorarios = await procesarArchivoExcel(archivo);
            setHorariosTalleres(nuevosHorarios);
            setNombreArchivoTalleres(archivo.name);
        } catch (error) {
            console.error('Error al procesar archivo Excel de talleres:', error);
            setMensajeModal?.('Error al cargar el Excel de talleres. Por favor, verifica el formato.');
            onError?.();
        } finally {
            setCargandoTalleres(false);
        }
    };

    return {
        nombreArchivo, cargandoArchivo,
        nombreArchivoTalleres, cargandoTalleres,
        horariosDisponibles, obtenerHorariosPorCurso,
        manejarCargaArchivo, manejarCargaTalleres,
    };
}
