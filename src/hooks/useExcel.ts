import { useState, useEffect, ChangeEvent } from 'react';
import { procesarArchivoExcel, aliasCorrecciones, HorariosParseados } from '@/lib/excel';
import { normalizar } from '@/lib/horario';
import { useCarrera } from '@/app/[slug]/CarreraContext';
import { obtenerElectivosPorCarrera, LISTA_ELECTIVOS } from '@/data';
import { encontrarElectivoInternacional } from '@/data/internacionales';

export interface UseExcelParams {
    limpiarHorarioActual?: () => void;
    setMensajeModal?: (msg: string) => void;
    onExito?: () => void;
    onError?: () => void;
}

export function useExcel({ limpiarHorarioActual, setMensajeModal, onExito, onError }: UseExcelParams) {
    const { slug, nombre: nombreCarreraActiva } = useCarrera();
    const storageKey = `esan_excel_data_${slug}`;

    const [horariosBase, setHorariosBase] = useState<HorariosParseados>({});
    const [horariosTalleres, setHorariosTalleres] = useState<HorariosParseados>({});
    const [horariosElectivos, setHorariosElectivos] = useState<HorariosParseados>({});
    const [cargandoArchivo, setCargandoArchivo] = useState(false);
    const [cargandoTalleres, setCargandoTalleres] = useState(false);
    const [cargandoElectivos, setCargandoElectivos] = useState(false);
    const [nombreArchivo, setNombreArchivo] = useState('');
    const [nombreArchivoTalleres, setNombreArchivoTalleres] = useState('');
    const [nombreArchivoElectivos, setNombreArchivoElectivos] = useState('');

    useEffect(() => {
        try {
            let saved = localStorage.getItem(storageKey);

            if (typeof window !== 'undefined') {
                const params = new URLSearchParams(window.location.search);
                const fromSlug = params.get('from');
                if (fromSlug) {
                    const fromSaved = localStorage.getItem(`esan_excel_data_${fromSlug}`);
                    if (fromSaved) {
                        saved = fromSaved;
                    }
                }
            }

            if (!saved) {
                saved = localStorage.getItem('esan_excel_data_latest');
            }

            if (!saved && slug === 'internacional') {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('esan_excel_data_')) {
                        const val = localStorage.getItem(key);
                        if (val) {
                            saved = val;
                            break;
                        }
                    }
                }
            }

            if (saved) {
                const data = JSON.parse(saved);
                if (data.nombreArchivo && data.horariosBase) {
                    setNombreArchivo(data.nombreArchivo || '');
                    setNombreArchivoTalleres(data.nombreArchivoTalleres || '');
                    setNombreArchivoElectivos(data.nombreArchivoElectivos || '');
                    setHorariosBase(data.horariosBase || {});
                    setHorariosTalleres(data.horariosTalleres || {});
                    setHorariosElectivos(data.horariosElectivos || {});
                }
            }
        } catch (e) {
            console.error('Error al restaurar Excel desde localStorage:', e);
        }
    }, [storageKey, slug]);

    const guardarEnStorage = (
        base: HorariosParseados, nBase: string,
        talleres: HorariosParseados, nTalleres: string,
        electivos: HorariosParseados = horariosElectivos, nElectivos: string = nombreArchivoElectivos
    ) => {
        try {
            const dataToSave = JSON.stringify({
                nombreArchivo: nBase,
                nombreArchivoTalleres: nTalleres,
                nombreArchivoElectivos: nElectivos,
                horariosBase: base,
                horariosTalleres: talleres,
                horariosElectivos: electivos,
            });
            localStorage.setItem(storageKey, dataToSave);
            localStorage.setItem('esan_excel_data_latest', dataToSave);
        } catch (e) {
            console.error('Error al guardar Excel en localStorage:', e);
        }
    };

    const horariosDisponibles: HorariosParseados = { ...horariosBase, ...horariosTalleres, ...horariosElectivos };

    const mapaAliasNormalizados = (() => {
        const map = new Map<string, string>();
        for (const [k, v] of Object.entries(aliasCorrecciones)) {
            const kn = normalizar(k);
            const vn = normalizar(v);
            map.set(kn, vn);
            map.set(vn, kn);
        }
        return map;
    })();

    const mapaHorariosNormalizados = (() => {
        const map = new Map<string, any>();
        for (const [clave, valor] of Object.entries(horariosDisponibles)) {
            const keyNorm = normalizar(clave);
            map.set(keyNorm, valor);

            const alias = mapaAliasNormalizados.get(keyNorm);
            if (alias) {
                map.set(alias, valor);
            }
        }
        return map;
    })();

    const capitalizar = (texto: string): string =>
        texto.replace(/\S+/g, (p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());

    const obtenerHorariosPorCurso = (nombreCurso: string): any[] => {
        if (!nombreCurso) return [];
        const key = normalizar(nombreCurso);
        if (mapaHorariosNormalizados.has(key)) return mapaHorariosNormalizados.get(key);
        const alias = mapaAliasNormalizados.get(key);
        if (alias && mapaHorariosNormalizados.has(alias)) return mapaHorariosNormalizados.get(alias);

        // Coincidencia difusa por palabras clave ignorando conectores
        const palabrasStop = new Set(['Y', 'DE', 'DEL', 'LA', 'EL', 'LOS', 'LAS', 'EN', 'CON', 'PARA', 'POR', 'UN', 'UNA', 'E', 'O', 'I', 'II', 'III', 'IV', 'V']);
        const keyPalabras = key.split(' ').filter(p => p.length >= 3 && !palabrasStop.has(p));

        for (const [claveReal, secciones] of Object.entries(horariosDisponibles)) {
            const realNorm = normalizar(claveReal);
            if (realNorm === key) return secciones;

            const realPalabras = realNorm.split(' ').filter(p => p.length >= 3 && !palabrasStop.has(p));

            if (keyPalabras.length > 0 && realPalabras.length > 0) {
                const todasKeyEnReal = keyPalabras.every(p => realPalabras.includes(p));
                const todasRealEnKey = realPalabras.every(p => keyPalabras.includes(p));

                if (todasKeyEnReal || todasRealEnKey) {
                    return secciones;
                }
            }
        }
        // Comprobar si es un electivo internacional
        const electivoInter = encontrarElectivoInternacional(nombreCurso);
        if (electivoInter) {
            const seccionesInternacionales: any[] = [];
            for (const [cursoNombreReal, secciones] of Object.entries(horariosDisponibles)) {
                const coincidencia = encontrarElectivoInternacional(cursoNombreReal);
                if (coincidencia === electivoInter) {
                    for (const seccion of secciones) {
                        seccionesInternacionales.push({
                            ...seccion,
                            cursoReal: electivoInter,
                            nombreCursoElectivo: electivoInter,
                        });
                    }
                }
            }
            if (seccionesInternacionales.length > 0) return seccionesInternacionales;
        }

        // Si es un curso genérico de electivo ("Electivo I", "Electivo de especialidad I", etc.) o un nombre de electivo del catálogo
        const esNombreElectivoOficial = LISTA_ELECTIVOS.some(e => {
            const eNorm = normalizar(e.nombre);
            return eNorm === key || key.includes(eNorm) || eNorm.includes(key);
        });

        if (key.includes('ELECTIV') || esNombreElectivoOficial) {
            const carreraNorm = normalizar(nombreCarreraActiva || '');
            const electivosValidosObj = obtenerElectivosPorCarrera(slug);
            const seccionesElectivas: any[] = [];
            const origenElectivos = horariosDisponibles;

            const palabrasGenericas = ['PROGRAMACION', 'FINANZAS', 'MARKETING', 'DERECHO', 'GESTION', 'ECONOMIA', 'TALLER', 'ESTRATEGIA', 'ESTRATEGIAS', 'ANALISIS'];

            for (const [cursoNombreReal, secciones] of Object.entries(origenElectivos)) {
                const realNorm = normalizar(cursoNombreReal);

                let electivoEncontrado = electivosValidosObj.find(e => {
                    const eNorm = normalizar(e.nombre);
                    if (realNorm === eNorm) return true;
                    if (realNorm.includes(eNorm)) return true;
                    if (eNorm.includes(realNorm)) {
                        if (palabrasGenericas.includes(realNorm)) return false;
                        return realNorm.length >= 8;
                    }
                    return false;
                });

                if (electivosValidosObj.length > 0 && !electivoEncontrado) {
                    continue;
                }

                if (electivosValidosObj.length === 0 && !realNorm.includes('ELECTIV')) {
                    continue;
                }

                const nombreCursoElectivo = electivoEncontrado ? capitalizar(electivoEncontrado.nombre) : capitalizar(cursoNombreReal);
                const electivoNorm = normalizar(nombreCursoElectivo);

                // Si se buscó un electivo específico (ej. "Machine Learning Aplicado a la Banca"), filtrar solo sus secciones
                if (!key.includes('ELECTIV') && esNombreElectivoOficial) {
                    if (key !== electivoNorm && !key.includes(electivoNorm) && !electivoNorm.includes(key)) {
                        continue;
                    }
                }

                for (const seccion of secciones) {
                    if (seccion.carrera) {
                        const secCarreraNorm = normalizar(seccion.carrera);
                        if (carreraNorm && !secCarreraNorm.includes(carreraNorm) && !carreraNorm.includes(secCarreraNorm)) {
                            continue;
                        }
                    }
                    seccionesElectivas.push({
                        ...seccion,
                        cursoReal: nombreCursoElectivo,
                        nombreCursoElectivo: nombreCursoElectivo,
                    });
                }
            }
            return seccionesElectivas;
        }

        return [];
    };

    const esTallerExcel = (horarios: HorariosParseados, nombre: string): boolean => {
        if (nombre.toUpperCase().includes('TALLER')) return true;
        const claves = Object.keys(horarios);
        return claves.length > 0 && claves.every(k => k.toUpperCase().includes('TALLER'));
    };

    const esElectivoExcel = (horarios: HorariosParseados, nombre: string): boolean => {
        if (nombre.toUpperCase().includes('ELECTIV')) return true;
        const claves = Object.keys(horarios);
        return claves.length > 0 && claves.every(k => k.toUpperCase().includes('ELECTIV'));
    };

    const extraerVersion = (nombreArchivo: string): number => {
        const matchVer = nombreArchivo.match(/v[-._\s]*(\d+)/i);
        if (matchVer) {
            return parseInt(matchVer[1], 10);
        }
        const matchNum = nombreArchivo.match(/(\d+)/);
        if (matchNum) {
            return parseInt(matchNum[1], 10);
        }
        return 0;
    };

    const cargarArchivos = async (archivosInput: File[]) => {
        if (!archivosInput || archivosInput.length === 0) return;

        const excelFiles = archivosInput.filter(f =>
            f.name.endsWith('.xlsx') || f.name.endsWith('.xls') || f.name.endsWith('.csv')
        );

        if (excelFiles.length === 0) return;

        limpiarHorarioActual?.();
        setCargandoArchivo(true);
        setCargandoTalleres(true);
        setCargandoElectivos(true);

        try {
            const resultados = await Promise.all(
                excelFiles.map(async (archivo) => ({
                    nombre: archivo.name,
                    horarios: await procesarArchivoExcel(archivo),
                }))
            );

            const baseResultados: { nombre: string; horarios: HorariosParseados; version: number }[] = [];
            const talleresResultados: { nombre: string; horarios: HorariosParseados; version: number }[] = [];
            const electivosResultados: { nombre: string; horarios: HorariosParseados; version: number }[] = [];

            for (const r of resultados) {
                const ver = extraerVersion(r.nombre);
                if (esTallerExcel(r.horarios, r.nombre)) {
                    talleresResultados.push({ ...r, version: ver });
                } else if (esElectivoExcel(r.horarios, r.nombre)) {
                    electivosResultados.push({ ...r, version: ver });
                } else {
                    baseResultados.push({ ...r, version: ver });
                }
            }

            // Ordenar descendentemente por número de versión ("V" más alta primero)
            baseResultados.sort((a, b) => b.version - a.version);
            talleresResultados.sort((a, b) => b.version - a.version);
            electivosResultados.sort((a, b) => b.version - a.version);

            let nBase = nombreArchivo;
            let nTalleres = nombreArchivoTalleres;
            let nElectivos = nombreArchivoElectivos;
            let bHorarios = horariosBase;
            let tHorarios = horariosTalleres;
            let eHorarios = horariosElectivos;

            if (baseResultados.length > 0) {
                const masReciente = baseResultados[0];
                bHorarios = masReciente.horarios;
                nBase = masReciente.nombre;
                setHorariosBase(bHorarios);
                setNombreArchivo(nBase);
            }

            if (talleresResultados.length > 0) {
                const masReciente = talleresResultados[0];
                tHorarios = masReciente.horarios;
                nTalleres = masReciente.nombre;
                setHorariosTalleres(tHorarios);
                setNombreArchivoTalleres(nTalleres);
            }

            if (electivosResultados.length > 0) {
                const masReciente = electivosResultados[0];
                eHorarios = masReciente.horarios;
                nElectivos = masReciente.nombre;
                setHorariosElectivos(eHorarios);
                setNombreArchivoElectivos(nElectivos);
            }

            guardarEnStorage(bHorarios, nBase, tHorarios, nTalleres, eHorarios, nElectivos);
            onExito?.();
        } catch (error) {
            console.error('Error al procesar archivos Excel:', error);
            setMensajeModal?.('Error al cargar el archivo Excel. Por favor, verifica el formato.');
            onError?.();
        } finally {
            setCargandoArchivo(false);
            setCargandoTalleres(false);
            setCargandoElectivos(false);
        }
    };

    const manejarCargaArchivo = async (evento: ChangeEvent<HTMLInputElement>) => {
        const files = evento.target.files;
        if (!files) return;
        await cargarArchivos(Array.from(files));
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
            guardarEnStorage(horariosBase, nombreArchivo, nuevosHorarios, archivo.name, horariosElectivos, nombreArchivoElectivos);
            onExito?.();
        } catch (error) {
            console.error('Error al procesar archivo Excel de talleres:', error);
            setMensajeModal?.('Error al cargar el Excel de talleres. Por favor, verifica el formato.');
            onError?.();
        } finally {
            setCargandoTalleres(false);
        }
    };

    const manejarCargaElectivos = async (evento: ChangeEvent<HTMLInputElement>) => {
        const files = evento.target.files;
        if (!files) return;
        const archivo = files[0];
        if (!archivo) return;
        setCargandoElectivos(true);
        try {
            const nuevosHorarios = await procesarArchivoExcel(archivo);
            setHorariosElectivos(nuevosHorarios);
            setNombreArchivoElectivos(archivo.name);
            guardarEnStorage(horariosBase, nombreArchivo, horariosTalleres, nombreArchivoTalleres, nuevosHorarios, archivo.name);
            onExito?.();
        } catch (error) {
            console.error('Error al procesar archivo Excel de electivos:', error);
            setMensajeModal?.('Error al cargar el Excel de electivos. Por favor, verifica el formato.');
            onError?.();
        } finally {
            setCargandoElectivos(false);
        }
    };

    const eliminarExcelBase = () => {
        setHorariosBase({});
        setNombreArchivo('');
        guardarEnStorage({}, '', horariosTalleres, nombreArchivoTalleres, horariosElectivos, nombreArchivoElectivos);
    };

    const eliminarExcelTalleres = () => {
        setHorariosTalleres({});
        setNombreArchivoTalleres('');
        guardarEnStorage(horariosBase, nombreArchivo, {}, '', horariosElectivos, nombreArchivoElectivos);
    };

    const eliminarExcelElectivos = () => {
        setHorariosElectivos({});
        setNombreArchivoElectivos('');
        guardarEnStorage(horariosBase, nombreArchivo, horariosTalleres, nombreArchivoTalleres, {}, '');
    };

    return {
        nombreArchivo, cargandoArchivo,
        nombreArchivoTalleres, cargandoTalleres,
        nombreArchivoElectivos, cargandoElectivos,
        horariosDisponibles, obtenerHorariosPorCurso,
        manejarCargaArchivo, manejarCargaTalleres, manejarCargaElectivos, cargarArchivos,
        eliminarExcelBase, eliminarExcelTalleres, eliminarExcelElectivos,
    };
}
