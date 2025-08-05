"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Modal, ModalContent, ModalBody, ModalHeader, ModalFooter } from "@heroui/modal";
import { Input } from "@heroui/input";

const ModalAgregarCurso = ({
    isOpen,
    onClose,
    onAgregarCurso,
    diasSemana,
    onError
}) => {
    const [cursoPersonalizado, setCursoPersonalizado] = useState({
        nombre: '',
        seccion: 'S-001',
        profesor: '',
        aula: '',
        creditos: '3',
        horarios: [{ dia: 'Lunes', horaInicio: '07:30', horaFin: '09:15' }]
    });

    const horasInicio = [];
    const horasFin = [];

    for (let hora = 7; hora <= 22; hora++) {
        const horaStr = hora.toString().padStart(2, '0');
        horasInicio.push(`${horaStr}:30`);
    }

    for (let hora = 8; hora <= 23; hora++) {
        const horaStr = hora.toString().padStart(2, '0');
        horasFin.push(`${horaStr}:15`);
    }

    const generarHorariosAutomaticos = (dia, horaInicio, horaFin) => {
        const horarios = [];

        const [horaInicioHr, horaInicioMin] = horaInicio.split(':').map(Number);
        const [horaFinHr, horaFinMin] = horaFin.split(':').map(Number);

        // Generamos slots desde la hora de inicio hasta la hora de fin
        // Cada slot se mapea directamente: hora -> hora:30-(hora+1):15
        for (let hora = horaInicioHr; hora < horaFinHr; hora++) {
            const horarioFormateado = `${hora.toString().padStart(2, '0')}:30-${(hora + 1).toString().padStart(2, '0')}:15`;

            if (!horarios.some(h => h.horario === horarioFormateado)) {
                horarios.push({
                    dia: dia,
                    horario: horarioFormateado
                });
            }
        }

        return horarios;
    };

    const limpiarCursoPersonalizado = () => {
        setCursoPersonalizado({
            nombre: '',
            seccion: 'S-001',
            profesor: '',
            aula: '',
            creditos: '3',
            horarios: [{ dia: 'Lunes', horaInicio: '07:30', horaFin: '09:15' }]
        });
    };

    const agregarHorarioPersonalizado = () => {
        setCursoPersonalizado(prev => ({
            ...prev,
            horarios: [...prev.horarios, { dia: 'Lunes', horaInicio: '07:30', horaFin: '09:15' }]
        }));
    };

    const eliminarHorarioPersonalizado = (index) => {
        if (cursoPersonalizado.horarios.length > 1) {
            setCursoPersonalizado(prev => ({
                ...prev,
                horarios: prev.horarios.filter((_, i) => i !== index)
            }));
        }
    };

    const actualizarHorarioPersonalizado = (index, campo, valor) => {
        setCursoPersonalizado(prev => ({
            ...prev,
            horarios: prev.horarios.map((horario, i) =>
                i === index ? { ...horario, [campo]: valor } : horario
            )
        }));
    };

    const handleGuardarCurso = () => {
        if (!cursoPersonalizado.nombre.trim()) {
            if (onError) onError('El nombre del curso es obligatorio.');
            return;
        }

        if (!cursoPersonalizado.seccion.trim()) {
            if (onError) onError('La sección es obligatoria.');
            return;
        }

        if (!cursoPersonalizado.profesor.trim()) {
            if (onError) onError('El nombre del profesor es obligatorio.');
            return;
        }

        const horariosGenerados = [];
        cursoPersonalizado.horarios.forEach(horarioConfig => {
            const horariosDelBloque = generarHorariosAutomaticos(
                horarioConfig.dia,
                horarioConfig.horaInicio,
                horarioConfig.horaFin
            );
            horariosGenerados.push(...horariosDelBloque);
        });

        const cursoData = {
            nombre: cursoPersonalizado.nombre,
            seccion: cursoPersonalizado.seccion,
            profesor: cursoPersonalizado.profesor,
            aula: cursoPersonalizado.aula || 'Por definir',
            creditos: parseInt(cursoPersonalizado.creditos),
            horarios: horariosGenerados
        };

        const resultado = onAgregarCurso(cursoData);

        if (resultado && resultado.success) {
            limpiarCursoPersonalizado();
            onClose();
        }
    };

    const handleClose = () => {
        limpiarCursoPersonalizado();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="2xl"
            placement="center"
            scrollBehavior="inside"
        >
            <ModalContent>
                <ModalHeader className="flex gap-1 items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                        <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    Agregar Curso Personalizado
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-4">
                        {/* Información básica del curso */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Nombre del Curso"
                                placeholder="Ej: Cálculo"
                                value={cursoPersonalizado.nombre}
                                onValueChange={(value) => setCursoPersonalizado(prev => ({ ...prev, nombre: value }))}
                                variant="bordered"
                                isRequired
                            />
                            <Select
                                label="Sección"
                                selectedKeys={[cursoPersonalizado.seccion]}
                                onSelectionChange={(keys) => {
                                    const selectedSection = Array.from(keys)[0];
                                    if (selectedSection) {
                                        setCursoPersonalizado(prev => ({ ...prev, seccion: selectedSection }));
                                    }
                                }}
                                variant="bordered"
                                placeholder="Selecciona una sección"
                                isRequired
                            >
                                {Array.from({ length: 10 }, (_, i) => {
                                    const seccion = `S-${String(i + 1).padStart(3, '0')}`;
                                    return (
                                        <SelectItem key={seccion} value={seccion}>
                                            {seccion}
                                        </SelectItem>
                                    );
                                })}
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="Profesor"
                                placeholder="Nombre del profesor"
                                value={cursoPersonalizado.profesor}
                                onValueChange={(value) => setCursoPersonalizado(prev => ({ ...prev, profesor: value }))}
                                variant="bordered"
                                isRequired
                            />
                            <Input
                                label="Aula"
                                placeholder="Ej: A-101"
                                value={cursoPersonalizado.aula}
                                onValueChange={(value) => setCursoPersonalizado(prev => ({ ...prev, aula: value }))}
                                variant="bordered"
                            />
                            <Select
                                label="Créditos"
                                selectedKeys={[cursoPersonalizado.creditos]}
                                onSelectionChange={(keys) => {
                                    const selectedCredits = Array.from(keys)[0];
                                    if (selectedCredits) {
                                        setCursoPersonalizado(prev => ({ ...prev, creditos: selectedCredits }));
                                    }
                                }}
                                variant="bordered"
                                placeholder="Selecciona créditos"
                                isRequired
                            >
                                {Array.from({ length: 5 }, (_, i) => {
                                    const credito = String(i + 1);
                                    return (
                                        <SelectItem key={credito} value={credito}>
                                            {credito}
                                        </SelectItem>
                                    );
                                })}
                            </Select>
                        </div>

                        {/* Horarios */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-lg font-semibold text-gray-800">Horarios</h4>
                                <Button
                                    onClick={agregarHorarioPersonalizado}
                                    color="success"
                                    variant="flat"
                                    size="sm"
                                    startContent={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    }
                                >
                                    Agregar Horario
                                </Button>
                            </div>

                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                {cursoPersonalizado.horarios.map((horario, index) => (
                                    <div key={index} className="flex flex-col gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                            {/* Los tres selects */}
                                            <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                                                <div className="flex-1 min-w-0">
                                                    <Select
                                                        label="Día"
                                                        selectedKeys={[horario.dia]}
                                                        onSelectionChange={(keys) => {
                                                            const selectedDay = Array.from(keys)[0];
                                                            if (selectedDay) {
                                                                actualizarHorarioPersonalizado(index, 'dia', selectedDay);
                                                            }
                                                        }}
                                                        size="sm"
                                                        variant="bordered"
                                                        disallowEmptySelection
                                                    >
                                                        {diasSemana.map((dia) => (
                                                            <SelectItem key={dia} value={dia}>
                                                                {dia}
                                                            </SelectItem>
                                                        ))}
                                                    </Select>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <Select
                                                        label="Hora Inicio"
                                                        selectedKeys={[horario.horaInicio]}
                                                        onSelectionChange={(keys) => {
                                                            const selectedTime = Array.from(keys)[0];
                                                            if (selectedTime) {
                                                                actualizarHorarioPersonalizado(index, 'horaInicio', selectedTime);
                                                            }
                                                        }}
                                                        size="sm"
                                                        variant="bordered"
                                                        disallowEmptySelection
                                                    >
                                                        {horasInicio.map((hora) => (
                                                            <SelectItem key={hora} value={hora}>
                                                                {hora}
                                                            </SelectItem>
                                                        ))}
                                                    </Select>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <Select
                                                        label="Hora Fin"
                                                        selectedKeys={[horario.horaFin]}
                                                        onSelectionChange={(keys) => {
                                                            const selectedTime = Array.from(keys)[0];
                                                            if (selectedTime) {
                                                                actualizarHorarioPersonalizado(index, 'horaFin', selectedTime);
                                                            }
                                                        }}
                                                        size="sm"
                                                        variant="bordered"
                                                        disallowEmptySelection
                                                    >
                                                        {horasFin.map((hora) => (
                                                            <SelectItem key={hora} value={hora}>
                                                                {hora}
                                                            </SelectItem>
                                                        ))}
                                                    </Select>
                                                </div>
                                            </div>

                                            {/* Botón de eliminar */}
                                            {cursoPersonalizado.horarios.length > 1 && (
                                                <div className="flex justify-center sm:justify-center w-full sm:w-auto mt-2 sm:mt-0">
                                                    <Button
                                                        onClick={() => eliminarHorarioPersonalizado(index)}
                                                        color="danger"
                                                        size="sm"
                                                        variant="light"
                                                        className="shrink-0 w-full sm:w-auto"
                                                        startContent={
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        }
                                                    >
                                                        <span className="sm:hidden">Eliminar Horario</span>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>


                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="danger"
                        variant="light"
                        onPress={handleClose}
                    >
                        Cancelar
                    </Button>
                    <Button color="primary" onPress={handleGuardarCurso}>
                        Agregar Curso
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalAgregarCurso;
