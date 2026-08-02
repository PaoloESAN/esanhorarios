import { DragEvent, MouseEvent } from 'react';
import { Search } from 'lucide-react';

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
    onAgregar: (item: any) => void;
    onRemover: (id: string) => void;
    onDragStart: (e: DragEvent<HTMLElement>, item: any) => void;
}

/**
 * Tarjeta individual de una sección de curso.
 * Permite agregar/remover la sección y drag&drop.
 */
function TarjetaSeccion({ curso, seccionData, estaSeleccionado, esBloqueado = false, onAgregar, onRemover, onDragStart }: TarjetaSeccionProps) {
    const nombreCursoAMostrar = seccionData.nombreCursoElectivo || curso;

    return (
        <div
            draggable={!estaSeleccionado}
            onDragStart={(e) => !estaSeleccionado && onDragStart(e, {
                curso: nombreCursoAMostrar, profesor: seccionData.profesor, seccion: seccionData.seccion, id: seccionData.id,
            })}
            onClick={() => estaSeleccionado ? onRemover(seccionData.id) : onAgregar({
                curso: nombreCursoAMostrar, profesor: seccionData.profesor, seccion: seccionData.seccion, id: seccionData.id,
            })}
            className={`p-2.5 border rounded-xl transition-all ${estaSeleccionado
                ? 'bg-surface border-divider cursor-pointer hover:bg-overlay'
                : esBloqueado
                    ? 'bg-danger-soft border-danger cursor-move hover:bg-danger-soft'
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
}

export default TarjetaSeccion;
