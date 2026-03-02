import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown';
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
        : 'bg-content1 hover:bg-content2';

    return (
        <div className={`h-full ${bgClass} transition-colors rounded border-2 border-dashed border-transparent hover:border-primary relative`}>
            {nota ? (
                <Dropdown>
                    <DropdownTrigger>
                        <div
                            className="w-full max-w-full h-full rounded p-1 border border-divider overflow-hidden relative flex items-center justify-center text-center cursor-pointer min-w-0"
                            style={{ backgroundColor: nota.color, color: nota.textColor ?? '#111827' }}
                            title={nota.texto}
                        >
                            <div className="text-xs md:text-sm leading-tight px-2 w-full max-w-full whitespace-normal break-words text-center">
                                {nota.texto}
                            </div>
                        </div>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Opciones de nota">
                        <DropdownItem key="editar" onPress={onEditarNota}>Editar texto</DropdownItem>
                        <DropdownItem key="quitar" className="text-danger" color="danger" onPress={onQuitarNota}>
                            Quitar texto
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            ) : (
                <Dropdown>
                    <DropdownTrigger>
                        <div
                            className="absolute inset-0 cursor-pointer"
                            title="Click para agregar texto"
                        />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Opciones de celda vacía">
                        <DropdownItem key="agregar" onPress={onAbrirNota}>Agregar nota</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            )}
        </div>
    );
}

export default CeldaVacia;
