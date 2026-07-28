import { adm_finanzas } from './adm_finanzas';
import { adm_negocios } from './adm_negocios';
import { administracion } from './administracion';
import { ambiental } from './ambiental';
import { ciencia_datos } from './ciencia_datos';
import { comunicacion_mkt } from './comunicacion_mkt';
import { contabilidad } from './contabilidad';
import { derecho } from './derecho';
import { derecho_corporativo } from './derecho_corporativo';
import { economia } from './economia';
import { economia_finanzas } from './economia_finanzas';
import { economia_pura } from './economia_pura';
import { ia } from './ia';
import { industrial } from './industrial';
import { psicologia } from './psicologia';
import { software } from './software';
import { ti } from './ti';

export interface RequisitoCurso {
    prerequisitos?: string[];
    creditosRequeridos?: number;
    segunElectivo?: boolean;
}

export interface Carrera {
    nombre: string;
    slug: string;
    facultad: string;
    cursos: Record<string, Record<string, number>>;
    prerrequisitos?: Record<string, RequisitoCurso>;
}

/**
 * Registro de todas las carreras disponibles.
 * Para agregar una nueva carrera, crea su archivo en src/data/
 * e impórtalo aquí.
 */
export const carreras: Record<string, Carrera> = {
    adm_finanzas,
    adm_negocios,
    administracion,
    ambiental,
    ciencia_datos,
    comunicacion_mkt,
    contabilidad,
    derecho,
    derecho_corporativo,
    economia,
    economia_finanzas,
    economia_pura,
    ia,
    industrial,
    psicologia,
    software,
    ti,
};

/** Obtiene los datos de una carrera por su slug */
export const getCarrera = (slug: string): Carrera | null => carreras[slug] || null;

/** Obtiene todos los slugs disponibles */
export const getSlugs = (): string[] => Object.keys(carreras);

/** Obtiene la lista de carreras para navegación */
export const getCarrerasNav = () =>
    Object.values(carreras).map(({ nombre, slug, facultad }) => ({ nombre, slug, facultad }));

/**
 * Agrupa las carreras por facultad para la página de inicio.
 * Retorna [{ facultad: "Ingeniería", carreras: [{ nombre, slug }, ...] }, ...]
 */
export const getCarrerasPorFacultad = () => {
    const mapa: Record<string, Array<{ nombre: string; slug: string }>> = {};
    for (const c of Object.values(carreras)) {
        const f = c.facultad ?? 'Otros';
        if (!mapa[f]) mapa[f] = [];
        mapa[f].push({ nombre: c.nombre, slug: c.slug });
    }
    return Object.entries(mapa).map(([facultad, items]) => ({ facultad, carreras: items }));
};

/**
 * Dado un objeto de carrera, extrae las listas de cursos por ciclo.
 * Retorna { "Primer Ciclo": ["Curso A", "Curso B", ...], ... }
 */
export const getCursosPorCiclo = (carrera: Carrera) => {
    const resultado: Record<string, string[]> = {};
    for (const [ciclo, cursosObj] of Object.entries(carrera.cursos)) {
        resultado[ciclo] = Object.keys(cursosObj);
    }
    return resultado;
};

/**
 * Dado un objeto de carrera, construye un Map normalizado de créditos.
 * Para buscar: normaliza el nombre a MAYÚSCULAS sin tildes.
 */
export const buildCreditosMap = (carrera: Carrera): Map<string, number> => {
    const map = new Map<string, number>();
    for (const cursosObj of Object.values(carrera.cursos)) {
        for (const [curso, creditos] of Object.entries(cursosObj)) {
            const key = curso
                .toUpperCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .trim();
            map.set(key, creditos);
        }
    }
    return map;
};
