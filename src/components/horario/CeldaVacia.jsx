import { Dropdown, Label } from '@heroui/react';
import { useConfigHorario } from '@/hooks/useConfigHorario';

/**
 * Celda vacía del horario. Puede contener una nota de texto opcional.
 * Al hacer click en celda vacía abre el modal de nota.
 */
function CeldaVacia({ nota, onAbrirNota, onEditarNota, onQuitarNota }) {
    const { config } = useConfigHorario();
    const tieneChaufa = config.fondoChiJauKay || config.fondoTiPaKay;
    const bgClass = tieneChaufa
        ? 'bg-transparent hover:bg-white/10'
        : 'bg-surface hover:bg-surface-secondary';

    return (
        <div className={`h-full ${bgClass} transition-colors rounded border-2 border-dashed border-transparent hover:border-accent relative`}>
            {nota ? (
                <Dropdown key="celda-con-nota">
                    <Dropdown.Trigger
                        variant="light"
                        className="w-full max-w-full h-full rounded p-1 border border-divider overflow-hidden relative flex items-center justify-center text-center cursor-pointer min-w-0"
                        style={{ backgroundColor: nota.color, color: nota.textColor ?? '#111827' }}
                        title={nota.texto}
                    >
                        <div className="text-xs md:text-sm leading-tight px-2 w-full max-w-full whitespace-normal break-words text-center">
                            {nota.texto}
                        </div>
                    </Dropdown.Trigger>
                    <Dropdown.Popover>
                        <Dropdown.Menu key="menu-con-nota" aria-label="Opciones de nota">
                            <Dropdown.Item key="editar" id="editar" textValue="Editar texto" onPress={onEditarNota}>
                                <Label>Editar texto</Label>
                            </Dropdown.Item>
                            <Dropdown.Item key="quitar" id="quitar" textValue="Quitar texto" variant="danger" onPress={onQuitarNota}>
                                <Label>Quitar texto</Label>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Popover>
                </Dropdown>
            ) : (
                <Dropdown key="celda-sin-nota">
                    <Dropdown.Trigger
                        variant="light"
                        className="absolute inset-0 min-w-0 h-full p-0 cursor-pointer"
                        title="Click para agregar texto"
                        aria-label="Agregar nota"
                    />
                    <Dropdown.Popover>
                        <Dropdown.Menu key="menu-sin-nota" aria-label="Opciones de celda vacía">
                            <Dropdown.Item key="agregar" id="agregar" textValue="Agregar nota" onPress={onAbrirNota}>
                                <Label>Agregar nota</Label>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Popover>
                </Dropdown>
            )}
        </div>
    );
}

export default CeldaVacia;
