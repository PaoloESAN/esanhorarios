import { useState, ChangeEvent } from 'react';
import { procesarArchivoExcel, aliasCorrecciones, HorariosParseados } from '@/lib/excel';
import { normalizar } from '@/lib/horario';

export interface UseExcelParams {
    limpiarHorarioActual?: () => void;
    setMensajeModal?: (msg: string) => void;
    onExito?: () => void;
    onError?: () => void;
}

export function useExcel({ limpiarHorarioActual, setMensajeModal, onExito, onError }: UseExcelParams) {
    const [horariosBase, setHorariosBase] = useState<HorariosParseados>({});
    const [horariosTalleres, setHorariosTalleres] = useState<HorariosParseados>({});
    const [cargandoArchivo, setCargandoArchivo] = useState(false);
    const [cargandoTalleres, setCargandoTalleres] = useState(false);
    const [nombreArchivo, setNombreArchivo] = useState('');
    const [nombreArchivoTalleres, setNombreArchivoTalleres] = useState('');

    const horariosDisponibles: HorariosParseados = { ...horariosBase, ...horariosTalleres };

    const mapaHorariosNormalizados = (() => {
        const map = new Map<string, any>();
        for (const [clave, valor] of Object.entries(horariosDisponibles)) {
            map.set(normalizar(clave), valor);
        }
        return map;
    })();

    const mapaAliasNormalizados = (() => {
        const map = new Map<string, string>();
        for (const [k, v] of Object.entries(aliasCorrecciones)) {
            map.set(normalizar(k), normalizar(v));
        }
        return map;
    })();

    const obtenerHorariosPorCurso = (nombreCurso: string): any[] => {
        const key = normalizar(nombreCurso);
        if (mapaHorariosNormalizados.has(key)) return mapaHorariosNormalizados.get(key);
        const alias = mapaAliasNormalizados.get(key);
        if (alias && mapaHorariosNormalizados.has(alias)) return mapaHorariosNormalizados.get(alias);
        return [];
    };

    const esTallerExcel = (horarios: HorariosParseados): boolean => {
        const claves = Object.keys(horarios);
        return claves.length > 0 && claves.every(k => k.toUpperCase().includes('TALLER'));
    };

    const manejarCargaArchivo = async (evento: ChangeEvent<HTMLInputElement>) => {
        const files = evento.target.files;
        if (!files) return;
        const archivos = Array.from(files);
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

            let base: HorariosParseados = {};
            let talleres: HorariosParseados = {};
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
            onExito?.();
        } catch (error) {
            console.error('Error al procesar archivos Excel:', error);
            setMensajeModal?.('Error al cargar el archivo Excel. Por favor, verifica el formato.');
            onError?.();
        } finally {
            setCargandoArchivo(false);
            setCargandoTalleres(false);
        }
    };

    const manejarCargaTalleres = async (evento: ChangeEvent<HTMLInputElement>) => {
        const files = evento.target.files;
        if (!files) return;
        const archivo = files[0];
        if (!archivo) return;
        setCargandoTalleres(true);
        try {
            const nuevosHorarios = await procesarArchivoExcel(archivo);
            setHorariosTalleres(nuevosHorarios);
            setNombreArchivoTalleres(archivo.name);
            onExito?.();
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
