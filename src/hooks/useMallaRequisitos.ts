"use client";

import { useState, useEffect, useMemo, useSyncExternalStore } from "react";
import { Carrera } from "@/data";
import { LISTA_ELECTIVOS } from "@/data/electivos";

const normalizarTexto = (str: string): string => {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
};

const sonCursosPrerrequisitoEquivalentes = (normPre: string, aprobadosSet: Set<string>): boolean => {
    if (aprobadosSet.has(normPre)) return true;

    const numRomanos = ['i', 'ii', 'iii', 'iv', 'v'];
    const tokensPre = normPre.split(/\s+/);
    const preNum = numRomanos.find(n => tokensPre[tokensPre.length - 1] === n);

    for (const ap of Array.from(aprobadosSet)) {
        if (ap === normPre) return true;

        // Comprobar coincidencia de subcadena
        if (ap.includes(normPre) || normPre.includes(ap)) {
            const tokensAp = ap.split(/\s+/);
            const apNum = numRomanos.find(n => tokensAp[tokensAp.length - 1] === n);

            // Si ambos cursos tienen número romano al final (ej: I vs II), exigir que coincidan
            if (preNum && apNum && preNum !== apNum) {
                continue;
            }

            // Exigir una longitud mínima significativa si se busca por subcadena
            if (normPre.length >= 8 && ap.length >= 8) {
                return true;
            }
        }
    }

    return false;
};

const obtenerInfoRequisito = (nombreCurso: string, prerreqMap: Record<string, any>) => {
    const normNombre = normalizarTexto(nombreCurso);

    let reqInfo =
        prerreqMap[nombreCurso] ||
        prerreqMap[
            Object.keys(prerreqMap).find((k) => normalizarTexto(k) === normNombre) || ""
        ];

    if (!reqInfo || reqInfo.segunElectivo) {
        const electivo = LISTA_ELECTIVOS.find(e => {
            const eNorm = normalizarTexto(e.nombre);
            return eNorm === normNombre || normNombre.includes(eNorm) || eNorm.includes(normNombre);
        });

        if (electivo && electivo.requisitos) {
            const reqTexto = electivo.requisitos.trim();
            if (reqTexto && !reqTexto.toLowerCase().includes('no tiene') && reqTexto !== '—') {
                let creditosRequeridos: number | undefined = undefined;
                const matchCred = reqTexto.match(/(\d+)\s*créditos/i);
                if (matchCred) {
                    creditosRequeridos = parseInt(matchCred[1], 10);
                }

                let prerequisitos: string[] = [];
                let prerequisitosOpciones: string[][] = [];

                if (!creditosRequeridos) {
                    if (reqTexto.includes('/')) {
                        // Requisito de opciones alternativas (OR)
                        const opciones = reqTexto.split('/').map(p => p.replace(/\([^)]*\)/g, '').trim()).filter(Boolean);
                        prerequisitosOpciones.push(opciones);
                    } else {
                        // Requisito AND (separado por comas)
                        const partes = reqTexto.split(',').map(p => p.replace(/\([^)]*\)/g, '').trim()).filter(Boolean);
                        prerequisitos.push(...partes);
                    }
                }

                reqInfo = {
                    creditosRequeridos,
                    prerequisitos,
                    prerequisitosOpciones,
                };
            }
        }
    }

    return reqInfo;
};

const emptySubscribe = () => () => { };

