import { Dropdown, Label } from '@heroui/react';
import { Trash2, X } from 'lucide-react';
import { useCarrera } from '@/app/[slug]/CarreraContext';
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
 * Al hacer click en la tarjeta abre un Dropdown con información y opción de eliminar.
 * Cuenta con botón '×' en la esquina superior derecha para eliminar directamente.
 */
function CeldaAsignada({ clase, color, onRemover, esConflicto }: CeldaAsignadaProps) {
    const { config } = useConfigHorario();
    const { camposVisibles, nombreCortoProfesor, nombrePrimero, tamanoLetra, alineacion } = config;
    const carreraData = useCarrera();

    const totalCreditos = clase.creditos ?? (carreraData?.obtenerCreditos ? carreraData.obtenerCreditos(clase.curso) : 3);

    let profesorDisplay = clase.profesor;
    if (nombreCortoProfesor) {
        profesorDisplay = acortarNombreProfesor(profesorDisplay, nombrePrimero);
    } else if (nombrePrimero) {
        profesorDisplay = invertirOrdenProfesor(profesorDisplay);
    }

    const align = ALIGN_CLASSES[alineacion] ?? ALIGN_CLASSES.left;

    const tarjetaContenido = (
        <div
            className={`${color.bg} ${color.border} border rounded ${esConflicto ? 'flex-1 p-0.5 min-h-5' : 'h-full p-0.5 md:p-1'
                } flex flex-col justify-between ${align.items} relative cursor-pointer overflow-visible min-w-0 w-full`}
            style={{ fontSize: `${esConflicto ? Math.max(tamanoLetra - 2, 8) : tamanoLetra}px` }}
        >
            {camposVisibles.curso && (
                <div className={`font-medium ${color.text} leading-tight ${align.text} w-full`}>
                    <span className={esConflicto ? "truncate block" : "line-clamp-2"}>{clase.curso}</span>
                </div>
            )}
            {camposVisibles.seccion && (
                <div className={`${color.textSecondary} w-full truncate ${align.text}`} style={{ fontSize: `${Math.max(tamanoLetra - (esConflicto ? 3 : 2), 7)}px` }}>
                    {esConflicto ? `Sec: ${clase.seccion}` : clase.seccion}
                </div>
            )}
            {!esConflicto && camposVisibles.profesor && (
                <div className={`${color.textSecondary} w-full truncate ${align.text}`} style={{ fontSize: `${Math.max(tamanoLetra - 2, 7)}px` }}>
                    {profesorDisplay}
                </div>
            )}
            {!esConflicto && camposVisibles.aula && clase.aula && (
                <div className={`${color.textSecondary} w-full truncate ${align.text}`} style={{ fontSize: `${Math.max(tamanoLetra - 2, 7)}px` }}>
                    {clase.aula}
                </div>
            )}
        </div>
    );

    return (
        <div className={`group relative w-full ${esConflicto ? 'flex-1 min-h-5' : 'h-full'}`}>
            <Dropdown>
                <Dropdown.Trigger
                    {...{
                        variant: "light",
                        className: "w-full h-full p-0 border-0 bg-transparent text-left cursor-pointer min-w-0 focus:outline-none flex items-stretch",
                    } as any}
                >
                    {tarjetaContenido}
                </Dropdown.Trigger>
                <Dropdown.Popover className="max-w-xs" placement='top'>
                    {/* Cabecera del curso */}
                    <div className="px-3 pt-3 pb-2.5 border-b border-divider">
                        <div className="space-y-1.5">
                            {/* El curso */}
                            <div className="font-bold text-xs md:text-sm text-foreground leading-snug">
                                {clase.curso}
                            </div>

                            {/* La sección y Los créditos */}
                            <div className="flex items-center justify-between gap-2 text-xs">
                                <span className="font-semibold text-foreground-700">
                                    Sección: <span className="text-foreground font-bold">{clase.seccion}</span>
                                </span>
                                <span className="bg-accent/15 text-accent font-semibold px-2 py-0.5 rounded-full text-[11px] shrink-0">
                                    {totalCreditos} {totalCreditos === 1 ? 'crédito' : 'créditos'}
                                </span>
                            </div>

                            {/* El profe */}
                            <div className="text-xs text-muted truncate">
                                <span className="font-medium text-foreground-600">Prof:</span> {clase.profesor}
                            </div>

                            {/* Aula (si existe) */}
                            {clase.aula && (
                                <div className="text-xs text-muted truncate">
                                    <span className="font-medium text-foreground-600">Aula:</span> {clase.aula}
                                </div>
                            )}
                        </div>
                    </div>

                    <Dropdown.Menu aria-label="Opciones del curso">
                        {/* Botón de eliminar abajo */}
                        <Dropdown.Item
                            key="eliminar"
                            id="eliminar"
                            textValue="Eliminar curso"
                            variant="danger"
                            className="text-danger hover:bg-danger/10 cursor-pointer py-2"
                            onPress={onRemover}
                        >
                            <div className="flex w-full items-center justify-between gap-2 text-danger">
                                <Label className="text-danger font-semibold cursor-pointer">Eliminar curso</Label>
                                <Trash2 className="size-4 shrink-0 text-danger" />
                            </div>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown.Popover>
            </Dropdown>

            {/* Botón de eliminar directo en la mini card (posicionado fuera del Dropdown.Trigger para evitar <button> dentro de <button>) */}
            <div
                role="button"
                tabIndex={0}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onRemover();
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation();
                        e.preventDefault();
                        onRemover();
                    }
                }}
                className="absolute -top-1 -right-1 md:-top-1.5 md:-right-1.5 bg-red-500 hover:bg-red-600 active:scale-90 text-white rounded-full w-4.5 h-4.5 md:w-5 md:h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md z-20 cursor-pointer border border-white/40"
                title="Eliminar curso directamente"
                aria-label="Eliminar curso"
            >
                <X className="w-3 h-3 md:w-3.5 md:h-3.5 stroke-[2.5]" />
            </div>
        </div>
    );
}

export default CeldaAsignada;
