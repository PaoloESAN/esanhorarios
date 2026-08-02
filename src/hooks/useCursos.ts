import { useState, DragEvent } from 'react';
import { obtenerColorPorOrden, reasignarColores, ColorCelda } from '@/lib/colores';

export interface CursoItem {
    id: string;
    curso: string;
    profesor: string;
    seccion: string;
    aula?: string;
    creditos?: number;
    diaOriginal?: string;
    horarioOriginal?: string;
}

export interface ConflictoDetalle {
    dia: string;
    horario: string;
    cursoExistente: string;
    seccionExistente: string;
}

export interface ConflictoInfo {
    cursoExistente: string;
    cursoNuevo: string;
    detallesConflicto?: ConflictoDetalle[];
}

export interface UseCursosParams {
    horarioPersonal: Record<string, CursoItem>;
    setHorarioPersonal: React.Dispatch<React.SetStateAction<Record<string, CursoItem>>>;
    cursosSeleccionados: Set<string>;
    setCursosSeleccionados: React.Dispatch<React.SetStateAction<Set<string>>>;
    coloresAsignados: Map<string, ColorCelda>;
    setColoresAsignados: React.Dispatch<React.SetStateAction<Map<string, ColorCelda>>>;
    coloresActuales: ColorCelda[];
    obtenerHorariosPorCurso: (curso: string) => any[];
    onConflicto?: () => void;
    onExito?: () => void;
    setMensajeModal?: (msg: string) => void;
}

export function useCursos({
    horarioPersonal, setHorarioPersonal,
    cursosSeleccionados, setCursosSeleccionados,
    coloresAsignados, setColoresAsignados,
    coloresActuales,
    obtenerHorariosPorCurso,
    onConflicto,
    onExito,
    setMensajeModal,
}: UseCursosParams) {
    const [cicloSeleccionado, setCicloSeleccionado] = useState<string>('Primer Ciclo');
    const [draggedItem, setDraggedItem] = useState<CursoItem | null>(null);
    const [conflictoInfo, setConflictoInfo] = useState<ConflictoInfo>({ cursoExistente: '', cursoNuevo: '' });

    const detectarConflictos = (horarioItems: any[]): ConflictoDetalle[] => {
        return horarioItems
            .filter(({ dia, horario }) => Boolean(horarioPersonal[`${dia}-${horario}`]))
            .map(({ dia, horario }) => ({
                dia, horario,
                cursoExistente: horarioPersonal[`${dia}-${horario}`].curso,
                seccionExistente: horarioPersonal[`${dia}-${horario}`].seccion,
            }));
    };

    const abrirConflicto = (cursoNuevo: string, conflictos: ConflictoDetalle[]) => {
        setConflictoInfo({
            cursoNuevo,
            cursoExistente: `${conflictos[0].cursoExistente} (${conflictos[0].seccionExistente})`,
            detallesConflicto: conflictos,
        });
        onConflicto?.();
    };

    const agregarCursoAlHorario = (item: CursoItem) => {
        if (cursosSeleccionados.has(item.id)) return;

        let seccion: any = undefined;
        const cursosData = obtenerHorariosPorCurso(item.curso);
        seccion = cursosData?.find((s: any) => s.id === item.id);

        if (!seccion) {
            const electivosData = obtenerHorariosPorCurso("Electivo");
            seccion = electivosData?.find((s: any) => s.id === item.id);
        }

        if (!seccion) return;

        const conflictos = detectarConflictos(seccion.horarios);
        if (conflictos.length > 0) {
            abrirConflicto(`${item.curso} (${item.seccion})`, conflictos);
            return;
        }

        const color = obtenerColorPorOrden(item.id, coloresAsignados, coloresActuales);
        setColoresAsignados(prev => {
            const next = new Map(prev);
            next.set(item.id, color);
            return next;
        });

        const nuevoHorario = { ...horarioPersonal };
        seccion.horarios.forEach(({ dia, horario, aula }: any) => {
            nuevoHorario[`${dia}-${horario}`] = { ...item, aula, diaOriginal: dia, horarioOriginal: horario };
        });
        setHorarioPersonal(nuevoHorario);
        setCursosSeleccionados(prev => new Set([...prev, item.id]));
    };

    const removerDelHorario = (dia: string, horario: string) => {
        const clase = horarioPersonal[`${dia}-${horario}`];
        if (!clase?.id) return;

        const nuevoHorario = Object.fromEntries(
            Object.entries(horarioPersonal).filter(([, v]) => v.id !== clase.id)
        );
        const nuevosCursos = new Set([...cursosSeleccionados].filter(id => id !== clase.id));

        setHorarioPersonal(nuevoHorario);
        setCursosSeleccionados(nuevosCursos);
        setColoresAsignados(reasignarColores(nuevosCursos, nuevoHorario, coloresActuales));
    };

    const removerCursoPorId = (id: string) => {
        const nuevoHorario = Object.fromEntries(
            Object.entries(horarioPersonal).filter(([, v]) => v.id !== id)
        );
        const nuevosCursos = new Set([...cursosSeleccionados].filter(cid => cid !== id));

        setHorarioPersonal(nuevoHorario);
        setCursosSeleccionados(nuevosCursos);
        setColoresAsignados(reasignarColores(nuevosCursos, nuevoHorario, coloresActuales));
    };

    const manejarAgregarPersonalizado = (cursoData: any) => {
        const conflictos = detectarConflictos(cursoData.horarios);
        if (conflictos.length > 0) {
            abrirConflicto(`${cursoData.nombre} (${cursoData.seccion})`, conflictos);
            return { error: 'Conflicto de horarios' };
        }

        const id = `personalizado-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const item: CursoItem = { id, curso: cursoData.nombre, profesor: cursoData.profesor, seccion: cursoData.seccion };

        const color = obtenerColorPorOrden(id, coloresAsignados, coloresActuales);
        setColoresAsignados(prev => {
            const next = new Map(prev);
            next.set(id, color);
            return next;
        });

        const nuevoHorario = { ...horarioPersonal };
        cursoData.horarios.forEach(({ dia, horario }: any) => {
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
    };

    const handleDragStart = (e: DragEvent<HTMLElement>, item: CursoItem) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: DragEvent<HTMLElement>) => {
        e.preventDefault();
        if (draggedItem) {
            agregarCursoAlHorario(draggedItem);
            setDraggedItem(null);
        }
    };

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
