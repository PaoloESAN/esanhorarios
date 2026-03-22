"use client";

import { useState } from "react";
import { Button, Select, Label, ListBox, Modal, Input, TextField } from "@heroui/react";
import { Plus, Trash2 } from 'lucide-react';

function FormSelect({ label, placeholder, value, onChange, options }) {
    return (
        <Select
            value={value}
            onChange={(nextValue) => {
                if (nextValue) onChange(nextValue);
            }}
            placeholder={placeholder}
            isRequired
        >
            <Label>{label}</Label>
            <Select.Trigger className="border border-divider shadow-sm bg-surface-secondary">
                <Select.Value />
                <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
                <ListBox>
                    {options.map((option) => (
                        <ListBox.Item key={option.value} id={option.value} textValue={option.label}>
                            {option.label}
                            <ListBox.ItemIndicator />
                        </ListBox.Item>
                    ))}
                </ListBox>
            </Select.Popover>
        </Select>
    );
}

function HoraSelect({ label, placeholder, value, onChange, options }) {
    return (
        <Select
            value={value}
            onChange={(nextValue) => {
                if (nextValue) onChange(nextValue);
            }}
            placeholder={placeholder}
            isRequired
        >
            <Label>{label}</Label>
            <Select.Trigger className="border border-divider shadow-sm bg-surface">
                <Select.Value />
                <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
                <ListBox>
                    {options.map((option) => (
                        <ListBox.Item key={option.value} id={option.value} textValue={option.label}>
                            {option.label}
                            <ListBox.ItemIndicator />
                        </ListBox.Item>
                    ))}
                </ListBox>
            </Select.Popover>
        </Select>
    );
}

export default function ModalAgregarCurso({
    isOpen,
    onClose,
    onAgregarCurso,
    diasSemana,
    onError
}) {
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
        const [horaInicioHr] = horaInicio.split(':').map(Number);
        const [horaFinHr] = horaFin.split(':').map(Number);

        for (let hora = horaInicioHr; hora < horaFinHr; hora++) {
            const horarioFormateado = `${hora.toString().padStart(2, '0')}:30-${(hora + 1).toString().padStart(2, '0')}:15`;
            if (!horarios.some(h => h.horario === horarioFormateado)) {
                horarios.push({ dia, horario: horarioFormateado });
            }
        }
        return horarios;
    };

    const limpiarCursoPersonalizado = () => {
        setCursoPersonalizado({
            nombre: '', seccion: 'S-001', profesor: '', aula: '', creditos: '3',
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
            horariosGenerados.push(
                ...generarHorariosAutomaticos(horarioConfig.dia, horarioConfig.horaInicio, horarioConfig.horaFin)
            );
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
        <Modal>
            <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
                <Modal.Container size="lg" placement="center" scroll="inside">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header className="flex gap-1 items-center">
                            <div className="bg-accent-soft rounded-full p-2 mr-3">
                                <Plus className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                            </div>
                            <Modal.Heading className="text-foreground">Agregar Curso Personalizado</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="space-y-4">
                                {/* Información básica */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <TextField name="nombreCurso" isRequired>
                                        <Label>Nombre del Curso</Label>
                                        <Input
                                            placeholder="Ej: Cálculo"
                                            value={cursoPersonalizado.nombre}
                                            onChange={(event) => setCursoPersonalizado(prev => ({ ...prev, nombre: event.target.value }))}
                                            variant="secondary"
                                        />
                                    </TextField>
                                    <FormSelect
                                        label="Sección"
                                        value={cursoPersonalizado.seccion}
                                        onChange={(value) => setCursoPersonalizado(prev => ({ ...prev, seccion: value }))}
                                        placeholder="Selecciona una sección"
                                        options={Array.from({ length: 10 }, (_, i) => {
                                            const seccion = `S-${String(i + 1).padStart(3, '0')}`;
                                            return { value: seccion, label: seccion };
                                        })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <TextField name="profesorCurso" isRequired>
                                        <Label>Profesor</Label>
                                        <Input
                                            placeholder="Nombre del profesor"
                                            value={cursoPersonalizado.profesor}
                                            onChange={(event) => setCursoPersonalizado(prev => ({ ...prev, profesor: event.target.value }))}
                                            variant="secondary"
                                        />
                                    </TextField>
                                    <TextField name="aulaCurso">
                                        <Label>Aula</Label>
                                        <Input
                                            placeholder="Ej: A-101"
                                            value={cursoPersonalizado.aula}
                                            onChange={(event) => setCursoPersonalizado(prev => ({ ...prev, aula: event.target.value }))}
                                            variant="secondary"
                                        />
                                    </TextField>
                                    <FormSelect
                                        label="Créditos"
                                        value={cursoPersonalizado.creditos}
                                        onChange={(value) => setCursoPersonalizado(prev => ({ ...prev, creditos: value }))}
                                        placeholder="Selecciona créditos"
                                        options={Array.from({ length: 5 }, (_, i) => {
                                            const credito = String(i + 1);
                                            return { value: credito, label: credito };
                                        })}
                                    />
                                </div>

                                {/* Horarios */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-lg font-semibold text-foreground">Horarios</h4>
                                        <Button
                                            onPress={agregarHorarioPersonalizado}
                                            variant="secondary"
                                            size="sm"
                                        >
                                            <Plus />
                                            Agregar Horario
                                        </Button>
                                    </div>

                                    <div className="space-y-3 max-h-60 overflow-y-auto">
                                        {cursoPersonalizado.horarios.map((horario, index) => (
                                            <div key={index} className="flex flex-col gap-3 p-3 bg-surface-secondary rounded-lg">
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                                    <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                                                        <div className="flex-1 min-w-0">
                                                            <HoraSelect
                                                                label="Día"
                                                                value={horario.dia}
                                                                onChange={(value) => actualizarHorarioPersonalizado(index, 'dia', value)}
                                                                options={diasSemana.map((dia) => ({ value: dia, label: dia }))}
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <HoraSelect
                                                                label="Hora Inicio"
                                                                value={horario.horaInicio}
                                                                onChange={(value) => actualizarHorarioPersonalizado(index, 'horaInicio', value)}
                                                                options={horasInicio.map((hora) => ({ value: hora, label: hora }))}
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <HoraSelect
                                                                label="Hora Fin"
                                                                value={horario.horaFin}
                                                                onChange={(value) => actualizarHorarioPersonalizado(index, 'horaFin', value)}
                                                                options={horasFin.map((hora) => ({ value: hora, label: hora }))}
                                                            />
                                                        </div>
                                                    </div>

                                                    {cursoPersonalizado.horarios.length > 1 && (
                                                        <div className="flex justify-center sm:justify-center w-full sm:w-auto mt-2 sm:mt-0">
                                                            <Button
                                                                onPress={() => eliminarHorarioPersonalizado(index)}
                                                                variant="danger-soft"
                                                                size="sm"
                                                                className="shrink-0 w-full sm:w-auto"
                                                            >
                                                                <Trash2 size={20} />
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
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger-soft" onPress={handleClose}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onPress={handleGuardarCurso}>
                                Agregar Curso
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
