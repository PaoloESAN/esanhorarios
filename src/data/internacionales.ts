import { normalizar } from "@/lib/horario";

export interface ElectivoInternacionalDef {
    nombre: string;
    turno: 'manana' | 'tarde';
    firmas: string[];
}

export const ELECTIVOS_INTERNACIONALES_DEF: ElectivoInternacionalDef[] = [
    {
        nombre: "Fundamentals of Vibe Coding (Michael Dorin)",
        turno: 'manana',
        firmas: ["VIBE CODING", "FUNDAMENTALS OF VIBE", "DORIN"],
    },
    {
        nombre: "Management Competences (Vinod Rajament)",
        turno: 'manana',
        firmas: ["MANAGEMENT COMPETENCES", "VINOD", "RAJAMENT"],
    },
    {
        nombre: "Fashion and Luxury Marketing (Arianna Brioschi)",
        turno: 'manana',
        firmas: ["FASHION AND LUXURY", "FASHION & LUXURY", "BRIOSCHI"],
    },
    {
        nombre: "From Lima to the World: Discovering How IT transforms business (Chih-Yuan Chou)",
        turno: 'manana',
        firmas: ["FROM LIMA TO THE WORLD", "CHIH-YUAN", "CHOU"],
    },
    {
        nombre: "Organizational Theater: Señales, Simbolismos y Estrategias de Gestión en la Era de la Hiper-Visibilidad (Milton Paredes Aguirre)",
        turno: 'manana',
        firmas: ["ORGANIZATIONAL THEATER", "TEATRO ORGANIZACIONAL", "MILTON PAREDES"],
    },
    {
        nombre: "Habilidades comunicacionales para el diseño del proyecto profesional (Teresita Serranos)",
        turno: 'manana',
        firmas: ["HABILIDADES COMUNICACIONALES", "TERESITA SERRANOS"],
    },
    {
        nombre: "Mercados Laborales: La economía de discriminación (Jay Walker)",
        turno: 'tarde',
        firmas: ["MERCADOS LABORALES", "JAY WALKER"],
    },
    {
        nombre: "Resilients Systems: Enfoque Interdisciplinario para Organizaciones, Logística y Cadenas de Suministro (Alexander Garrido)",
        turno: 'tarde',
        firmas: ["RESILIENTS SYSTEMS", "RESILIENT SYSTEMS", "ALEXANDER GARRIDO"],
    },
    {
        nombre: "Chatbots RAG para Servicio al cliente y calidad de servicio (QoS) (Francisco Rodríguez)",
        turno: 'tarde',
        firmas: ["CHATBOTS RAG", "CHATBOTS", "FRANCISCO RODRIGUEZ"],
    },
    {
        nombre: "Machine Learning Models Design (Dariusz Put)",
        turno: 'tarde',
        firmas: ["MACHINE LEARNING MODELS DESIGN", "MODELS DESIGN", "DARIUSZ PUT", "PUT DARIUSZ"],
    },
    {
        nombre: "Liderazgo Positivo (Yarid Ayala)",
        turno: 'tarde',
        firmas: ["LIDERAZGO POSITIVO", "YARID AYALA"],
    },
];

export const ELECTIVOS_INTERNACIONALES_MANANA: string[] = ELECTIVOS_INTERNACIONALES_DEF
    .filter(d => d.turno === 'manana')
    .map(d => d.nombre);

export const ELECTIVOS_INTERNACIONALES_TARDE: string[] = ELECTIVOS_INTERNACIONALES_DEF
    .filter(d => d.turno === 'tarde')
    .map(d => d.nombre);

export const LISTA_ELECTIVOS_INTERNACIONALES: string[] = ELECTIVOS_INTERNACIONALES_DEF
    .map(d => d.nombre);

export const carreraInternacional = {
    nombre: "Electivos Internacionales",
    slug: "internacional",
    facultad: "Internacional",
    cursos: {
        "Electivos Internacionales": LISTA_ELECTIVOS_INTERNACIONALES.reduce((acc, curso) => {
            acc[curso] = 3;
            return acc;
        }, {} as Record<string, number>),
    },
    prerrequisitos: {},
};

export function obtenerTurnoElectivoInternacional(cursoNombre: string): 'manana' | 'tarde' | null {
    const coincidencia = encontrarElectivoInternacional(cursoNombre);
    if (!coincidencia) return null;
    const def = ELECTIVOS_INTERNACIONALES_DEF.find(d => d.nombre === coincidencia);
    return def ? def.turno : null;
}

export function encontrarElectivoInternacional(cursoNombreReal: string): string | null {
    if (!cursoNombreReal) return null;
    const realNorm = normalizar(cursoNombreReal);
    if (!realNorm || realNorm.length < 3) return null;

    for (const def of ELECTIVOS_INTERNACIONALES_DEF) {
        // 1. Coincidencia exacta con el nombre oficial normalizado (sin paréntesis de profesor)
        const oficialLimpio = def.nombre.replace(/\([^)]*\)/g, '').trim();
        const oficialNorm = normalizar(oficialLimpio);
        if (realNorm === oficialNorm) return def.nombre;

        // 2. Coincidencia por firmas predefinidas
        for (const firma of def.firmas) {
            const firmaNorm = normalizar(firma);
            if (realNorm === firmaNorm || realNorm.includes(firmaNorm) || firmaNorm.includes(realNorm)) {
                return def.nombre;
            }
        }
    }
    return null;
}
