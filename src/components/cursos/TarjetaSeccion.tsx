import { DragEvent, MouseEvent, useState } from 'react';
import { Search } from 'lucide-react';
import { Tooltip } from '@heroui/react';

export interface TarjetaSeccionProps {
    curso: string;
    seccionData: {
        id: string;
        profesor: string;
        seccion: string;
        horarios: any[];
        nombreCursoElectivo?: string;
    };
    estaSeleccionado: boolean;
    esBloqueado?: boolean;
    requisitosFaltantes?: string[];
    creditosFaltantes?: number;
    onAgregar: (item: any) => void;
    onRemover: (id: string) => void;
    onDragStart: (e: DragEvent<HTMLElement>, item: any) => void;
}

/**
 * Tarjeta individual de una sección de curso.
 * Permite agregar/remover la sección y drag&drop.
 */
function TarjetaSeccion({
    curso,
    seccionData,
    estaSeleccionado,
    esBloqueado = false,
    requisitosFaltantes = [],
    creditosFaltantes = 0,
    onAgregar,
    onRemover,
    onDragStart,
}: TarjetaSeccionProps) {
    const nombreCursoAMostrar = seccionData.nombreCursoElectivo || curso;
    const [tooltipAbierto, setTooltipAbierto] = useState(false);

    const tarjetaContenido = (
        <div
            draggable={!estaSeleccionado && !esBloqueado}
            onDragStart={(e) => !estaSeleccionado && !esBloqueado && onDragStart(e, {
                curso: nombreCursoAMostrar, profesor: seccionData.profesor, seccion: seccionData.seccion, id: seccionData.id,
            })}
            onClick={() => {
                if (esBloqueado) {
                    setTooltipAbierto(prev => !prev);
                    return;
                }
                estaSeleccionado ? onRemover(seccionData.id) : onAgregar({
                    curso: nombreCursoAMostrar, profesor: seccionData.profesor, seccion: seccionData.seccion, id: seccionData.id,
                });
            }}
            className={`p-2.5 border rounded-xl transition-all ${estaSeleccionado
                ? 'bg-surface border-divider cursor-pointer hover:bg-overlay'
                : esBloqueado
                    ? 'bg-danger-soft border-danger cursor-pointer hover:bg-danger-soft'
                    : 'bg-accent-soft/60 border-accent cursor-move hover:bg-accent-soft'
                }`}
        >
            {/* Nombre del curso electivo o base */}
            <div className="text-xs font-bold text-foreground mb-1 flex items-center justify-between gap-1">
                <span className="truncate">{nombreCursoAMostrar}</span>
                {estaSeleccionado && (
                    <span className="text-[10px] bg-accent/20 text-accent font-semibold px-1.5 py-0.5 rounded shrink-0">
                        ✓ Seleccionado
                    </span>
                )}
            </div>

            {/* Sección y Profesor */}
            <div className="flex flex-wrap items-center justify-between gap-x-2 text-xs text-muted mb-1">
                <span className="font-semibold text-foreground-700">Sección: {seccionData.seccion}</span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={(e: MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            window.open(`https://www.google.com/search?q=${encodeURIComponent(seccionData.profesor)}`, '_blank');
                        }}
                        className="p-0.5 hover:bg-overlay rounded transition-colors bg-surface border border-divider shadow-sm"
                        title={`Buscar información sobre ${seccionData.profesor}`}
                    >
                        <Search className={`w-3 h-3 text-foreground-500 ${esBloqueado ? 'hover:text-danger' : 'hover:text-accent'}`} />
                    </button>
                    <span className="truncate max-w-[150px]">Prof: {seccionData.profesor}</span>
                </div>
            </div>

            {/* Horarios */}
            <div className={`text-[11px] font-medium ${estaSeleccionado ? 'text-foreground-500' : esBloqueado ? 'text-danger' : 'text-accent'}`}>
                Horarios: {seccionData.horarios.length} clase{seccionData.horarios.length !== 1 ? 's' : ''}
            </div>
        </div>
    );

    if (esBloqueado) {
        return (
            <Tooltip
                delay={0}
                closeDelay={0}
                isOpen={tooltipAbierto}
                onOpenChange={(open) => setTooltipAbierto(open)}
            >
                <Tooltip.Trigger className="w-full text-left bg-transparent p-0 border-0 cursor-pointer">
                    {tarjetaContenido}
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
                            <p className="italic text-muted">Prerrequisito del curso electivo pendiente</p>
                        )}
                    </div>
                </Tooltip.Content>
            </Tooltip>
        );
    }

    return tarjetaContenido;
}

export default TarjetaSeccion;
