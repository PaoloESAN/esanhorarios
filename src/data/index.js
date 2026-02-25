import { software } from './software';
import { ti } from './ti';

/**
 * Registro de todas las carreras disponibles.
 * Para agregar una nueva carrera, crea su archivo en src/data/
 * e impórtalo aquí.
 */
export const carreras = {
    software,
    ti,
};

/** Obtiene los datos de una carrera por su slug */
export const getCarrera = (slug) => carreras[slug] || null;

/** Obtiene todos los slugs disponibles */
export const getSlugs = () => Object.keys(carreras);

/** Obtiene la lista de carreras para navegación */
export const getCarrerasNav = () =>
    Object.values(carreras).map(({ nombre, slug, facultad }) => ({ nombre, slug, facultad }));

/**
 * Agrupa las carreras por facultad para la página de inicio.
 * Retorna [{ facultad: "Ingeniería", carreras: [{ nombre, slug }, ...] }, ...]
 */
export const getCarrerasPorFacultad = () => {
    const mapa = {};
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
export const getCursosPorCiclo = (carrera) => {
    const resultado = {};
    for (const [ciclo, cursosObj] of Object.entries(carrera.cursos)) {
        resultado[ciclo] = Object.keys(cursosObj);
    }
    return resultado;
};

/**
 * Dado un objeto de carrera, construye un Map normalizado de créditos.
 * Para buscar: normaliza el nombre a MAYÚSCULAS sin tildes.
 */
export const buildCreditosMap = (carrera) => {
    const map = new Map();
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
