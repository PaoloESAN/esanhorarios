"use client";

import { useState, useEffect, useMemo, useSyncExternalStore } from "react";
import { Carrera } from "@/data";

const normalizarTexto = (str: string): string => {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
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
            if (!aprobadosData.tieneMalla) return false;

            const normNombre = normalizarTexto(nombreCurso);
            const prerreqMap = carrera.prerrequisitos || {};

            const reqInfo =
                prerreqMap[nombreCurso] ||
                prerreqMap[
                    Object.keys(prerreqMap).find((k) => normalizarTexto(k) === normNombre) || ""
                ];

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
                    if (!aprobadosData.aprobados.has(normPre)) {
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

    return {
        tieneMalla: aprobadosData.tieneMalla,
        esCursoBloqueado,
        esCursoAprobado,
    };
}
