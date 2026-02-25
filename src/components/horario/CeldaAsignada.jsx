/**
 * Celda del horario que ya tiene un curso asignado.
 * Al hacer click se remueve el curso completo.
 */
function CeldaAsignada({ clase, color, onRemover }) {
    return (
        <div
            className={`${color.bg} ${color.border} border rounded p-0.5 md:p-1 h-full flex flex-col justify-between text-xs group relative cursor-pointer overflow-visible min-w-0`}
            onClick={onRemover}
            title="Click para remover todo el curso"
        >
            <div className={`font-medium ${color.text} leading-tight text-xs`}>
                <span className="line-clamp-2">{clase.curso}</span>
            </div>
            <div className={`${color.textSecondary} text-[10px] md:text-xs w-full truncate`}>{clase.seccion}</div>
            <div className={`${color.textSecondary} text-[10px] md:text-xs w-full truncate`}>{clase.profesor}</div>
            {clase.aula && (
                <div className={`${color.textSecondary} text-[10px] md:text-xs w-full truncate`}>{clase.aula}</div>
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
