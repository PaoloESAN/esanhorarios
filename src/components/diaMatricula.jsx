import React from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";

export default function DiaMatricula({ onAbrirModal }) {
    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["4 de agosto"]));

    const selectedValue = React.useMemo(
        () => Array.from(selectedKeys).join(", ").replace(/_/g, ""),
        [selectedKeys],
    );

    const obtenerNumeroImagen = (diaSeleccionado) => {
        const dias = {
            "4 de agosto": 1,
            "5 de agosto": 2,
            "6 de agosto": 3,
            "7 de agosto": 4,
            "8 de agosto": 5
        };
        return dias[diaSeleccionado] || 1;
    };

    const manejarComprobar = () => {
        const diaSeleccionado = Array.from(selectedKeys)[0];
        const numeroImagen = obtenerNumeroImagen(diaSeleccionado);
        onAbrirModal(numeroImagen);
    };

    return (
        <div className="bg-white rounded-lg mt-6 shadow-md p-3 md:p-6 mb-6 md:mb-6">
            <div className="flex flex-col gap-4">

                {/* TÍTULO */}
                <div className="flex-shrink-0">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                        ¿Podrás matricularte a los cursos que deseas?
                    </h2>
                </div>

                {/* CONTROLES */}
                <div className="flex flex-row items-center gap-3">
                    <p className="text-sm md:text-base text-gray-600 whitespace-nowrap">
                        Tu día de matrícula:
                    </p>

                    <Dropdown>
                        <DropdownTrigger>
                            <Button className="capitalize min-w-32" variant="bordered">
                                {selectedValue}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Seleccionar día de matrícula"
                            selectedKeys={selectedKeys}
                            selectionMode="single"
                            variant="flat"
                            onSelectionChange={setSelectedKeys}
                        >
                            <DropdownItem key="4 de agosto">4 de agosto</DropdownItem>
                            <DropdownItem key="5 de agosto">5 de agosto</DropdownItem>
                            <DropdownItem key="6 de agosto">6 de agosto</DropdownItem>
                            <DropdownItem key="7 de agosto">7 de agosto</DropdownItem>
                            <DropdownItem key="8 de agosto">8 de agosto</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>

                    <Button
                        color="success"
                        className="min-w-24"
                        onPress={manejarComprobar}
                    >
                        Comprobar
                    </Button>
                </div>
            </div>
        </div>
    );
}

