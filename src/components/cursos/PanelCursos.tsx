import { useRef, useEffect, useMemo, useState, ChangeEvent, DragEvent } from 'react';
import Link from 'next/link';
import { Button, Select, Label, ListBox, Chip, ScrollShadow, Tooltip } from '@heroui/react';
import { useCarrera } from '@/app/[slug]/CarreraContext';
import { Plus, BadgeCheck, CloudUpload, FileText, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import TarjetaSeccion from './TarjetaSeccion';
import PantallaSubirExcel from '@/components/excel/PantallaSubirExcel';
import { CursoItem } from '@/hooks/useCursos';

export interface PanelCursosProps {
    cicloSeleccionado: string;
    setCicloSeleccionado: (ciclo: string) => void;
    cursosSeleccionados: Set<string>;
    nombreArchivo: string;
    cargandoArchivo: boolean;
    obtenerHorariosPorCurso: (curso: string) => any[];
    onAgregarCurso: (item: CursoItem) => void;
    onRemoverCurso: (id: string) => void;
    onDragStart: (e: DragEvent<HTMLElement>, item: any) => void;
    onAbrirModalCursoPersonalizado: () => void;
    onCargaArchivo: (evento: ChangeEvent<HTMLInputElement>) => void;
    onCargaTalleres: (evento: ChangeEvent<HTMLInputElement>) => void;
    onCargaElectivos?: (evento: ChangeEvent<HTMLInputElement>) => void;
    onCargaArchivosDirectos?: (archivos: File[]) => void;
    cargandoTalleres: boolean;
    cargandoElectivos?: boolean;
    nombreArchivoTalleres: string;
    nombreArchivoElectivos?: string;
}

function PanelCursos({
    cicloSeleccionado, setCicloSeleccionado,
    cursosSeleccionados,
    nombreArchivo, cargandoArchivo,
    obtenerHorariosPorCurso,
    onAgregarCurso,
    onRemoverCurso,
    onDragStart,
    onAbrirModalCursoPersonalizado,
    onCargaArchivo,
    onCargaTalleres,
    onCargaElectivos,
    onCargaArchivosDirectos,
    cargandoTalleres,
    cargandoElectivos = false,
    nombreArchivoTalleres,
    nombreArchivoElectivos = '',
}: PanelCursosProps) {
    const { slug, cursosPorCiclo, obtenerCreditos, esCursoBloqueado, esCursoAprobado, obtenerRequisitosFaltantes } = useCarrera();
    const hayArchivo = Boolean(nombreArchivo);
    const listaRef = useRef<HTMLDivElement>(null);
    const talleresInputRef = useRef<HTMLInputElement>(null);
    const electivosInputRef = useRef<HTMLInputElement>(null);
    const [tooltipAbierto, setTooltipAbierto] = useState<string | null>(null);
    const [cursosExpandidos, setCursosExpandidos] = useState<Record<string, boolean>>({});

    // Obtener ciclos que tienen al menos un curso pendiente (no aprobado)
    const ciclosVisibles = useMemo(() => {
        return Object.keys(cursosPorCiclo).filter((ciclo) => {
            const cursosDelCiclo = cursosPorCiclo[ciclo] || [];
            return cursosDelCiclo.some((curso) => !esCursoAprobado(curso));
        });
    }, [cursosPorCiclo, esCursoAprobado]);

    // Si el ciclo actualmente seleccionado ya no está visible (todos aprobados), cambiar al primer ciclo disponible
    useEffect(() => {
        if (ciclosVisibles.length > 0 && !ciclosVisibles.includes(cicloSeleccionado)) {
            setCicloSeleccionado(ciclosVisibles[0]);
        }
    }, [ciclosVisibles, cicloSeleccionado, setCicloSeleccionado]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTooltipAbierto(null);
        listaRef.current?.scrollTo({ top: 0 });
    }, [cicloSeleccionado]);

    const esTaller = (nombre: string) => nombre.toLowerCase().includes('taller');

    const hayAlgunTallerEnExcel = hayArchivo && Object.values(cursosPorCiclo).some(cursos =>
        cursos.some(c => esTaller(c) && obtenerHorariosPorCurso(c).length > 0)
    );

    const handleOpenTalleresPicker = () => {
        if (!talleresInputRef.current || cargandoTalleres) return;
        talleresInputRef.current.value = '';
        talleresInputRef.current.click();
    };

    const handleOpenElectivosPicker = () => {
        if (!electivosInputRef.current || cargandoElectivos) return;
        electivosInputRef.current.value = '';
        electivosInputRef.current.click();
    };

    return (
        <>
            {hayArchivo ? (
                <div className="bg-surface rounded-2xl shadow-md p-3 md:p-6 flex flex-col max-h-[70vh] lg:max-h-none h-full overflow-hidden">
                    {/* Cabecera del panel */}
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                        <h2 className="text-lg md:text-xl font-semibold text-foreground">Cursos Disponibles</h2>
                        <Button
                            onPress={onAbrirModalCursoPersonalizado}
                            variant="secondary"
                            size="sm"
                            isIconOnly
                            {...{ title: "Agregar curso personalizado" } as any}
                        >
                            <Plus />
                        </Button>
                    </div>

                    {/* Selector de ciclo */}
                    <div className="mb-4 md:mb-6">
                        <Select
                            value={cicloSeleccionado}
                            onChange={(value: any) => {
                                if (value && value !== cicloSeleccionado) setCicloSeleccionado(value);
                            }}
                            placeholder="Selecciona un ciclo"
                            className="w-full"
                        >
                            <Label>Seleccionar Ciclo</Label>
                            <Select.Trigger className="border border-divider bg-surface-secondary">
                                <Select.Value />
                                <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover>
                                <ListBox>
                                    {ciclosVisibles.map((ciclo) => (
                                        <ListBox.Item key={ciclo} id={ciclo} textValue={ciclo}>
                                            {ciclo}
                                            <ListBox.ItemIndicator />
                                        </ListBox.Item>
                                    ))}
                                </ListBox>
                            </Select.Popover>
                        </Select>
                    </div>

                    {/* Lista de cursos */}
                    <ScrollShadow
                        ref={listaRef}
                        onScroll={() => {
                            if (tooltipAbierto) setTooltipAbierto(null);
                        }}
                        className="space-y-3 flex-1 min-h-0"
                    >
                        {(cursosPorCiclo[cicloSeleccionado] ?? [])
                            .filter((curso) => !esCursoAprobado(curso))
                            .slice()
                            .sort((a, b) => {
                                const aElec = a.toLowerCase().includes('electivo');
                                const bElec = b.toLowerCase().includes('electivo');
                                if (aElec && !bElec) return 1;
                                if (!aElec && bElec) return -1;
                                return 0;
                            })
                            .map((curso, idx) => {
                            const secciones = obtenerHorariosPorCurso(curso);
                            const creditos = obtenerCreditos(curso);
                            const esElectivo = curso.toLowerCase().includes('electivo');
                            const cursoEsTaller = esTaller(curso);
                            const esBloqueado = esCursoBloqueado(curso);
                            const { requisitosFaltantes, creditosFaltantes } = esBloqueado
                                ? obtenerRequisitosFaltantes(curso)
                                : { requisitosFaltantes: [], creditosFaltantes: 0 };

                            const cabeceraCurso = (
                                <h4 className={`font-semibold text-foreground text-xs md:text-sm mb-2 md:mb-3 border-b border-divider pb-2 ${esBloqueado ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}>
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="flex-1 text-left">{curso}</span>
                                        <div className="flex items-center gap-2">
                                            <Chip
                                                color={esBloqueado ? 'danger' : 'accent'}
                                                variant='tertiary'
                                                size='sm'
                                            >
                                                <div className="flex items-center gap-1">
                                                    <BadgeCheck className={`w-3 h-3 ${esBloqueado ? 'text-danger' : 'text-accent'}`} />
                                                    {creditos}
                                                </div>
                                            </Chip>
                                        </div>
                                    </div>
                                </h4>
                            );

                            return (
                                <div key={idx} className="border border-divider rounded-lg p-2 md:p-3 bg-surface-secondary">
                                    {/* Cabecera del curso */}
                                    {esBloqueado ? (
                                        <Tooltip
                                            delay={0}
                                            closeDelay={0}
                                            isOpen={tooltipAbierto === curso}
                                            onOpenChange={(open) => setTooltipAbierto(open ? curso : null)}
                                        >
                                            <Tooltip.Trigger
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setTooltipAbierto((prev) => (prev === curso ? null : curso));
                                                }}
                                                className="w-full text-left bg-transparent p-0 border-0 cursor-pointer"
                                            >
                                                {cabeceraCurso}
                                            </Tooltip.Trigger>
                                            <Tooltip.Content placement="top" className="max-w-64 p-3">
                                                <Tooltip.Arrow />
                                                <div className="text-xs space-y-1">
                                                    <div className="font-bold text-danger">
                                                        Requisitos no cumplidos
                                                    </div>
                                                    {creditosFaltantes > 0 && (
                                                        <p className="text-danger font-semibold">• Faltan {creditosFaltantes} créditos</p>
                                                    )}
                                                    {requisitosFaltantes.map((req) => (
                                                        <p key={req} className="flex items-start gap-1 text-foreground">
                                                            <span className="text-danger font-bold shrink-0">•</span>
                                                            <span>{req}</span>
                                                        </p>
                                                    ))}
                                                    {creditosFaltantes === 0 && requisitosFaltantes.length === 0 && (
                                                        <p className="italic text-muted">Requisitos del curso pendientes</p>
                                                    )}
                                                </div>
                                            </Tooltip.Content>
                                        </Tooltip>
                                    ) : (
                                        cabeceraCurso
                                    )}

                                    {curso.toLowerCase().includes('internacional') ? (
                                        <div className="p-3 bg-accent-soft/40 border border-accent/30 rounded-xl flex flex-col items-start gap-2 text-left">
                                            <span className="text-xs font-medium text-foreground-700">
                                                Los electivos internacionales cuentan con su propio creador especial de horarios.
                                            </span>
                                            <Link
                                                href={`/internacional?from=${slug}`}
                                                target="_blank"
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-accent hover:bg-accent-hover px-3.5 py-2 rounded-xl transition-all shadow-md cursor-pointer"
                                            >
                                                <span>Crear horario internacional</span>
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    ) : (
                                        /* Secciones de cursos normales */
                                        secciones.length > 0 ? (
                                            <div className="space-y-2">
                                                {(() => {
                                                    const estaExpandido = Boolean(cursosExpandidos[curso]);
                                                    const seccionesAMostrar = estaExpandido ? secciones : secciones.slice(0, 3);
                                                    return (
                                                        <>
                                                            {seccionesAMostrar.map((seccionData, si) => {
                                                                const nombreParaRequisito = seccionData.nombreCursoElectivo || curso;
                                                                const esBloqueadoSeccion = esCursoBloqueado(nombreParaRequisito);
                                                                const { requisitosFaltantes, creditosFaltantes } = esBloqueadoSeccion
                                                                    ? obtenerRequisitosFaltantes(nombreParaRequisito)
                                                                    : { requisitosFaltantes: [], creditosFaltantes: 0 };

                                                                return (
                                                                    <TarjetaSeccion
                                                                        key={`${idx}-${si}`}
                                                                        curso={curso}
                                                                        seccionData={seccionData}
                                                                        estaSeleccionado={cursosSeleccionados.has(seccionData.id)}
                                                                        esBloqueado={esBloqueadoSeccion}
                                                                        requisitosFaltantes={requisitosFaltantes}
                                                                        creditosFaltantes={creditosFaltantes}
                                                                        onAgregar={onAgregarCurso}
                                                                        onRemover={onRemoverCurso}
                                                                        onDragStart={onDragStart}
                                                                    />
                                                                );
                                                            })}

                                                            {secciones.length > 3 && (
                                                                <button
                                                                    onClick={() => setCursosExpandidos(prev => ({ ...prev, [curso]: !prev[curso] }))}
                                                                    className="w-full py-1.5 px-3 mt-1 text-xs font-semibold text-accent hover:text-accent-hover bg-accent-soft/40 hover:bg-accent-soft rounded-lg transition-colors flex items-center justify-center gap-1 border border-accent/20 cursor-pointer"
                                                                >
                                                                    {estaExpandido ? (
                                                                        <>
                                                                            <span>Ver menos</span>
                                                                            <ChevronUp className="w-3.5 h-3.5" />
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <span>Ver más ({secciones.length - 3} adicionales)</span>
                                                                            <ChevronDown className="w-3.5 h-3.5" />
                                                                        </>
                                                                    )}
                                                                </button>
                                                            )}
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        ) : (
                                            cursoEsTaller && !hayAlgunTallerEnExcel ? (
                                                <div className="p-2 bg-overlay border border-divider rounded text-center">
                                                    {nombreArchivoTalleres ? (
                                                        <div className="flex flex-col items-center gap-1">
                                                            <div className="flex items-center gap-1">
                                                                <FileText className="w-3 h-3 text-foreground-500" />
                                                                <span className="text-xs text-foreground font-medium truncate max-w-[150px]">{nombreArchivoTalleres}</span>
                                                            </div>
                                                            <span className="text-[11px] text-danger font-semibold">Taller no encontrado en el Excel subido</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-1">
                                                            <span className="text-xs text-muted font-medium">Este curso es un taller</span>
                                                            <button
                                                                onClick={() => talleresInputRef.current?.click()}
                                                                className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer bg-accent-soft/40 hover:bg-accent-soft px-2 py-1 rounded transition-colors"
                                                            >
                                                                <CloudUpload className="w-3.5 h-3.5" />
                                                                Subir Excel de Talleres
                                                            </button>
                                                            <input
                                                                ref={talleresInputRef}
                                                                type="file"
                                                                accept=".xlsx,.xls"
                                                                onChange={onCargaTalleres}
                                                                className="hidden"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="p-2 bg-overlay border border-divider rounded text-center text-xs text-muted">
                                                    No hay horarios disponibles en el Excel cargado.
                                                </div>
                                            )
                                        )
                                    )}
                                </div>
                            );
                        })}
                    </ScrollShadow>
                </div>
            ) : (
                <div className="flex flex-col gap-3 md:gap-4">
                    {/* Card de Malla Curricular arriba del excel */}
                    <Link
                        href={`/${slug}/malla`}
                        className="group bg-emerald-500/10 border border-emerald-500/50 hover:bg-emerald-500/20 rounded-2xl shadow-md p-4 flex items-center justify-between transition-all w-full"
                        title="Ver Malla Curricular"
                    >
                        <div className="flex flex-col text-left">
                            <span className="text-base md:text-lg font-bold text-emerald-500 transition-colors">
                                Malla Curricular
                            </span>
                            <span className="text-sm md:text-base text-muted mt-1">
                                Marca tus cursos aprobados para organizar tu horario más fácilmente.
                            </span>
                        </div>
                        <div className="shrink-0 ml-3 inline-flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-500 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>

                    {/* Card de Subir Excel */}
                    <PantallaSubirExcel
                        cargandoArchivo={cargandoArchivo}
                        onCargaArchivo={onCargaArchivo}
                        onCargaArchivosDirectos={onCargaArchivosDirectos}
                    />
                </div>
            )}
        </>
    );
}

export default PanelCursos;
