import { useConfigHorario, acortarNombreProfesor, invertirOrdenProfesor } from '@/hooks/useConfigHorario';

const ALIGN_CLASSES = {
    left: { items: 'items-start', text: 'text-left' },
    center: { items: 'items-center', text: 'text-center' },
    right: { items: 'items-end', text: 'text-right' },
};

/**
 * Celda del horario que ya tiene un curso asignado.
 * Al hacer click se remueve el curso completo.
 */
function CeldaAsignada({ clase, color, onRemover }) {
    const { config } = useConfigHorario();
    const { camposVisibles, nombreCortoProfesor, nombrePrimero, tamanoLetra, alineacion } = config;

    let profesor = clase.profesor;
    if (nombreCortoProfesor) {
        profesor = acortarNombreProfesor(profesor, nombrePrimero);
    } else if (nombrePrimero) {
        profesor = invertirOrdenProfesor(profesor);
    }

    const align = ALIGN_CLASSES[alineacion] ?? ALIGN_CLASSES.left;

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
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-3 h-3 md:w-4 md:h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ fontSize: '8px' }}
            >
                ×
            </div>
        </div>
    );
}

export default CeldaAsignada;
