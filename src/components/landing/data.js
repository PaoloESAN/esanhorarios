import {
    DollarSign,
    Briefcase,
    Cpu,
    Scale,
} from "lucide-react";

/* ─── Datos de facultades y carreras ─── */
export const COLUMNAS = [
    {
        facultad: "Economía",
        color: "#16a34a",
        colorLight: "#dcfce7",
        icon: DollarSign,
        carreras: [
            { nombre: "Economía", activa: false },
            { nombre: "Economía y Finanzas", activa: false },
            { nombre: "Economía y Neg. Internacionales", activa: false },
            { nombre: "Contabilidad", activa: false },
        ],
    },
    {
        facultad: "Administración",
        color: "#ea580c",
        colorLight: "#fff7ed",
        icon: Briefcase,
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
        color: "#2563eb",
        colorLight: "#dbeafe",
        icon: Cpu,
        carreras: [
            { nombre: "Ing. de Software", slug: "software", activa: true },
            { nombre: "Ing. de TI", slug: "ti", activa: true },
            { nombre: "Ciencia de Datos", activa: false },
            { nombre: "Ing. Ambiental", activa: false },
            { nombre: "Ing. Industrial y Comercial", activa: false },
            { nombre: "Ing. en Inteligencia Artificial", activa: false },
        ],
    },
    {
        facultad: "Derecho y Cs. Sociales",
        color: "#7c3aed",
        colorLight: "#ede9fe",
        icon: Scale,
        carreras: [
            { nombre: "Derecho Corporativo", activa: false },
            { nombre: "Psicología", activa: false },
            { nombre: "Derecho", activa: false },
        ],
    },
];

export const NUM_FILAS = Math.max(...COLUMNAS.map((c) => c.carreras.length));
