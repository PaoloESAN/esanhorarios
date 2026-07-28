export interface CarreraItem {
    nombre: string;
    slug?: string;
    activa: boolean;
}

export interface FacultadColumna {
    facultad: string;
    bgImage: string;
    color: string;
    colorLight: string;
    icon: string;
    carreras: CarreraItem[];
}

/* ─── Datos de facultades y carreras ─── */
export const COLUMNAS: FacultadColumna[] = [
    {
        facultad: "Economía",
        bgImage: "/economia.webp",
        color: "#9c0a12",
        colorLight: "#fee2e2",
        icon: "/toro.webp",
        carreras: [
            { nombre: "Economía", slug: "economia_pura", activa: true },
            { nombre: "Economía y Finanzas", slug: "economia_finanzas", activa: true },
            { nombre: "Economía y Neg. Internacionales", slug: "economia", activa: true },
            { nombre: "Contabilidad", slug: "contabilidad", activa: true },
        ],
    },
    {
        facultad: "Administración",
        bgImage: "/administracion.webp",
        color: "#2140b0",
        colorLight: "#dbeafe",
        icon: "/lobo.webp",
        carreras: [
            { nombre: "Administración", slug: "administracion", activa: true },
            { nombre: "Adm. y Finanzas", slug: "adm_finanzas", activa: true },
            { nombre: "Adm. y Marketing", activa: false },
            { nombre: "Adm. y Neg. Internacionales", slug: "adm_negocios", activa: true },
            { nombre: "Com. Empresarial y Mkt. Digital", slug: "comunicacion_mkt", activa: true },
        ],
    },
    {
        facultad: "Ingeniería",
        bgImage: "/ingenieria.webp",
        color: "#016823",
        colorLight: "#dcfce7",
        icon: "/vikingo.webp",
        carreras: [
            { nombre: "Ing. de Software", slug: "software", activa: true },
            { nombre: "Ing. de TI", slug: "ti", activa: true },
            { nombre: "Ciencia de Datos", slug: "ciencia_datos", activa: true },
            { nombre: "Ing. Ambiental", slug: "ambiental", activa: true },
            { nombre: "Ing. Industrial y Comercial", slug: "industrial", activa: true },
            { nombre: "Ing. en Inteligencia Artificial", slug: "ia", activa: true },
        ],
    },
    {
        facultad: "Psicología y Derecho",
        bgImage: "/derecho.webp",
        color: "#f8c227",
        colorLight: "#fef08a",
        icon: "/leon.webp",
        carreras: [
            { nombre: "Derecho Corporativo", slug: "derecho_corporativo", activa: true },
            { nombre: "Psicología", slug: "psicologia", activa: true },
            { nombre: "Derecho", slug: "derecho", activa: true },
        ],
    },
];

export const NUM_FILAS: number = Math.max(...COLUMNAS.map((c) => c.carreras.length));
