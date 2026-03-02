/* ─── Datos de facultades y carreras ─── */
export const COLUMNAS = [
    {
        facultad: "Economía",
        bgImage: "/economia.webp",
        color: "#9c0a12",
        colorLight: "#fee2e2",
        icon: "/toro.webp",
        carreras: [
            { nombre: "Economía", activa: false },
            { nombre: "Economía y Finanzas", activa: false },
            { nombre: "Economía y Neg. Internacionales", activa: false },
            { nombre: "Contabilidad", activa: false },
        ],
    },
    {
        facultad: "Administración",
        bgImage: "/administracion.webp",
        color: "#2140b0",
        colorLight: "#dbeafe",
        icon: "/lobo.webp",
        carreras: [
            { nombre: "Administración", activa: false },
            { nombre: "Adm. y Finanzas", activa: false },
            { nombre: "Adm. y Marketing", activa: false },
            { nombre: "Adm. y Neg. Internacionales", activa: false },
            { nombre: "Com. Empresarial y Mkt. Digital", activa: false },
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
            { nombre: "Ing. en Inteligencia Artificial", activa: false },
        ],
    },
    {
        facultad: "Psicología y Derecho",
        bgImage: "/derecho.webp",
        color: "#f8c227",
        colorLight: "#fef08a",
        icon: "/leon.webp",
        carreras: [
            { nombre: "Derecho Corporativo", activa: false },
            { nombre: "Psicología", activa: false },
            { nombre: "Derecho", activa: false },
        ],
    },
];

export const NUM_FILAS = Math.max(...COLUMNAS.map((c) => c.carreras.length));
