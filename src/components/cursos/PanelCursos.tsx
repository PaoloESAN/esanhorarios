import { useRef, useEffect, useMemo, ChangeEvent, DragEvent } from 'react';
import Link from 'next/link';
import { Button, Select, Label, ListBox, Chip } from '@heroui/react';
import { useCarrera } from '@/app/[slug]/CarreraContext';
import { Plus, BadgeCheck, CloudUpload, FileText } from 'lucide-react';
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
    onCargaArchivosDirectos?: (archivos: File[]) => void;
    cargandoTalleres: boolean;
    nombreArchivoTalleres: string;
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
    onCargaArchivosDirectos,
    cargandoTalleres,
    nombreArchivoTalleres,
}: PanelCursosProps) {
    const { slug, cursosPorCiclo, obtenerCreditos, esCursoBloqueado, esCursoAprobado } = useCarrera();
    const hayArchivo = Boolean(nombreArchivo);
    const listaRef = useRef<HTMLDivElement>(null);
    const talleresInputRef = useRef<HTMLInputElement>(null);

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
                    <div ref={listaRef} className="space-y-3 flex-1 min-h-0 overflow-y-auto">
                        {cursosPorCiclo[cicloSeleccionado]
                            ?.filter((curso) => !esCursoAprobado(curso))
                            .map((curso, idx) => {
                            const secciones = obtenerHorariosPorCurso(curso);
                            const creditos = obtenerCreditos(curso);
                            const esElectivo = curso.toLowerCase().includes('electivo');
                            const cursoEsTaller = esTaller(curso);
                            const esBloqueado = esCursoBloqueado(curso);

                            return (
                                <div key={idx} className="border border-divider rounded-lg p-2 md:p-3 bg-surface-secondary">
                                    {/* Cabecera del curso */}
                                    <h4 className="font-semibold text-foreground text-xs md:text-sm mb-2 md:mb-3 border-b border-divider pb-2">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <span className="flex-1">{curso}</span>
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

                                    {/* Secciones */}
                                    {secciones.length > 0 ? (
                                        <div className="space-y-2">
                                            {secciones.map((seccionData, si) => (
                                                <TarjetaSeccion
                                                    key={`${idx}-${si}`}
                                                    curso={curso}
                                                    seccionData={seccionData}
                                                    estaSeleccionado={cursosSeleccionados.has(seccionData.id)}
                                                    esBloqueado={esBloqueado}
                                                    onAgregar={onAgregarCurso}
                                                    onRemover={onRemoverCurso}
                                                    onDragStart={onDragStart}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        !esElectivo && (
                                            cursoEsTaller && !hayAlgunTallerEnExcel ? (
                                                <div className="p-2 bg-overlay border border-divider rounded text-center">
                                                    {nombreArchivoTalleres ? (
                                                        <div className="flex flex-col items-center gap-1">
                                                            <div className="flex items-center gap-1">
                                                                <FileText className="w-3 h-3 text-foreground-500" />
                                                                <span className="text-xs text-foreground-500 truncate max-w-35">
                                                                    {nombreArchivoTalleres}
                                                                </span>
                                                            </div>
                                                            <div className="text-xs text-foreground-500">No hay horarios disponibles</div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                variant="tertiary"
                                                                size="sm"
                                                                className="cursor-pointer"
                                                                isPending={cargandoTalleres}
                                                                onPress={handleOpenTalleresPicker}
                                                            >
                                                                {!cargandoTalleres && <CloudUpload size={14} />}
                                                                {cargandoTalleres ? 'Cargando...' : 'Subir Excel de Talleres'}
                                                            </Button>
                                                            <input
                                                                ref={talleresInputRef}
                                                                type="file"
                                                                accept=".xlsx,.xls"
                                                                onChange={onCargaTalleres}
                                                                className="hidden"
                                                                disabled={cargandoTalleres}
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="p-2 bg-overlay border border-divider rounded text-center">
                                                    <div className="text-xs text-foreground-500">No hay horarios disponibles</div>
                                                </div>
                                            )
                                        )
                                    )}
                                </div>
                            );
                        })}
                    </div>
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
