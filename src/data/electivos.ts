export interface CursoElectivo {
    nombre: string;
    creditos: number;
    requisitos: string;
    carreras: string[]; // Slugs de las carreras para las que aplica
}

/**
 * Catálogo maestro de Cursos Electivos extraído del PDF oficial de ESAN (2026-2)
 * Marcaciones exactas según casilla (X) por carrera en la matriz oficial.
 */
export const LISTA_ELECTIVOS: CursoElectivo[] = [
    // PÁGINA 1
    {
        nombre: "ANÁLISIS DE COMPETITIVIDAD INTERNACIONAL",
        creditos: 3,
        requisitos: "Investigación de Mercados Internacionales",
        carreras: ["adm_negocios", "economia"]
    },
    {
        nombre: "ANÁLISIS FUNDAMENTAL Y TÉCNICO BURSÁTIL I",
        creditos: 3,
        requisitos: "Fundamentos de Banca y Bolsa de Valores",
        carreras: ["economia_finanzas"]
    },
    {
        nombre: "ANÁLISIS FUNDAMENTAL Y TÉCNICO BURSÁTIL II",
        creditos: 3,
        requisitos: "Análisis Fundamental y Técnico Bursátil I",
        carreras: ["economia_finanzas"]
    },
    {
        nombre: "ANÁLISIS Y GESTIÓN DE RIESGOS",
        creditos: 3,
        requisitos: "Instrumentos Financieros",
        carreras: ["economia_finanzas"]
    },
    {
        nombre: "AUDITORÍA INFORMÁTICA",
        creditos: 3,
        requisitos: "Ingeniería de software I",
        carreras: ["software", "ti"]
    },
    {
        nombre: "AUTOMATIZACION Y CONTROL DE PROCESOS INDUSTRIALES",
        creditos: 3,
        requisitos: "Diseño de Planta",
        carreras: ["industrial"]
    },
    {
        nombre: "BEHAVIORAL DESIGN",
        creditos: 3,
        requisitos: "Estrategias de Segmentación y Posicionamiento",
        carreras: ["adm_marketing"]
    },
    {
        nombre: "CADENA DE SUMINISTRO SOSTENIBLE Y ECONOMÍA CIRCULAR",
        creditos: 3,
        requisitos: "Tecnologías en Ingeniería Ambiental",
        carreras: ["industrial"]
    },
    {
        nombre: "CANALES Y ESTRATEGIAS DE DISTRIBUCIÓN",
        creditos: 4,
        requisitos: "100 créditos aprobados",
        carreras: ["industrial"]
    },
    {
        nombre: "CERTIFICACIONES Y ESTÁNDARES DE SOSTENIBILIDAD CORPORATIVA",
        creditos: 3,
        requisitos: "80 créditos aprobados",
        carreras: ["adm_finanzas", "adm_marketing", "ambiental", "software", "industrial", "derecho", "derecho_corporativo"]
    },
    {
        nombre: "CLIMATE CHANGE",
        creditos: 3,
        requisitos: "100 créditos aprobados",
        carreras: ["adm_marketing", "ambiental"]
    },
    {
        nombre: "COACHING",
        creditos: 3,
        requisitos: "Gestión del Capital Humano",
        carreras: ["psicologia"]
    },
    {
        nombre: "COMERCIO INTERNACIONAL",
        creditos: 3,
        requisitos: "Fundamentos de los Negocios Internacionales",
        carreras: ["economia"]
    },
    {
        nombre: "CONDUCTA FINANCIERA (BEHAVIORAL FINANCE)",
        creditos: 3,
        requisitos: "Finanzas II",
        carreras: ["adm_finanzas", "economia_finanzas"]
    },
    {
        nombre: "CONTABILIDAD AVANZADA",
        creditos: 3,
        requisitos: "Contabilidad General",
        carreras: ["economia_finanzas"]
    },
    {
        nombre: "CREATIVIDAD PUBLICITARIA",
        creditos: 3,
        requisitos: "Percepción y comunicación",
        carreras: ["psicologia"]
    },
    {
        nombre: "CRECIMIENTO ENDÓGENO E INNOVACIÓN",
        creditos: 3,
        requisitos: "Crecimiento y Desarrollo Económico Sostenible",
        carreras: ["economia_finanzas", "economia"]
    },
    {
        nombre: "CULTURA Y CLIMA ORGANIZACIONAL",
        creditos: 3,
        requisitos: "Gestión y Análisis de Puestos",
        carreras: ["psicologia"]
    },
    {
        nombre: "CURSO DE EXTENSIÓN DE ECONOMÍA Y FINANZAS",
        creditos: 3,
        requisitos: "Macroeconomía II, Microeconomía II",
        carreras: ["economia_finanzas", "economia"]
    },
    {
        nombre: "DERECHO ADUANERO",
        creditos: 3,
        requisitos: "Comercio Internacional",
        carreras: ["economia", "derecho_corporativo"]
    },
    {
        nombre: "DERECHO AMBIENTAL",
        creditos: 3,
        requisitos: "No tiene",
        carreras: ["ambiental"]
    },
    {
        nombre: "DERECHO EMPRESARIAL",
        creditos: 3,
        requisitos: "60 créditos aprobados",
        carreras: ["economia_finanzas", "industrial"]
    },
    {
        nombre: "DERECHO FINANCIERO Y BANCARIO",
        creditos: 3,
        requisitos: "Fundamentos de Banca y Bolsa de Valores",
        carreras: ["economia_finanzas"]
    },
    {
        nombre: "DERECHO INTERNACIONAL PRIVADO",
        creditos: 3,
        requisitos: "Comercio Internacional",
        carreras: ["economia"]
    },
    {
        nombre: "DERECHO INTERNACIONAL PÚBLICO",
        creditos: 3,
        requisitos: "Estrategias de Integración Comercial",
        carreras: ["economia", "ambiental"]
    },
    {
        nombre: "DIAGNOSTICO E INTERVENCIÓN EN EL CONTEXTO EDUCATIVO",
        creditos: 3,
        requisitos: "Psicología Educativa , Procesos Psicopatológicos",
        carreras: ["psicologia"]
    },
    {
        nombre: "DISEÑO DE PLANTA",
        creditos: 3,
        requisitos: "80 créditos aprobados",
        carreras: ["industrial"]
    },
    {
        nombre: "ECONOMÍA FINANCIERA",
        creditos: 3,
        requisitos: "Microeconomía II",
        carreras: ["economia_finanzas", "economia"]
    },
    {
        nombre: "ECONOMÍA PERUANA EN LA ERA MODERNA",
        creditos: 3,
        requisitos: "Procesos Económicos del Perú y América Latina",
        carreras: ["economia"]
    },
    {
        nombre: "EMPRENDIMIENTOS DE MODELO DE NEGOCIO A EMPRESA",
        creditos: 3,
        requisitos: "40 créditos aprobados",
        carreras: ["administracion", "adm_finanzas", "adm_marketing", "adm_negocios", "contabilidad", "economia", "ambiental", "software", "ciencia_datos", "ia", "industrial", "derecho", "derecho_corporativo", "psicologia"]
    },
    {
        nombre: "EMPRENDIMIENTOS FAMILIARES INNOVADORES",
        creditos: 3,
        requisitos: "Procesos de Fabricación / Arquitectura del Computador I",
        carreras: ["administracion", "adm_finanzas", "adm_marketing", "adm_negocios", "contabilidad", "economia", "ambiental", "software", "ti", "ciencia_datos", "ia", "industrial", "derecho", "derecho_corporativo", "psicologia"]
    },
    {
        nombre: "ENDOMARKETING",
        creditos: 3,
        requisitos: "Comportamiento Humano en las Organizaciones, Gestión de Capital Humano",
        carreras: ["psicologia"]
    },
    {
        nombre: "ESCRITURA Y NARRATIVA ESTRATEGICA PARA LA COMUNICACION",
        creditos: 3,
        requisitos: "Semiótica",
        carreras: ["comunicacion_mkt"]
    },
    {
        nombre: "ESTRATEGÍA DE GESTIÓN DEL POTENCIAL HUMANO",
        creditos: 3,
        requisitos: "Gestión y Análisis de Puesto",
        carreras: ["psicologia"]
    },
    {
        nombre: "ESTRATEGIAS DE ENTRADA A MERCADOS INTERNACIONALES",
        creditos: 3,
        requisitos: "Fundamentos de Marketing / Fundamentos de Negocios Internacionales",
        carreras: ["adm_negocios", "contabilidad"]
    },
    {
        nombre: "ESTRATEGIAS DE INTEGRACIÓN COMERCIAL",
        creditos: 3,
        requisitos: "Comercio Internacional",
        carreras: ["economia"]
    },
    {
        nombre: "ESTRATEGIAS DE MARKETING DIGITAL. E-BRANDING",
        creditos: 3,
        requisitos: "160 créditos aprobados",
        carreras: ["adm_marketing"]
    },
    {
        nombre: "ESTRATEGIAS DE SEGMENTACIÓN Y POSICIONAMIENTO",
        creditos: 4,
        requisitos: "80 créditos aprobados",
        carreras: ["psicologia"]
    },

    // PÁGINA 2
    {
        nombre: "ESTRATEGIAS DE TRANSPORTE Y DISTRIBUCIÓN",
        creditos: 3,
        requisitos: "Gestión de Logística y Operaciones",
        carreras: ["adm_negocios"]
    },
    {
        nombre: "EVALUACIÓN DE CONFLICTOS Y DESARROLLO DE EQUIPOS",
        creditos: 3,
        requisitos: "Gestión y Análisis de Puestos",
        carreras: ["psicologia"]
    },
    {
        nombre: "EVALUACIÓN DEL DESEMPEÑO",
        creditos: 3,
        requisitos: "Gestión y Análisis de Puesto",
        carreras: ["psicologia"]
    },
    {
        nombre: "EVALUACIÓN DEL IMPACTO AMBIENTAL",
        creditos: 3,
        requisitos: "100 créditos aprobados",
        carreras: ["adm_marketing"]
    },
    {
        nombre: "EVALUACIÓN Y GESTIÓN DEL DESEMPEÑO",
        creditos: 3,
        requisitos: "Gestión y Análisis de Puestos",
        carreras: ["psicologia"]
    },
    {
        nombre: "FINANCIAL MARKETS",
        creditos: 3,
        requisitos: "Instrumentos Financieros",
        carreras: ["economia_finanzas"]
    },
    {
        nombre: "FINANZAS CUANTITATIVAS CON PYTHON",
        creditos: 3,
        requisitos: "Finanzas II",
        carreras: [
            "administracion", "adm_finanzas", "adm_marketing", "adm_negocios",
            "contabilidad", "economia_finanzas", "economia", "ambiental",
            "software", "ciencia_datos", "ia", "industrial"
        ]
    },
    {
        nombre: "FINANZAS III",
        creditos: 3,
        requisitos: "Finanzas II",
        carreras: ["economia_finanzas"]
    },
    {
        nombre: "FINANZAS PERSONALES",
        creditos: 3,
        requisitos: "Finanzas II",
        carreras: ["administracion", "adm_finanzas", "adm_marketing", "contabilidad", "economia_finanzas", "economia"]
    },
    {
        nombre: "FINANZAS SOSTENIBLES",
        creditos: 3,
        requisitos: "Instrumentos Financieros",
        carreras: ["economia_finanzas"]
    },
    {
        nombre: "FUNDAMENTOS DE DIPLOMACIA Y RELACIONES INTERNACIONALES",
        creditos: 3,
        requisitos: "Estrategias de Integración Comercial",
        carreras: ["adm_negocios", "economia"]
    },
    {
        nombre: "FUNDAMENTOS DE LOS NEGOCIOS INTERNACIONALES",
        creditos: 3,
        requisitos: "Administración General",
        carreras: ["adm_marketing"]
    },
    {
        nombre: "FUNDAMENTOS DE MARKETING",
        creditos: 3,
        requisitos: "Administración General",
        carreras: ["economia"]
    },
    {
        nombre: "FUNDAMENTOS DE PROGRAMACIÓN",
        creditos: 3,
        requisitos: "No tiene",
        carreras: ["economia_finanzas", "economia"]
    },
    {
        nombre: "FUNDAMENTOS PARA LA INTERVENCIÓN COGNITIVO CONDUCTUAL Y CONTEXTUAL",
        creditos: 3,
        requisitos: "Psicología cognitiva y del aprendizaje",
        carreras: ["psicologia"]
    },
    {
        nombre: "GEOGRAPHIC INFORMATION SYSTEM",
        creditos: 3,
        requisitos: "No tiene",
        carreras: ["economia_finanzas"]
    },
    {
        nombre: "GESTIÓN ADUANERA",
        creditos: 3,
        requisitos: "Comercio Internacional",
        carreras: ["adm_negocios", "economia"]
    },
    {
        nombre: "GESTION DE ALMACENES",
        creditos: 3,
        requisitos: "140 créditos aprobados",
        carreras: ["industrial"]
    },
    {
        nombre: "GESTIÓN DE DESASTRES Y CAMBIO CLIMÁTICO",
        creditos: 3,
        requisitos: "80 créditos",
        carreras: [
            "administracion", "adm_finanzas", "adm_marketing", "comunicacion_mkt",
            "contabilidad", "economia", "ambiental", "software", "ciencia_datos", "ia", "industrial", "derecho"
        ]
    },
    {
        nombre: "GESTION DE LA POLITICA COMERCIAL Y ACCESO A MERCADOS",
        creditos: 3,
        requisitos: "Estrategias de Integración Comercial",
        carreras: ["economia"]
    },
    {
        nombre: "GESTIÓN DE LOGISTICA Y OPERACIONES",
        creditos: 3,
        requisitos: "Comercio Internacional",
        carreras: ["adm_negocios"]
    },
    {
        nombre: "GESTIÓN DE RESIDUOS SÓLIDOS",
        creditos: 3,
        requisitos: "110 créditos aprobados",
        carreras: ["industrial"]
    },
    {
        nombre: "GESTION DEL COMERCIO INTERNACIONAL",
        creditos: 3,
        requisitos: "Comercio Internacional",
        carreras: ["economia"]
    },
    {
        nombre: "GESTIÓN DEL POTENCIAL HUMANO",
        creditos: 3,
        requisitos: "Gestión y Análisis de Puestos",
        carreras: ["psicologia"]
    },
    {
        nombre: "GESTIÓN Y ANÁLISIS DE PUESTOS",
        creditos: 3,
        requisitos: "Comportamiento Humano en las Organizaciones, Gestión de Capital Humano",
        carreras: ["psicologia"]
    },
    {
        nombre: "GLOBAL ENVIRONMENT",
        creditos: 3,
        requisitos: "Intermediate English II",
        carreras: ["administracion", "adm_finanzas", "adm_marketing", "adm_negocios", "comunicacion_mkt", "economia", "derecho", "derecho_corporativo"]
    },
    {
        nombre: "GLOBAL SUPPLY CHAIN MANAGEMENT",
        creditos: 3,
        requisitos: "Comercio Internacional",
        carreras: ["economia", "ambiental"]
    },
    {
        nombre: "IA GENERATIVA PARA LA TOMA DE DECISIONES",
        creditos: 3,
        requisitos: "Estadística Inferencial",
        carreras: ["adm_marketing", "comunicacion_mkt", "psicologia"]
    },
    {
        nombre: "IMPRESION 3D APLICADA AL DISEÑO Y LA PRODUCCIÓN",
        creditos: 3,
        requisitos: "No tiene",
        carreras: ["industrial"]
    },
    {
        nombre: "INBOUND MARKETING",
        creditos: 3,
        requisitos: "150 créditos aprobados",
        carreras: ["adm_marketing", "comunicacion_mkt"]
    },
    {
        nombre: "INGLES JURÍDICO",
        creditos: 3,
        requisitos: "120 créditos",
        carreras: ["derecho", "derecho_corporativo"]
    },
    {
        nombre: "INSTRUMENTOS FINANCIEROS",
        creditos: 4,
        requisitos: "Fundamentos de Banca y Bolsa de Valores",
        carreras: ["economia_finanzas"]
    },
    {
        nombre: "INTERCULTURAL MANAGEMENT FOR INTERNATIONAL BUSINESS",
        creditos: 3,
        requisitos: "Intermediate English II",
        carreras: ["adm_finanzas", "adm_marketing", "comunicacion_mkt", "economia", "derecho", "derecho_corporativo", "psicologia"]
    },
    {
        nombre: "INTERNATIONAL EMARKETING AND COMMERCE",
        creditos: 3,
        requisitos: "Marketing Estrategico Internacional",
        carreras: ["adm_negocios"]
    },
    {
        nombre: "INTERVENCIÓN Y ACOMPAÑAMIENTO EN CONTEXTOS EDUCATIVOS",
        creditos: 3,
        requisitos: "Psicología Educativa",
        carreras: ["psicologia"]
    },
    {
        nombre: "INTRODUCCIÓN AL CÁLCULO ESTOCÁSTICO PARA FINANZAS",
        creditos: 3,
        requisitos: "Estadística y Probabilidades",
        carreras: [
            "administracion", "adm_finanzas", "adm_marketing", "contabilidad",
            "economia_finanzas", "economia", "ambiental", "software",
            "ciencia_datos", "ia", "industrial"
        ]
    },
    {
        nombre: "INVESTIGACIÓN DE CONSUMER INSIGHTS",
        creditos: 3,
        requisitos: "Investigación cualitativa",
        carreras: ["adm_marketing", "comunicacion_mkt", "psicologia"]
    },
    {
        nombre: "INVESTIGACIÓN DE MERCADOS INTERNACIONALES",
        creditos: 3,
        requisitos: "Estadística Inferencial para Economistas / Estadística Inferencial",
        carreras: ["adm_negocios", "economia"]
    },
    {
        nombre: "INVESTMENT ANALYSIS",
        creditos: 3,
        requisitos: "Instrumentos Financieros",
        carreras: ["economia_finanzas"]
    },

    // PÁGINA 3
    {
        nombre: "LENGUAJE GRÁFICO Y AUDIOVISUAL",
        creditos: 3,
        requisitos: "Semiótica",
        carreras: ["comunicacion_mkt"]
    },
    {
        nombre: "MACHINE LEARNING APLICADO A LA BANCA",
        creditos: 3,
        requisitos: "Analisis Multivariado II",
        carreras: ["ti"]
    },
    {
        nombre: "MACHINE LEARNING Y PYTHON PARA NEGOCIOS",
        creditos: 3,
        requisitos: "Estadística y Probabilidades",
        carreras: ["administracion", "adm_finanzas", "adm_marketing", "contabilidad", "economia_finanzas", "economia"]
    },
    {
        nombre: "MACROECONOMETRÍA",
        creditos: 3,
        requisitos: "Métodos Económétricos",
        carreras: ["economia_finanzas", "economia"]
    },
    {
        nombre: "MARKETING DIGITAL Y COMERCIO ELECTRÓNICO",
        creditos: 3,
        requisitos: "160 créditos aprobados",
        carreras: ["adm_marketing"]
    },
    {
        nombre: "MARKETING ESTRATEGICO INTERNACIONAL",
        creditos: 3,
        requisitos: "Fundamentos de Marketing / Fundamentos de Negocios Interncionales",
        carreras: ["adm_negocios"]
    },
    {
        nombre: "MARKETING EXPERIENCIAL",
        creditos: 3,
        requisitos: "140 créditos aprobados",
        carreras: ["adm_marketing"]
    },
    {
        nombre: "MARKETING INDUSTRIAL Y SECTORIAL",
        creditos: 3,
        requisitos: "120 créditos apobados",
        carreras: ["adm_marketing"]
    },
    {
        nombre: "MARKETING PARA INGENIERIA",
        creditos: 3,
        requisitos: "100 créditos aprobados",
        carreras: ["industrial"]
    },
    {
        nombre: "MARKETING POLÍTICO",
        creditos: 3,
        requisitos: "100 créditos aprobados",
        carreras: ["adm_marketing", "psicologia"]
    },
    {
        nombre: "MARKETING TURÍSTICO",
        creditos: 3,
        requisitos: "Organización Industrial",
        carreras: ["adm_marketing", "economia"]
    },
    {
        nombre: "MERGERS & ACQUISITIONS: FINANCIAL & PROCESS PERSPECTIVE",
        creditos: 3,
        requisitos: "100 créditos aprobados",
        carreras: ["adm_finanzas", "economia_finanzas"]
    },
    {
        nombre: "NEUROMARKETING",
        creditos: 3,
        requisitos: "Comportamiento del Consumidor",
        carreras: ["adm_marketing", "psicologia"]
    },
    {
        nombre: "OPERATIVIDAD ADUANERA",
        creditos: 3,
        requisitos: "Gestión de Logística y Operaciones",
        carreras: ["adm_negocios"]
    },
    {
        nombre: "ORATORIA ACADÉMICA",
        creditos: 3,
        requisitos: "No tiene",
        carreras: ["administracion", "adm_finanzas", "adm_marketing", "contabilidad", "ambiental", "software", "ciencia_datos", "ia", "industrial", "derecho", "derecho_corporativo", "psicologia"]
    },
    {
        nombre: "PLANEAMIENTO ESTRATÉGICO",
        creditos: 3,
        requisitos: "110 créditos aprobados",
        carreras: ["administracion", "adm_finanzas", "adm_marketing", "contabilidad", "economia_finanzas", "economia"]
    },
    {
        nombre: "POLITICS AND INTERNATIONAL RELATIONS",
        creditos: 3,
        requisitos: "Estratégias de Integración Comercial",
        carreras: ["adm_negocios", "economia", "software"]
    },
    {
        nombre: "PROGRAMACIÓN PARA REALIDAD AUMENTADA",
        creditos: 3,
        requisitos: "Fundamentos de programación",
        carreras: ["software", "ti", "industrial"]
    },
    {
        nombre: "PROGRAMAS DE PROMOCIÓN Y PREVENCIÓN PARA EL BIENESTAR HUMANO",
        creditos: 3,
        requisitos: "Disfunciones del comportamiento individual , 130 créditos",
        carreras: ["psicologia"]
    },
    {
        nombre: "PSICODINAMICA DE LAS ORGANIZACIONES",
        creditos: 3,
        requisitos: "Teorías Psicodinámicas",
        carreras: ["psicologia"]
    },
    {
        nombre: "PUBLIC RELATION AND ORGANIZATIONAL COMMUNICATION",
        creditos: 3,
        requisitos: "Comunicaciones de Marketing",
        carreras: ["comunicacion_mkt"]
    },
    {
        nombre: "PUBLICIDAD, FERIAS Y MISIONES COMERCIALES",
        creditos: 3,
        requisitos: "Global Marketing",
        carreras: ["adm_marketing"]
    },
    {
        nombre: "QUÍMICA AMBIENTAL",
        creditos: 4,
        requisitos: "Química II",
        carreras: ["industrial"]
    },
    {
        nombre: "RECLUTAMIENTO Y SELECCIÓN",
        creditos: 3,
        requisitos: "Gestión y Análisis de Puestos",
        carreras: ["psicologia"]
    },
    {
        nombre: "REDACCIÓN ACADÉMICA",
        creditos: 3,
        requisitos: "No tiene",
        carreras: ["administracion", "adm_finanzas", "adm_marketing", "contabilidad", "ambiental", "software", "ciencia_datos", "ia", "industrial", "derecho", "derecho_corporativo", "psicologia"]
    },
    {
        nombre: "RIESGO DE CRÉDITO Y RIESGO OPERACIONAL",
        creditos: 3,
        requisitos: "Finanzas III, Fundamentos de Banca y Bolsa de Valores",
        carreras: ["adm_finanzas", "economia_finanzas"]
    },
    {
        nombre: "RIESGO DE MERCADO Y BASILEA",
        creditos: 3,
        requisitos: "Finanzas III, Fundamentos de Banca y Bolsa de Valores",
        carreras: ["adm_finanzas", "economia_finanzas"]
    },
    {
        nombre: "SALUD MENTAL COMUNITARIA, CONSEJERÍA E INTERVENCIÓN PSICOLÓGICA",
        creditos: 3,
        requisitos: "140 créditos aprobados",
        carreras: ["psicologia"]
    },
    {
        nombre: "SEGURIDAD INDUSTRIAL Y PREVENCION DE RIESGOS",
        creditos: 3,
        requisitos: "140 créditos aprobados",
        carreras: ["industrial"]
    },
    {
        nombre: "SHOPPER MARKETING",
        creditos: 3,
        requisitos: "Comportamiento del Consumidor",
        carreras: ["adm_marketing"]
    },
    {
        nombre: "SISTEMAS DE GESTIÓN INTEGRAL DE RIESGOS APLICADOS: ISO 31000",
        creditos: 3,
        requisitos: "120 créditos aprobados",
        carreras: ["industrial"]
    },
    {
        nombre: "SISTEMAS DE INFORMACIÓN",
        creditos: 3,
        requisitos: "120 creditos",
        carreras: ["psicologia"]
    },
    {
        nombre: "SOCIAL MEDIA MARKETING",
        creditos: 3,
        requisitos: "140 créditos aprobados",
        carreras: ["adm_marketing", "comunicacion_mkt"]
    },
    {
        nombre: "SUSTAINABLE MARKETING STRATEGIES",
        creditos: 3,
        requisitos: "100 Créditos aprobados",
        carreras: ["adm_marketing"]
    },
    {
        nombre: "TALLER DE DISEÑO GRAFICO I",
        creditos: 3,
        requisitos: "100 Créditos aprobados",
        carreras: ["adm_marketing"]
    },
    {
        nombre: "TALLER DE DISEÑO GRAFICO II",
        creditos: 3,
        requisitos: "Taller de Diseño Gráfico I",
        carreras: ["adm_marketing"]
    },
    {
        nombre: "TALLER DE FOTOGRAFÍA",
        creditos: 3,
        requisitos: "No tiene",
        carreras: ["psicologia"]
    },
    {
        nombre: "TEORÍA DE LAS RELACIONES INTERNACIONALES",
        creditos: 3,
        requisitos: "Estratégias de Integración Comercial",
        carreras: ["economia"]
    },
    {
        nombre: "VALORACIÓN DE ACTIVOS EN RENTA FIJA Y RENTA VARIABLE",
        creditos: 3,
        requisitos: "Instrumentos Financieros",
        carreras: ["adm_finanzas", "economia_finanzas"]
    },
    {
        nombre: "ETHICAL HACKING Y CIBERSEGURIDAD",
        creditos: 3,
        requisitos: "Redes de Comunicaciones",
        carreras: ["software", "ti"]
    },
    {
        nombre: "SOFTWARE FACTORY & GESTIÓN DE PROYECTOS ÁGILES",
        creditos: 3,
        requisitos: "Ingeniería de Software I",
        carreras: ["software", "ti"]
    }
];

