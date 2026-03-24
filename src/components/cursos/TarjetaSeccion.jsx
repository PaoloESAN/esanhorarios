import { Search } from 'lucide-react';

/**
 * Tarjeta individual de una sección de curso.
 * Permite agregar/remover la sección y drag&drop.
 */
function TarjetaSeccion({ curso, seccionData, estaSeleccionado, onAgregar, onRemover, onDragStart }) {

    return (
        <div
            draggable={!estaSeleccionado}
            onDragStart={(e) => !estaSeleccionado && onDragStart(e, {
                curso, profesor: seccionData.profesor, seccion: seccionData.seccion, id: seccionData.id,
            })}
            onClick={() => estaSeleccionado ? onRemover(seccionData.id) : onAgregar({
                curso, profesor: seccionData.profesor, seccion: seccionData.seccion, id: seccionData.id,
            })}
            className={`p-2 border rounded transition-colors ${estaSeleccionado
                ? 'bg-surface border-divider cursor-pointer hover:bg-overlay'
                : 'bg-accent-soft border-accent cursor-move hover:bg-accent-soft'
                }`}
        >
            <div className={`text-xs font-medium mb-1 ${estaSeleccionado ? 'text-foreground-600' : 'text-foreground'}`}>
                Sección: {seccionData.seccion} {estaSeleccionado ? '✓ Click para remover' : ''}
            </div>
            <div className={`text-xs mb-1 flex items-center gap-1 flex-row ${estaSeleccionado ? 'text-foreground-500' : 'text-foreground-600'}`}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://www.google.com/search?q=${encodeURIComponent(seccionData.profesor)}`, '_blank');
                    }}
                    className="p-0.5 hover:bg-overlay rounded transition-colors bg-surface border border-divider shadow-sm"
                    title={`Buscar información sobre ${seccionData.profesor}`}
                >
                    <Search className="w-3 h-3 text-foreground-500 hover:text-accent" />
                </button>
                <span>Prof: {seccionData.profesor}</span>
            </div>
            <div className={`text-xs ${estaSeleccionado ? 'text-foreground-500' : 'text-accent'}`}>
                Horarios: {seccionData.horarios.length} clase{seccionData.horarios.length !== 1 ? 's' : ''}
            </div>
        </div>
    );
}

export default TarjetaSeccion;
