export const HORARIO_COUNT = 5;

/** Genera un objeto { 1:{}, 2:{}, 3:{}, 4:{}, 5:{} } */
export const crearHorariosVacios = () =>
    Object.fromEntries(Array.from({ length: HORARIO_COUNT }, (_, i) => [i + 1, {}]));

/** Genera { 1: new Set(), … 5: new Set() } */
export const crearSetsVacios = () =>
    Object.fromEntries(Array.from({ length: HORARIO_COUNT }, (_, i) => [i + 1, new Set()]));

/** Genera { 1: new Map(), … 5: new Map() } */
export const crearMapasVacios = () =>
    Object.fromEntries(Array.from({ length: HORARIO_COUNT }, (_, i) => [i + 1, new Map()]));

export const TEXTOS_MATRICULA = {
    1: 'Eres INCREIBLE.',
    2: 'Lo lograste, podrás matricularte a todo.',
    3: 'Tienes oportunidad.',
    4: 'La esperanza es lo último que se pierde.',
    5: 'Retírate de la Universidad.'
};

export const PALETAS_NOMBRES = {
    default: 'Clásica',
    pastel: 'Pastel',
    vibrante: 'Vibrante',
    monocromatico: 'Monocromático',
    neon: 'Neón',
    otono: 'Otoño',
    oceanico: 'Oceánico'
};

export const PALETA_PREVIEW_COLORS = {
    default: ['bg-blue-200', 'bg-green-200', 'bg-red-200'],
    pastel: ['bg-rose-100', 'bg-sky-100', 'bg-emerald-100'],
    vibrante: ['bg-blue-400', 'bg-green-400', 'bg-red-400'],
    monocromatico: ['bg-gray-200', 'bg-gray-300', 'bg-slate-200'],
    neon: ['bg-cyan-300', 'bg-lime-300', 'bg-pink-300'],
    otono: ['bg-amber-200', 'bg-orange-200', 'bg-red-200'],
    oceanico: ['bg-blue-200', 'bg-cyan-200', 'bg-teal-200'],
};