/**
 * Obtiene la lista de electivos permitidos para una carrera en específico según su slug.
 */
export function obtenerElectivosPorCarrera(carreraSlug: string): CursoElectivo[] {
    if (!carreraSlug) return LISTA_ELECTIVOS;
    const slugNorm = carreraSlug.toLowerCase().trim();
    return LISTA_ELECTIVOS.filter(c => c.carreras.includes(slugNorm));
}

/**
 * Mapa de electivos organizados por slug de carrera
 */
export const ELECTIVOS_POR_CARRERA: Record<string, CursoElectivo[]> = {
    administracion: obtenerElectivosPorCarrera("administracion"),
    adm_finanzas: obtenerElectivosPorCarrera("adm_finanzas"),
    adm_marketing: obtenerElectivosPorCarrera("adm_marketing"),
    adm_negocios: obtenerElectivosPorCarrera("adm_negocios"),
    comunicacion_mkt: obtenerElectivosPorCarrera("comunicacion_mkt"),
    contabilidad: obtenerElectivosPorCarrera("contabilidad"),
    economia_finanzas: obtenerElectivosPorCarrera("economia_finanzas"),
    economia: obtenerElectivosPorCarrera("economia"),
    ambiental: obtenerElectivosPorCarrera("ambiental"),
    software: obtenerElectivosPorCarrera("software"),
    ti: obtenerElectivosPorCarrera("ti"),
    ciencia_datos: obtenerElectivosPorCarrera("ciencia_datos"),
    ia: obtenerElectivosPorCarrera("ia"),
    industrial: obtenerElectivosPorCarrera("industrial"),
    derecho: obtenerElectivosPorCarrera("derecho"),
    derecho_corporativo: obtenerElectivosPorCarrera("derecho_corporativo"),
    psicologia: obtenerElectivosPorCarrera("psicologia"),
};
