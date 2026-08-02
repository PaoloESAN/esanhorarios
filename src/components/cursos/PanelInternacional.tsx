import { DragEvent } from 'react';
import { ScrollShadow, Chip } from '@heroui/react';
import { Globe, Sun, Moon } from 'lucide-react';
import TarjetaSeccion from './TarjetaSeccion';
import { CursoItem } from '@/hooks/useCursos';
import {
    ELECTIVOS_INTERNACIONALES_MANANA,
    ELECTIVOS_INTERNACIONALES_TARDE,
} from '@/data/internacionales';

export interface PanelInternacionalProps {
    cursosSeleccionados: Set<string>;
    obtenerHorariosPorCurso: (curso: string) => any[];
    onAgregarCurso: (item: CursoItem) => void;
    onRemoverCurso: (id: string) => void;
    onDragStart: (e: DragEvent<HTMLElement>, item: any) => void;
}

export default function PanelInternacional({
    cursosSeleccionados,
    obtenerHorariosPorCurso,
    onAgregarCurso,
    onRemoverCurso,
    onDragStart,
}: PanelInternacionalProps) {
    const renderGrupoCursos = (
        titulo: string,
        horarioBadge: string,
        icono: any,
        lista: string[],
        badgeColor: 'warning' | 'accent'
    ) => {
        return (
            <div className="space-y-3 mb-6">
                {/* Header del Turno */}
                <div className="flex items-center justify-between bg-surface-secondary px-3.5 py-2.5 rounded-xl border border-divider shadow-sm">
                    <div className="flex items-center gap-2">
                        {icono}
                        <div>
                            <span className="font-bold text-xs md:text-sm text-foreground">{titulo}</span>
                            <span className="text-[11px] text-muted ml-2">({horarioBadge})</span>
                        </div>
                    </div>
                    <Chip color={badgeColor} variant="tertiary" size="sm" className="text-[10px]">
                        Máx 1 curso
                    </Chip>
                </div>

                {/* Lista de Cursos */}
                <div className="space-y-2.5">
                    {lista.map((curso, idx) => {
                        const secciones = obtenerHorariosPorCurso(curso);

                        if (secciones.length > 0) {
                            return secciones.map((seccionData, si) => (
                                <TarjetaSeccion
                                    key={`${idx}-${si}`}
                                    curso={curso}
                                    seccionData={seccionData}
                                    estaSeleccionado={cursosSeleccionados.has(seccionData.id)}
                                    esBloqueado={false}
                                    onAgregar={onAgregarCurso}
                                    onRemover={onRemoverCurso}
                                    onDragStart={onDragStart}
                                />
                            ));
                        }

                        return (
                            <div key={idx} className="p-3 bg-surface border border-divider/70 rounded-xl space-y-1">
                                <div className="text-xs font-bold text-foreground leading-tight">{curso}</div>
                                <div className="text-[11px] text-muted italic">
                                    Sin horarios detectados en el Excel cargado.
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full flex flex-col h-full bg-surface border border-divider rounded-2xl shadow-sm overflow-hidden">
            {/* Header Limpio del Panel */}
            <div className="p-3.5 md:p-4 border-b border-divider bg-surface-secondary/50 flex items-center gap-3">
                <div className="p-2 bg-accent/10 text-accent rounded-xl">
                    <Globe className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-foreground text-sm md:text-base">
                        Electivos Internacionales
                    </h3>
                    <p className="text-[11px] text-muted">
                        Máximo 1 curso de la mañana y 1 curso de la tarde
                    </p>
                </div>
            </div>

            {/* Lista de Cursos por Turno */}
            <ScrollShadow className="flex-1 p-3">
                {renderGrupoCursos(
                    'Turno Mañana',
                    '8:30 am - 1:30 pm',
                    <Sun className="w-4 h-4 text-amber-500" />,
                    ELECTIVOS_INTERNACIONALES_MANANA,
                    'warning'
                )}

                {renderGrupoCursos(
                    'Turno Tarde',
                    '4:00 pm - 9:00 pm',
                    <Moon className="w-4 h-4 text-indigo-400" />,
                    ELECTIVOS_INTERNACIONALES_TARDE,
                    'accent'
                )}
            </ScrollShadow>
        </div>
    );
}
