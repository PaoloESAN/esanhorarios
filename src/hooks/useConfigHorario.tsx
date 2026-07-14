"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ConfigHorario {
    camposVisibles: {
        curso: boolean;
        seccion: boolean;
        profesor: boolean;
        aula: boolean;
    };
    nombreCortoProfesor: boolean;
    nombrePrimero: boolean;
    tamanoLetra: number;
    alineacion: 'left' | 'center' | 'right';
    ocultarFilasVacias: boolean;
    fondoChiJauKay: boolean;
    fondoTiPaKay: boolean;
    chijaukayDesbloqueado: boolean;
    tipakayDesbloqueado: boolean;
}

export interface ConfigHorarioContextType {
    config: ConfigHorario;
    actualizarConfig: (patch: Partial<ConfigHorario>) => void;
    toggleCampo: (campo: keyof ConfigHorario['camposVisibles']) => void;
}

const DEFAULTS: ConfigHorario = {
    camposVisibles: { curso: true, seccion: true, profesor: true, aula: true },
    nombreCortoProfesor: false,
    nombrePrimero: false,
    tamanoLetra: 14,
    alineacion: 'left',
    ocultarFilasVacias: false,
    fondoChiJauKay: false,
    fondoTiPaKay: false,
    chijaukayDesbloqueado: false,
    tipakayDesbloqueado: false,
};

const ConfigHorarioContext = createContext<ConfigHorarioContextType | null>(null);

export function ConfigHorarioProvider({ children }: { children: ReactNode }) {
    const [config, setConfig] = useState<ConfigHorario>(DEFAULTS);

    // Cargar configuración guardada desde localStorage después del mount
    // para evitar hydration mismatch (servidor siempre renderiza DEFAULTS)
    useEffect(() => {
        try {
            const saved = localStorage.getItem("configHorario");
            if (saved) {
                setConfig((prev) => ({ ...prev, ...JSON.parse(saved) }));
            }
        } catch { }
    }, []);

    const actualizarConfig = (patch: Partial<ConfigHorario>) => {
        setConfig((prev) => {
            const next = { ...prev, ...patch };
            try { localStorage.setItem("configHorario", JSON.stringify(next)); } catch { }
            return next;
        });
    };

    const toggleCampo = (campo: keyof ConfigHorario['camposVisibles']) => {
        setConfig((prev) => {
            const campos = { ...prev.camposVisibles };
            // No permitir desmarcar si solo queda uno activo
            const activos = Object.values(campos).filter(Boolean).length;
            if (campos[campo] && activos <= 1) return prev;
            campos[campo] = !campos[campo];
            const next = { ...prev, camposVisibles: campos };
            try { localStorage.setItem("configHorario", JSON.stringify(next)); } catch { }
            return next;
        });
    };

    return (
        <ConfigHorarioContext.Provider value={{ config, actualizarConfig, toggleCampo }}>
            {children}
        </ConfigHorarioContext.Provider>
    );
}

export function useConfigHorario(): ConfigHorarioContextType {
    const ctx = useContext(ConfigHorarioContext);
    if (!ctx) throw new Error("useConfigHorario must be inside ConfigHorarioProvider");
    return ctx;
}

/**
 * Utilidad: acorta "APELLIDO1 APELLIDO2 NOMBRE1 NOMBRE2" → "Apellido1 Nombre1"
 * Si nombrePrimero = true → "Nombre1 Apellido1"
 */
export function acortarNombreProfesor(nombre: string, nombrePrimero = false): string {
    if (!nombre) return "";
    const partes = nombre.trim().split(/\s+/);
    const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    if (partes.length <= 2) {
        if (nombrePrimero && partes.length === 2) return `${capitalizar(partes[1])} ${capitalizar(partes[0])}`;
        return nombre;
    }
    // Formato esperado: APE1 APE2 NOM1 NOM2 → toma APE1 (idx 0) y NOM1 (idx 2)
    const apellido = capitalizar(partes[0]);
    const nom = capitalizar(partes[2] ?? partes[1]);
    return nombrePrimero ? `${nom} ${apellido}` : `${apellido} ${nom}`;
}

/**
 * Invierte el orden completo: "APE1 APE2 NOM1 NOM2" → "Nom1 Nom2 Ape1 Ape2"
 */
export function invertirOrdenProfesor(nombre: string): string {
    if (!nombre) return "";
    const partes = nombre.trim().split(/\s+/);
    if (partes.length <= 2) return partes.reverse().join(" ");
    // Asumimos 2 apellidos + resto nombres
    const apellidos = partes.slice(0, 2);
    const nombres = partes.slice(2);
    return [...nombres, ...apellidos].join(" ");
}
