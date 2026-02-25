import { useState, useCallback } from 'react';
import { obtenerColorPorOrden, reasignarColores } from '@/lib/colores';

/**
 * Lógica de negocio para agregar/remover cursos del horario,
 * detección de conflictos y drag & drop.
 */
export function useCursos({
    horarioPersonal, setHorarioPersonal,
    cursosSeleccionados, setCursosSeleccionados,
    coloresAsignados, setColoresAsignados,
    coloresActuales,
    obtenerHorariosPorCurso,
    onConflicto,
    onExito,
    setMensajeModal,
}) {
    const [cicloSeleccionado, setCicloSeleccionado] = useState('Cuarto Ciclo');
    const [draggedItem, setDraggedItem] = useState(null);
    const [conflictoInfo, setConflictoInfo] = useState({ cursoExistente: '', cursoNuevo: '' });

    const detectarConflictos = useCallback((horarioItems) => {
        return horarioItems
            .filter(({ dia, horario }) => Boolean(horarioPersonal[`${dia}-${horario}`]))
            .map(({ dia, horario }) => ({
                dia, horario,
                cursoExistente: horarioPersonal[`${dia}-${horario}`].curso,
                seccionExistente: horarioPersonal[`${dia}-${horario}`].seccion,
            }));
    }, [horarioPersonal]);

    const abrirConflicto = useCallback((cursoNuevo, conflictos) => {
        setConflictoInfo({
            cursoNuevo,
            cursoExistente: `${conflictos[0].cursoExistente} (${conflictos[0].seccionExistente})`,
            detallesConflicto: conflictos,
        });
        onConflicto?.();
    }, [onConflicto]);

    const agregarCursoAlHorario = useCallback((item) => {
        if (cursosSeleccionados.has(item.id)) return;

        const cursosData = obtenerHorariosPorCurso(item.curso);
        const seccion = cursosData.find(s => s.id === item.id);
        if (!seccion) return;

        const conflictos = detectarConflictos(seccion.horarios);
        if (conflictos.length > 0) {
            abrirConflicto(`${item.curso} (${item.seccion})`, conflictos);
            return;
        }

        const color = obtenerColorPorOrden(item.id, coloresAsignados, coloresActuales);
        setColoresAsignados(prev => new Map(prev).set(item.id, color));

        const nuevoHorario = { ...horarioPersonal };
        seccion.horarios.forEach(({ dia, horario, aula }) => {
            nuevoHorario[`${dia}-${horario}`] = { ...item, aula, diaOriginal: dia, horarioOriginal: horario };
        });
        setHorarioPersonal(nuevoHorario);
        setCursosSeleccionados(prev => new Set([...prev, item.id]));
    }, [cursosSeleccionados, obtenerHorariosPorCurso, horarioPersonal, coloresAsignados, coloresActuales,
        detectarConflictos, abrirConflicto, setColoresAsignados, setHorarioPersonal, setCursosSeleccionados]);

    const removerDelHorario = useCallback((dia, horario) => {
        const clase = horarioPersonal[`${dia}-${horario}`];
        if (!clase?.id) return;

        const nuevoHorario = Object.fromEntries(
            Object.entries(horarioPersonal).filter(([, v]) => v.id !== clase.id)
        );
        const nuevosCursos = new Set([...cursosSeleccionados].filter(id => id !== clase.id));

        setHorarioPersonal(nuevoHorario);
        setCursosSeleccionados(nuevosCursos);
        setColoresAsignados(reasignarColores(nuevosCursos, nuevoHorario, coloresActuales));
    }, [horarioPersonal, cursosSeleccionados, coloresActuales,
        setHorarioPersonal, setCursosSeleccionados, setColoresAsignados]);

    const removerCursoPorId = useCallback((id) => {
        const nuevoHorario = Object.fromEntries(
            Object.entries(horarioPersonal).filter(([, v]) => v.id !== id)
        );
        const nuevosCursos = new Set([...cursosSeleccionados].filter(cid => cid !== id));

        setHorarioPersonal(nuevoHorario);
        setCursosSeleccionados(nuevosCursos);
        setColoresAsignados(reasignarColores(nuevosCursos, nuevoHorario, coloresActuales));
    }, [horarioPersonal, cursosSeleccionados, coloresActuales,
        setHorarioPersonal, setCursosSeleccionados, setColoresAsignados]);

    const manejarAgregarPersonalizado = useCallback((cursoData) => {
        const conflictos = detectarConflictos(cursoData.horarios);
        if (conflictos.length > 0) {
            abrirConflicto(`${cursoData.nombre} (${cursoData.seccion})`, conflictos);
            return { error: 'Conflicto de horarios' };
        }

        const id = `personalizado-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const item = { id, curso: cursoData.nombre, profesor: cursoData.profesor, seccion: cursoData.seccion };

        const color = obtenerColorPorOrden(id, coloresAsignados, coloresActuales);
        setColoresAsignados(prev => new Map(prev).set(id, color));

        const nuevoHorario = { ...horarioPersonal };
        cursoData.horarios.forEach(({ dia, horario }) => {
            nuevoHorario[`${dia}-${horario}`] = {
                ...item, aula: cursoData.aula, creditos: cursoData.creditos,
                diaOriginal: dia, horarioOriginal: horario,
            };
        });
        setHorarioPersonal(nuevoHorario);
        setCursosSeleccionados(prev => new Set([...prev, id]));

        setMensajeModal?.('¡Curso personalizado agregado exitosamente!');
        onExito?.();
        return { success: true };
    }, [horarioPersonal, coloresAsignados, coloresActuales, detectarConflictos, abrirConflicto,
        setColoresAsignados, setHorarioPersonal, setCursosSeleccionados, setMensajeModal, onExito]);

    const handleDragStart = useCallback((e, item) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        if (draggedItem) {
            agregarCursoAlHorario(draggedItem);
            setDraggedItem(null);
        }
    }, [draggedItem, agregarCursoAlHorario]);

    return {
        cicloSeleccionado, setCicloSeleccionado,
        conflictoInfo,
        agregarCursoAlHorario,
        removerDelHorario,
        removerCursoPorId,
        manejarAgregarPersonalizado,
        handleDragStart, handleDragOver, handleDrop,
    };
}
