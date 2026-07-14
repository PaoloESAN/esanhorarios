import { createContext, useContext, ReactNode } from "react";
import { getCursosPorCiclo, buildCreditosMap, Carrera } from "@/data";

export interface CarreraContextType {
    nombre: string;
    slug: string;
    cursosPorCiclo: Record<string, string[]>;
    obtenerCreditos: (nombreCurso: string) => number;
}

const CarreraContext = createContext<CarreraContextType | null>(null);

/**
 * Provee los datos de la carrera activa a toda la app.
 * Deriva cursosPorCiclo y la función obtenerCreditos desde los datos crudos.
 */
export function CarreraProvider({ carrera, children }: { carrera: Carrera; children: ReactNode }) {
    const cursosPorCiclo = getCursosPorCiclo(carrera);
    const creditosMap = buildCreditosMap(carrera);

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
        cursosPorCiclo,
        obtenerCreditos,
    };

    return (
        <CarreraContext.Provider value={value}>
            {children}
        </CarreraContext.Provider>
    );
}

export function useCarrera(): CarreraContextType {
    const ctx = useContext(CarreraContext);
    if (!ctx) throw new Error("useCarrera debe usarse dentro de CarreraProvider");
    return ctx;
}
