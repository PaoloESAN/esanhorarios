import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown';

/**
 * Celda vacía del horario. Puede contener una nota de texto opcional.
 * Al hacer click en celda vacía abre el modal de nota.
 */
function CeldaVacia({ nota, onAbrirNota, onEditarNota, onQuitarNota }) {
    return (
        <div className="h-full bg-content1 hover:bg-content2 transition-colors rounded border-2 border-dashed border-transparent hover:border-primary relative">
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
                <div
                    className="absolute inset-0"
                    onClick={onAbrirNota}
                    title="Click para agregar texto"
                />
            )}
        </div>
    );
}

export default CeldaVacia;
