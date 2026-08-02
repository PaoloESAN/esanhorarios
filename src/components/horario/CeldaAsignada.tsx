import { useConfigHorario, acortarNombreProfesor, invertirOrdenProfesor } from '@/hooks/useConfigHorario';
import { CursoItem } from '@/hooks/useCursos';
import { ColorCelda } from '@/lib/colores';

const ALIGN_CLASSES = {
    left: { items: 'items-start', text: 'text-left' },
    center: { items: 'items-center', text: 'text-center' },
    right: { items: 'items-end', text: 'text-right' },
};

export interface CeldaAsignadaProps {
    clase: CursoItem;
    color: ColorCelda;
    onRemover: () => void;
    esConflicto?: boolean;
}

/**
 * Celda del horario que ya tiene un curso asignado.
 * Al hacer click se remueve el curso completo.
 */
function CeldaAsignada({ clase, color, onRemover, esConflicto }: CeldaAsignadaProps) {
    const { config } = useConfigHorario();
    const { camposVisibles, nombreCortoProfesor, nombrePrimero, tamanoLetra, alineacion } = config;

    let profesor = clase.profesor;
    if (nombreCortoProfesor) {
        profesor = acortarNombreProfesor(profesor, nombrePrimero);
    } else if (nombrePrimero) {
        profesor = invertirOrdenProfesor(profesor);
    }

    const align = ALIGN_CLASSES[alineacion] ?? ALIGN_CLASSES.left;

    if (esConflicto) {
        return (
            <div
                className={`${color.bg} ${color.border} border rounded flex-1 flex flex-col justify-between ${align.items} p-0.5 group relative cursor-pointer overflow-hidden min-w-0 min-h-[20px] shadow-xs`}
                style={{ fontSize: `${Math.max(tamanoLetra - 2, 8)}px` }}
                onClick={(e) => {
                    e.stopPropagation();
                    onRemover();
                }}
                title={`Conflicto: Click para remover ${clase.curso}`}
            >
                {camposVisibles.curso && (
                    <div className={`font-semibold ${color.text} leading-tight ${align.text} w-full truncate`}>
                        {clase.curso}
                    </div>
                )}
                {camposVisibles.seccion && (
                    <div className={`${color.textSecondary} w-full truncate ${align.text}`} style={{ fontSize: `${Math.max(tamanoLetra - 3, 7)}px` }}>
                        Sec: {clase.seccion}
                    </div>
                )}
                <div
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    style={{ fontSize: '8px' }}
                >
                    ×
                </div>
            </div>
        );
    }

    return (
        <div
            className={`${color.bg} ${color.border} border rounded h-full flex flex-col justify-between ${align.items} p-0.5 md:p-1 group relative cursor-pointer overflow-visible min-w-0`}
            style={{ fontSize: `${tamanoLetra}px` }}
            onClick={onRemover}
            title="Click para remover todo el curso"
        >
            {camposVisibles.curso && (
                <div className={`font-medium ${color.text} leading-tight ${align.text} w-full`}>
                    <span className="line-clamp-2">{clase.curso}</span>
                </div>
            )}
            {camposVisibles.seccion && (
                <div className={`${color.textSecondary} w-full truncate ${align.text}`} style={{ fontSize: `${Math.max(tamanoLetra - 2, 7)}px` }}>
                    {clase.seccion}
                </div>
            )}
            {camposVisibles.profesor && (
                <div className={`${color.textSecondary} w-full truncate ${align.text}`} style={{ fontSize: `${Math.max(tamanoLetra - 2, 7)}px` }}>
                    {profesor}
                </div>
            )}
            {camposVisibles.aula && clase.aula && (
                <div className={`${color.textSecondary} w-full truncate ${align.text}`} style={{ fontSize: `${Math.max(tamanoLetra - 2, 7)}px` }}>
                    {clase.aula}
                </div>
            )}
            <div
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-3 h-3 md:w-4 md:h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                style={{ fontSize: '8px' }}
            >
                ×
            </div>
        </div>
    );
}

export default CeldaAsignada;
