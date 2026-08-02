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
    horarioPersonal: Record<string, CursoItem | CursoItem[]>;
    setHorarioPersonal: React.Dispatch<React.SetStateAction<Record<string, any>>>;
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

export function detectarHayConflicto(horarioPersonal: Record<string, CursoItem | CursoItem[]>): boolean {
    if (!horarioPersonal) return false;
    return Object.values(horarioPersonal).some(val => {
        if (!val) return false;
        if (Array.isArray(val)) return val.length > 1;
        return false;
    });
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

    const hayConflicto = detectarHayConflicto(horarioPersonal);

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

        const color = obtenerColorPorOrden(item.id, coloresAsignados, coloresActuales);
        setColoresAsignados(prev => {
            const next = new Map(prev);
            next.set(item.id, color);
            return next;
        });

        const nuevoHorario: Record<string, any> = { ...horarioPersonal };
        seccion.horarios.forEach(({ dia, horario, aula }: any) => {
            const key = `${dia}-${horario}`;
            const prevVal = nuevoHorario[key];
            const prevArray: CursoItem[] = Array.isArray(prevVal) ? prevVal : (prevVal ? [prevVal] : []);
            const nuevoItem: CursoItem = { ...item, aula, diaOriginal: dia, horarioOriginal: horario };

            if (!prevArray.some(c => c.id === item.id)) {
                const arr = [...prevArray, nuevoItem];
                nuevoHorario[key] = arr.length === 1 ? arr[0] : arr;
            }
        });
        setHorarioPersonal(nuevoHorario);
        setCursosSeleccionados(prev => new Set([...prev, item.id]));
    };

    const removerCursoPorId = (id: string) => {
        const nuevoHorario: Record<string, any> = {};
        for (const [key, val] of Object.entries(horarioPersonal)) {
            if (!val) continue;
            if (Array.isArray(val)) {
                const filtrado = val.filter(c => c.id !== id);
                if (filtrado.length === 1) {
                    nuevoHorario[key] = filtrado[0];
                } else if (filtrado.length > 1) {
                    nuevoHorario[key] = filtrado;
                }
            } else if ((val as CursoItem).id !== id) {
                nuevoHorario[key] = val;
            }
        }
        const nuevosCursos = new Set([...cursosSeleccionados].filter(cid => cid !== id));

        setHorarioPersonal(nuevoHorario);
        setCursosSeleccionados(nuevosCursos);
        setColoresAsignados(reasignarColores(nuevosCursos, nuevoHorario, coloresActuales));
    };

    const removerDelHorario = (dia: string, horario: string, cursoId?: string) => {
        const key = `${dia}-${horario}`;
        const val = horarioPersonal[key];
        if (!val) return;

        let targetId = cursoId;
        if (!targetId) {
            const arr = Array.isArray(val) ? val : [val];
            if (arr.length > 0) targetId = arr[0].id;
        }

        if (targetId) {
            removerCursoPorId(targetId);
        }
    };

    const manejarAgregarPersonalizado = (cursoData: any) => {
        const id = `personalizado-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const item: CursoItem = { id, curso: cursoData.nombre, profesor: cursoData.profesor, seccion: cursoData.seccion };

        const color = obtenerColorPorOrden(id, coloresAsignados, coloresActuales);
        setColoresAsignados(prev => {
            const next = new Map(prev);
            next.set(id, color);
            return next;
        });

        const nuevoHorario: Record<string, any> = { ...horarioPersonal };
        cursoData.horarios.forEach(({ dia, horario }: any) => {
            const key = `${dia}-${horario}`;
            const prevVal = nuevoHorario[key];
            const prevArray: CursoItem[] = Array.isArray(prevVal) ? prevVal : (prevVal ? [prevVal] : []);
            const nuevoItem: CursoItem = {
                ...item, aula: cursoData.aula, creditos: cursoData.creditos,
                diaOriginal: dia, horarioOriginal: horario,
            };
            if (!prevArray.some(c => c.id === id)) {
                const arr = [...prevArray, nuevoItem];
                nuevoHorario[key] = arr.length === 1 ? arr[0] : arr;
            }
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
        hayConflicto,
        agregarCursoAlHorario,
        removerDelHorario,
        removerCursoPorId,
        manejarAgregarPersonalizado,
        handleDragStart, handleDragOver, handleDrop,
    };
}
