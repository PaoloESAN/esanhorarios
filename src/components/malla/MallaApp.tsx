"use client";

import React, { useState, useEffect, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { Checkbox } from "@heroui/react";
import { Carrera, RequisitoCurso } from "@/data";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Calendar,
} from "lucide-react";

interface MallaAppProps {
    carrera: Carrera;
}

export const normalizarTexto = (str: string): string => {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
};

export type EstadoCurso = "APROBADO" | "DISPONIBLE" | "BLOQUEADO";

export interface InfoCursoMalla {
    nombre: string;
    ciclo: string;
    creditos: number;
    requisitosInfo?: RequisitoCurso;
    estado: EstadoCurso;
    requisitosFaltantes: string[];
    creditosFaltantes: number;
}

const emptySubscribe = () => () => { };

export default function MallaApp({ carrera }: MallaAppProps) {
    const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
    const storageKey = `malla_aprobados_${carrera.slug}`;

    // Initial state read from localStorage
    const [aprobados, setAprobados] = useState<Set<string>>(() => {
        if (typeof window === "undefined") return new Set();
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    return new Set(parsed);
                }
            }
        } catch (e) {
            console.error("Error al cargar aprobados de localStorage:", e);
        }
        return new Set();
    });

    const [cursoHover, setCursoHover] = useState<string | null>(null);

    // Guardar en localStorage cuando aprobados cambie (solo tras estar montado)
    useEffect(() => {
        if (!isMounted) return;
        try {
            localStorage.setItem(storageKey, JSON.stringify(Array.from(aprobados)));
        } catch (e) {
            console.error("Error al guardar aprobados en localStorage:", e);
        }
    }, [aprobados, storageKey, isMounted]);

    // Set de aprobados seguro para la evaluación de la malla (evita descalce de hidratación)
    const aprobadosEfectivos = useMemo(() => {
        return isMounted ? aprobados : new Set<string>();
    }, [isMounted, aprobados]);

    // Generar mapa de normalización de todos los cursos de la carrera
    const { mapaCursos, listaCiclos, totalCreditosCarrera } = useMemo(() => {
        const mapa = new Map<string, { nombre: string; ciclo: string; creditos: number }>();
        const ciclos: string[] = Object.keys(carrera.cursos);
        let totalCreds = 0;

        for (const [ciclo, cursosObj] of Object.entries(carrera.cursos)) {
            for (const [nombreCurso, creditos] of Object.entries(cursosObj)) {
                totalCreds += creditos;
                mapa.set(normalizarTexto(nombreCurso), {
                    nombre: nombreCurso,
                    ciclo,
                    creditos,
                });
            }
        }

        return {
            mapaCursos: mapa,
            listaCiclos: ciclos,
            totalCreditosCarrera: totalCreds,
        };
    }, [carrera]);

    // Calcular créditos aprobados
    const totalCreditosAprobados = useMemo(() => {
        let suma = 0;
        for (const normNombre of aprobadosEfectivos) {
            const curso = mapaCursos.get(normNombre);
            if (curso) {
                suma += curso.creditos;
            }
        }
        return suma;
    }, [aprobadosEfectivos, mapaCursos]);

    // Evaluar el estado de cada curso (APROBADO, DISPONIBLE, BLOQUEADO)
    const datosMalla = useMemo(() => {
        const resultado: Record<string, InfoCursoMalla[]> = {};
        const prerreqMap = carrera.prerrequisitos || {};

        for (const [ciclo, cursosObj] of Object.entries(carrera.cursos)) {
            resultado[ciclo] = [];

            for (const [nombreCurso, creditos] of Object.entries(cursosObj)) {
                const normNombre = normalizarTexto(nombreCurso);
                const esAprobado = aprobadosEfectivos.has(normNombre);

                const reqInfo = prerreqMap[nombreCurso] || prerreqMap[Object.keys(prerreqMap).find(k => normalizarTexto(k) === normNombre) || ""];

                let estado: EstadoCurso = "DISPONIBLE";
                const requisitosFaltantes: string[] = [];
                let creditosFaltantes = 0;

                if (esAprobado) {
                    estado = "APROBADO";
                } else if (reqInfo) {
                    // Verificar créditos requeridos
                    if (reqInfo.creditosRequeridos && totalCreditosAprobados < reqInfo.creditosRequeridos) {
                        creditosFaltantes = reqInfo.creditosRequeridos - totalCreditosAprobados;
                    }

                    // Verificar prerrequisitos de asignaturas
                    if (reqInfo.prerequisitos && reqInfo.prerequisitos.length > 0) {
                        for (const pre of reqInfo.prerequisitos) {
                            const normPre = normalizarTexto(pre);
                            if (!aprobadosEfectivos.has(normPre)) {
                                requisitosFaltantes.push(pre);
                            }
                        }
                    }

                    if (requisitosFaltantes.length > 0 || creditosFaltantes > 0) {
                        estado = "BLOQUEADO";
                    }
                }

                resultado[ciclo].push({
                    nombre: nombreCurso,
                    ciclo,
                    creditos,
                    requisitosInfo: reqInfo,
                    estado,
                    requisitosFaltantes,
                    creditosFaltantes,
                });
            }
        }

        return resultado;
    }, [carrera, aprobadosEfectivos, totalCreditosAprobados]);

    // Relaciones de prerrequisitos para resaltado visual al hacer hover
    const relacionesDependencia = useMemo(() => {
        const esPrerrequisitoDe = new Map<string, Set<string>>();
        const dependeDe = new Map<string, Set<string>>();

        const prerreqMap = carrera.prerrequisitos || {};
        for (const [curso, info] of Object.entries(prerreqMap)) {
            const normCurso = normalizarTexto(curso);
            if (info.prerequisitos) {
                for (const pre of info.prerequisitos) {
                    const normPre = normalizarTexto(pre);
                    if (!esPrerrequisitoDe.has(normPre)) esPrerrequisitoDe.set(normPre, new Set());
                    esPrerrequisitoDe.get(normPre)!.add(normCurso);

                    if (!dependeDe.has(normCurso)) dependeDe.set(normCurso, new Set());
                    dependeDe.get(normCurso)!.add(normPre);
                }
            }
        }

        return { esPrerrequisitoDe, dependeDe };
    }, [carrera]);

    // Manejador para togglear estado de aprobación de un curso
    const toggleCurso = (nombreCurso: string, estadoActual: EstadoCurso) => {
        const normNombre = normalizarTexto(nombreCurso);
        const nuevosAprobados = new Set(aprobados);

        if (estadoActual === "APROBADO") {
            // Desaprobar curso y recursivamente desaprobar cursos dependientes
            const desaprobarRecursivo = (targetNorm: string) => {
                nuevosAprobados.delete(targetNorm);
                const dependientes = relacionesDependencia.esPrerrequisitoDe.get(targetNorm);
                if (dependientes) {
                    for (const depNorm of dependientes) {
                        if (nuevosAprobados.has(depNorm)) {
                            desaprobarRecursivo(depNorm);
                        }
                    }
                }
            };
            desaprobarRecursivo(normNombre);
        } else if (estadoActual === "DISPONIBLE") {
            nuevosAprobados.add(normNombre);
        }

        setAprobados(nuevosAprobados);
    };

    // Acciones globales
    const aprobarTodo = () => {
        const todosNorm = new Set<string>();
        for (const cursosObj of Object.values(carrera.cursos)) {
            for (const curso of Object.keys(cursosObj)) {
                todosNorm.add(normalizarTexto(curso));
            }
        }
        setAprobados(todosNorm);
    };

    const reiniciarProgreso = () => {
        setAprobados(new Set());
    };

    const toggleCiclo = (ciclo: string) => {
        const cursosCiclo = carrera.cursos[ciclo] || {};
        const nombresNorm = Object.keys(cursosCiclo).map(normalizarTexto);

        const todosAprobados = nombresNorm.length > 0 && nombresNorm.every(n => aprobados.has(n));
        const nuevos = new Set(aprobados);

        if (todosAprobados) {
            for (const normNombre of nombresNorm) {
                const desaprobarRecursivo = (targetNorm: string) => {
                    nuevos.delete(targetNorm);
                    const dependientes = relacionesDependencia.esPrerrequisitoDe.get(targetNorm);
                    if (dependientes) {
                        for (const depNorm of dependientes) {
                            if (nuevos.has(depNorm)) {
                                desaprobarRecursivo(depNorm);
                            }
                        }
                    }
                };
                desaprobarRecursivo(normNombre);
            }
        } else {
            for (const normNombre of nombresNorm) {
                nuevos.add(normNombre);
            }
        }

        setAprobados(nuevos);
    };

    // Estadísticas
    const totalCursos = useMemo(() => {
        return Object.values(carrera.cursos).reduce((acc, cObj) => acc + Object.keys(cObj).length, 0);
    }, [carrera]);

    const totalAprobados = aprobadosEfectivos.size;
    const porcentajeProgreso = Math.min(100, Math.round((totalCreditosAprobados / (totalCreditosCarrera || 1)) * 100));

    // Drag-to-scroll (panning suave a 60fps sin vibraciones)
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const isDraggingRef = React.useRef(false);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button !== 0) return; // Solo clic izquierdo
        const container = scrollContainerRef.current;
        if (!container) return;

        setIsMouseDown(true);
        isDraggingRef.current = false;

        const startX = e.clientX;
        const startY = e.clientY;
        const startScrollLeft = container.scrollLeft;
        const startScrollTop = window.scrollY;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;

            if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
                if (!isDraggingRef.current) {
                    isDraggingRef.current = true;
                    setIsDragging(true);
                }
            }

            if (isDraggingRef.current) {
                container.scrollLeft = startScrollLeft - deltaX;
                window.scrollTo({ top: startScrollTop - deltaY, behavior: "instant" });
            }
        };

        const onMouseUp = () => {
            setIsMouseDown(false);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            setTimeout(() => {
                isDraggingRef.current = false;
                setIsDragging(false);
            }, 80);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background p-2 md:p-4 text-foreground transition-colors">
            <div className="max-w-[1800px] mx-auto space-y-4 md:space-y-6">

                {/* AppHeader idéntico al de Horarios con Tarjetas de Progreso alineadas en la misma línea */}
                <div className="bg-surface rounded-lg shadow-md p-3 md:p-6 mb-3 md:mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full">
                        {/* Título e información */}
                        <div className="flex items-center gap-3 shrink-0">
                            <Link
                                href={`/${carrera.slug}`}
                                title="Volver a Horarios"
                                className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-md bg-surface-secondary hover:bg-overlay text-foreground transition-colors"
                            >
                                <ArrowLeft size={16} />
                            </Link>
                            <div>
                                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-1">
                                    Malla Curricular - {carrera.nombre}
                                </h1>
                                <p className="text-sm md:text-base text-muted">
                                    Plan de estudios interactivo con prerrequisitos y progreso en tiempo real.
                                </p>
                            </div>
                        </div>

                        {/* Tarjeta de estadísticas unificada a la derecha */}
                        <div className="bg-surface-secondary/70 px-4 py-3 sm:py-3.5 rounded-2xl border border-overlay/60 shadow-sm flex flex-col justify-center flex-1 w-full">
                            {/* Fila superior: Títulos y valores integrados */}
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <span className="text-muted text-[11px] font-bold tracking-wider uppercase">
                                        Progreso de Carrera
                                    </span>
                                    <span className="text-[11px] text-muted/70 font-medium" suppressHydrationWarning>
                                        ({totalAprobados} de {totalCursos} asignaturas)
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-2 sm:gap-3">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-sm sm:text-base font-black text-foreground" suppressHydrationWarning>
                                            {totalCreditosAprobados}
                                        </span>
                                        <span className="text-xs font-medium text-muted">
                                            / {totalCreditosCarrera} Créditos
                                        </span>
                                    </div>
                                    <span className="text-xs text-muted/40">•</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-sm sm:text-base font-black text-emerald-500" suppressHydrationWarning>
                                            {porcentajeProgreso}%
                                        </span>
                                        <span className="text-xs font-medium text-muted">
                                            completado
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Fila inferior: Barra de progreso verde unificada */}
                            <div className="mt-2 w-full bg-surface/80 rounded-full h-2 overflow-hidden border border-overlay/40">
                                <div
                                    className="bg-emerald-500 h-full transition-all duration-500"
                                    style={{ width: `${porcentajeProgreso}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vista Horizontal de los Ciclos (con arrastre / panning como en móvil) */}
                <div
                    ref={scrollContainerRef}
                    onMouseDown={handleMouseDown}
                    className={`w-full overflow-x-auto pb-6 pt-2 custom-scrollbar select-none ${
                        isMouseDown ? "cursor-grabbing" : "cursor-grab"
                    }`}
                >
                    <div className="flex flex-row gap-4 md:gap-6 min-w-max items-start">
                        {listaCiclos.map((ciclo) => {
                            const cursosCiclo = datosMalla[ciclo] || [];
                            const creditosCiclo = cursosCiclo.reduce((acc, c) => acc + c.creditos, 0);

                            const esCicloCompletoAprobado = cursosCiclo.length > 0 && cursosCiclo.every(c => c.estado === "APROBADO");
                            const algunoAprobadoEnCiclo = cursosCiclo.some(c => c.estado === "APROBADO");

                            return (
                                <div
                                    key={ciclo}
                                    className="w-72 sm:w-80 shrink-0 bg-surface rounded-2xl border border-overlay p-4 flex flex-col gap-3 shadow-md"
                                >
                                    {/* Header del Ciclo dentro de la tarjeta vertical (clicable para activar el checkbox) */}
                                    <div
                                        onClick={() => {
                                            if (!isDragging) {
                                                toggleCiclo(ciclo);
                                            }
                                        }}
                                        title={esCicloCompletoAprobado ? "Desmarcar todo el ciclo" : "Aprobar todo el ciclo"}
                                        className="flex items-center justify-between border-b border-overlay/60 pb-3 cursor-pointer select-none hover:opacity-90 transition-opacity"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-red-500 shrink-0" />
                                                <h2 className="text-base font-bold text-foreground">
                                                    {ciclo}
                                                </h2>
                                            </div>
                                            <span className="text-[11px] font-semibold text-muted">
                                                {creditosCiclo} Créditos
                                            </span>
                                        </div>
                                        <div className="shrink-0 pointer-events-none">
                                            <Checkbox
                                                isSelected={esCicloCompletoAprobado}
                                                isIndeterminate={algunoAprobadoEnCiclo && !esCicloCompletoAprobado}
                                                aria-label={`Aprobar todo el ${ciclo}`}
                                                variant="secondary"
                                            >
                                                <Checkbox.Content>
                                                    <Checkbox.Control className="size-6 rounded-full before:rounded-full">
                                                        <Checkbox.Indicator />
                                                    </Checkbox.Control>
                                                </Checkbox.Content>
                                            </Checkbox>
                                        </div>
                                    </div>

                                    {/* Cursos apilados en vertical dentro de la columna del ciclo */}
                                    <div className="flex flex-col gap-3">
                                        {cursosCiclo.map((curso) => {
                                            const normNombre = normalizarTexto(curso.nombre);
                                            const isHovered = cursoHover === normNombre;

                                            const esPrerrequisitoDelHover = cursoHover
                                                ? relacionesDependencia.dependeDe.get(cursoHover)?.has(normNombre)
                                                : false;
                                            const dependeDelHover = cursoHover
                                                ? relacionesDependencia.esPrerrequisitoDe.get(cursoHover)?.has(normNombre)
                                                : false;

                                            return (
                                                <CursoMallaCard
                                                    key={curso.nombre}
                                                    curso={curso}
                                                    onToggle={() => toggleCurso(curso.nombre, curso.estado)}
                                                    onMouseEnter={() => setCursoHover(normNombre)}
                                                    onMouseLeave={() => setCursoHover(null)}
                                                    isHovered={isHovered}
                                                    esPrerrequisitoDelHover={esPrerrequisitoDelHover || false}
                                                    dependeDelHover={dependeDelHover || false}
                                                    isDragging={isDragging}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}

interface CardProps {
    curso: InfoCursoMalla;
    onToggle: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    isHovered: boolean;
    esPrerrequisitoDelHover: boolean;
    dependeDelHover: boolean;
    isDragging: boolean;
}

function CursoMallaCard({
    curso,
    onToggle,
    onMouseEnter,
    onMouseLeave,
    isHovered,
    esPrerrequisitoDelHover,
    dependeDelHover,
    isDragging,
}: CardProps) {
    const isAprobado = curso.estado === "APROBADO";
    const isDisponible = curso.estado === "DISPONIBLE";
    const isBloqueado = curso.estado === "BLOQUEADO";

    let containerClass = "relative rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between border shadow-sm select-none ";

    if (esPrerrequisitoDelHover) {
        containerClass += "ring-2 ring-blue-500 border-blue-500 scale-[1.02] bg-blue-500/10 ";
    } else if (dependeDelHover) {
        containerClass += "ring-2 ring-purple-500 border-purple-500 scale-[1.02] bg-purple-500/10 ";
    } else if (isAprobado) {
        containerClass += "bg-emerald-500/10 border-emerald-500/40 hover:border-emerald-500/70 hover:scale-[1.01] ";
    } else if (isDisponible) {
        containerClass += "bg-blue-500/10 border-blue-500/30 hover:border-blue-500/70 hover:scale-[1.01] shadow-blue-500/5 ";
    } else {
        containerClass += "bg-surface-secondary/60 border-overlay/60 opacity-60 cursor-not-allowed hover:opacity-80 ";
    }

    return (
        <motion.div
            layout
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={() => {
                if (!isBloqueado && !isDragging) {
                    onToggle();
                }
            }}
            className={containerClass}
        >
            {/* Header del Card de curso */}
            <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                        className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${isAprobado
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                            : isDisponible
                                ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                : "bg-muted/20 text-muted"
                            }`}
                    >
                        {curso.creditos} Créditos
                    </span>
                </div>

                {/* Nombre del curso */}
                <h3
                    className={`font-bold text-sm sm:text-base leading-snug ${isAprobado
                        ? "text-emerald-950 dark:text-emerald-100"
                        : isDisponible
                            ? "text-foreground"
                            : "text-muted"
                        }`}
                >
                    {curso.nombre}
                </h3>
            </div>

            {/* Requisitos / Prerrequisitos */}
            <div className="mt-3 pt-2 border-t border-overlay/40 space-y-1">
                {isBloqueado ? (
                    <div className="text-[11px] text-red-500 dark:text-red-400 space-y-0.5 font-medium">
                        <span>Requisito no cumplido:</span>
                        {curso.creditosFaltantes > 0 && (
                            <p className="pl-3">• Falta {curso.creditosFaltantes} créditos</p>
                        )}
                        {curso.requisitosFaltantes.map((req) => (
                            <p key={req} className="pl-3 truncate" title={req}>• {req}</p>
                        ))}
                    </div>
                ) : curso.requisitosInfo?.prerequisitos && curso.requisitosInfo.prerequisitos.length > 0 ? (
                    <div className="text-[11px] text-muted truncate" title={curso.requisitosInfo.prerequisitos.join(", ")}>
                        <span className="font-semibold">Requisito:</span> {curso.requisitosInfo.prerequisitos.join(", ")}
                    </div>
                ) : curso.requisitosInfo?.creditosRequeridos ? (
                    <div className="text-[11px] text-muted">
                        <span className="font-semibold">Requisito:</span> {curso.requisitosInfo.creditosRequeridos} créditos
                    </div>
                ) : (
                    <div className="text-[11px] text-muted/70 italic">
                        Sin prerrequisitos
                    </div>
                )}
            </div>

            {/* Highlight tags al hoverear */}
            {esPrerrequisitoDelHover && (
                <div className="absolute -top-2.5 right-3 bg-blue-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow">
                    PRERREQUISITO
                </div>
            )}
            {dependeDelHover && (
                <div className="absolute -top-2.5 right-3 bg-purple-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow">
                    DESBLOQUEA ESTE
                </div>
            )}
        </motion.div>
    );
}