export function useMallaRequisitos(carrera: Carrera) {
    const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
    const storageKey = `malla_aprobados_${carrera.slug}`;

    const [aprobadosData, setAprobadosData] = useState<{ tieneMalla: boolean; aprobados: Set<string> }>({
        tieneMalla: false,
        aprobados: new Set(),
    });

    useEffect(() => {
        if (!isMounted) return;

        const cargarMalla = () => {
            try {
                const saved = localStorage.getItem(storageKey);
                if (saved !== null) {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed)) {
                        setAprobadosData({
                            tieneMalla: true,
                            aprobados: new Set(parsed.map((item: string) => normalizarTexto(item))),
                        });
                        return;
                    }
                }
            } catch (e) {
                console.error("Error al cargar malla de localStorage:", e);
            }
            setAprobadosData({
                tieneMalla: false,
                aprobados: new Set(),
            });
        };

        cargarMalla();

        const handleStorage = (e: StorageEvent) => {
            if (e.key === storageKey || e.key === null) {
                cargarMalla();
            }
        };

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, [isMounted, storageKey]);

    const { mapaCursos } = useMemo(() => {
        const mapa = new Map<string, number>();
        for (const cursosObj of Object.values(carrera.cursos)) {
            for (const [nombreCurso, creditos] of Object.entries(cursosObj)) {
                mapa.set(normalizarTexto(nombreCurso), creditos);
            }
        }
        return { mapaCursos: mapa };
    }, [carrera]);

    const totalCreditosAprobados = useMemo(() => {
        if (!aprobadosData.tieneMalla) return 0;
        let suma = 0;
        for (const normNombre of aprobadosData.aprobados) {
            const creditos = mapaCursos.get(normNombre);
            if (creditos !== undefined) {
                suma += creditos;
            }
        }
        return suma;
    }, [aprobadosData, mapaCursos]);

    const esCursoBloqueado = useMemo(() => {
        return (nombreCurso: string): boolean => {
            if (!aprobadosData.tieneMalla || aprobadosData.aprobados.size === 0) return false;

            const prerreqMap = carrera.prerrequisitos || {};
            const reqInfo = obtenerInfoRequisito(nombreCurso, prerreqMap);

            if (!reqInfo) return false;

            if (
                reqInfo.creditosRequeridos &&
                totalCreditosAprobados < reqInfo.creditosRequeridos
            ) {
                return true;
            }

            if (reqInfo.prerequisitos && reqInfo.prerequisitos.length > 0) {
                for (const pre of reqInfo.prerequisitos) {
                    const normPre = normalizarTexto(pre);
                    if (!sonCursosPrerrequisitoEquivalentes(normPre, aprobadosData.aprobados)) {
                        return true;
                    }
                }
            }

            if (reqInfo.prerequisitosOpciones && reqInfo.prerequisitosOpciones.length > 0) {
                for (const grupoOpciones of reqInfo.prerequisitosOpciones) {
                    const algunAprobado = grupoOpciones.some(pre => {
                        const normPre = normalizarTexto(pre);
                        return sonCursosPrerrequisitoEquivalentes(normPre, aprobadosData.aprobados);
                    });
                    if (!algunAprobado) {
                        return true;
                    }
                }
            }

            return false;
        };
    }, [aprobadosData, carrera.prerrequisitos, totalCreditosAprobados]);

    const esCursoAprobado = useMemo(() => {
        return (nombreCurso: string): boolean => {
            if (!aprobadosData.tieneMalla) return false;
            const normNombre = normalizarTexto(nombreCurso);
            return aprobadosData.aprobados.has(normNombre);
        };
    }, [aprobadosData]);

    const obtenerRequisitosFaltantes = useMemo(() => {
        return (nombreCurso: string): { requisitosFaltantes: string[]; creditosFaltantes: number } => {
            if (!aprobadosData.tieneMalla || aprobadosData.aprobados.size === 0) {
                return { requisitosFaltantes: [], creditosFaltantes: 0 };
            }

            const prerreqMap = carrera.prerrequisitos || {};
            const reqInfo = obtenerInfoRequisito(nombreCurso, prerreqMap);

            if (!reqInfo) {
                return { requisitosFaltantes: [], creditosFaltantes: 0 };
            }

            let creditosFaltantes = 0;
            if (
                reqInfo.creditosRequeridos &&
                totalCreditosAprobados < reqInfo.creditosRequeridos
            ) {
                creditosFaltantes = reqInfo.creditosRequeridos - totalCreditosAprobados;
            }

            const requisitosFaltantes: string[] = [];
            if (reqInfo.prerequisitos && reqInfo.prerequisitos.length > 0) {
                for (const pre of reqInfo.prerequisitos) {
                    const normPre = normalizarTexto(pre);
                    if (!sonCursosPrerrequisitoEquivalentes(normPre, aprobadosData.aprobados)) {
                        requisitosFaltantes.push(pre);
                    }
                }
            }

            if (reqInfo.prerequisitosOpciones && reqInfo.prerequisitosOpciones.length > 0) {
                for (const grupoOpciones of reqInfo.prerequisitosOpciones) {
                    const algunAprobado = grupoOpciones.some(pre => {
                        const normPre = normalizarTexto(pre);
                        return sonCursosPrerrequisitoEquivalentes(normPre, aprobadosData.aprobados);
                    });
                    if (!algunAprobado) {
                        requisitosFaltantes.push(grupoOpciones.join(" o "));
                    }
                }
            }

            return { requisitosFaltantes, creditosFaltantes };
        };
    }, [aprobadosData, carrera.prerrequisitos, totalCreditosAprobados]);

    return {
        tieneMalla: aprobadosData.tieneMalla,
        esCursoBloqueado,
        esCursoAprobado,
        obtenerRequisitosFaltantes,
    };
}
