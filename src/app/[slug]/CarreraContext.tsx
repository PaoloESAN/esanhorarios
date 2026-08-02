"use client";

import { createContext, useContext, ReactNode } from "react";
import { getCursosPorCiclo, buildCreditosMap, Carrera } from "@/data";
import { useMallaRequisitos } from "@/hooks/useMallaRequisitos";

export interface CarreraContextType {
    nombre: string;
    slug: string;
    carrera: Carrera;
    cursosPorCiclo: Record<string, string[]>;
    obtenerCreditos: (nombreCurso: string) => number;
    esCursoBloqueado: (nombreCurso: string) => boolean;
    esCursoAprobado: (nombreCurso: string) => boolean;
    obtenerRequisitosFaltantes: (nombreCurso: string) => { requisitosFaltantes: string[]; creditosFaltantes: number };
}

const CarreraContext = createContext<CarreraContextType | null>(null);

/**
 * Provee los datos de la carrera activa a toda la app.
 * Deriva cursosPorCiclo y la función obtenerCreditos desde los datos crudos.
 */
export function CarreraProvider({ carrera, children }: { carrera: Carrera; children: ReactNode }) {
    const cursosPorCiclo = getCursosPorCiclo(carrera);
    const creditosMap = buildCreditosMap(carrera);
    const { esCursoBloqueado, esCursoAprobado, obtenerRequisitosFaltantes } = useMallaRequisitos(carrera);

    const obtenerCreditos = (nombreCurso: string): number => {
        if (!nombreCurso) return 0;
        const key = nombreCurso
            .toUpperCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
        if (creditosMap.has(key)) return creditosMap.get(key)!;
        for (const [curso, creditos] of creditosMap) {
            if (curso.includes(key) || key.includes(curso)) return creditos;
        }
        return 3;
    };

    const value: CarreraContextType = {
        nombre: carrera.nombre,
        slug: carrera.slug,
        carrera,
        cursosPorCiclo,
        obtenerCreditos,
        esCursoBloqueado,
        esCursoAprobado,
        obtenerRequisitosFaltantes,
    };

    return (
        <CarreraContext.Provider value={value}>
            {children}
        </CarreraContext.Provider>
    );
}

import { carreraInternacional } from "@/data/internacionales";

export function useCarrera(): CarreraContextType {
    const ctx = useContext(CarreraContext);
    if (!ctx) {
        const fallbackCarrera = carreraInternacional;
        const creditosMap = buildCreditosMap(fallbackCarrera);
        return {
            nombre: fallbackCarrera.nombre,
            slug: fallbackCarrera.slug,
            carrera: fallbackCarrera,
            cursosPorCiclo: getCursosPorCiclo(fallbackCarrera),
            obtenerCreditos: (n) => creditosMap.get(n) || 3,
            esCursoBloqueado: () => false,
            esCursoAprobado: () => false,
            obtenerRequisitosFaltantes: () => ({ requisitosFaltantes: [], creditosFaltantes: 0 }),
        };
    }
    return ctx;
}
