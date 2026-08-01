"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useOverlayState } from "@heroui/react";
import { useTheme } from "next-themes";

import { CarreraProvider } from "./CarreraContext";
import { Carrera } from "@/data";

import AppHeader from "@/components/header/AppHeader";
import EncabezadoHorario from "@/components/header/EncabezadoHorario";
import TablaHorario from "@/components/horario/TablaHorario";
import PanelCursos from "@/components/cursos/PanelCursos";

import { ConflictModal, SuccessModal, ErrorModal, ModalAgregarCurso } from "@/components/modales";
import ConfigDrawer from "@/components/configdrawer/ConfigDrawer";
const ModalNota = dynamic(() => import("@/components/modales/ModalNota"), { ssr: false });
const ShareModal = dynamic(() => import("@/components/modales/ShareModal"), { ssr: false });

import { useHorarios } from "@/hooks/useHorarios";
import { useNotas } from "@/hooks/useNotas";
import { usePaleta } from "@/hooks/usePaleta";
import { useCursos } from "@/hooks/useCursos";
import { useExcel } from "@/hooks/useExcel";
import { useCompartir } from "@/hooks/useCompartir";
import { ConfigHorarioProvider } from "@/hooks/useConfigHorario";

import { diasSemana } from "@/lib/horario";

export default function HorarioApp({ carrera }: { carrera: Carrera }) {
    return (
        <CarreraProvider carrera={carrera}>
            <ConfigHorarioProvider>
                <HorarioAppInner />
            </ConfigHorarioProvider>
        </CarreraProvider>
    );
}

function HorarioAppInner() {
    const { resolvedTheme } = useTheme();

    const horarios = useHorarios();
    const notas = useNotas(horarios.horarioActivo);
    const paleta = usePaleta({
        cursosSeleccionados: horarios.cursosSeleccionados,
        horarioPersonal: horarios.horarioPersonal,
        setColoresAsignados: horarios.setColoresAsignados,
    });

    const [mensajeModal, setMensajeModal] = useState('');
    const [celdaSeleccionada, setCeldaSeleccionada] = useState<string | null>(null);

    const conflictModal = useOverlayState();
    const successModal = useOverlayState();
    const errorModal = useOverlayState();
    const addCourseModal = useOverlayState();
    const shareModal = useOverlayState();
    const noteModal = useOverlayState();
    const configDrawer = useOverlayState();

    const limpiarHorario = () => {
        horarios.limpiarHorarioActual();
        notas.limpiarNotasActivas();
    };

    const excel = useExcel({
        limpiarHorarioActual: limpiarHorario,
        setMensajeModal,
        onError: errorModal.open,
    });

    const cursos = useCursos({
        horarioPersonal: horarios.horarioPersonal,
        setHorarioPersonal: horarios.setHorarioPersonal,
        cursosSeleccionados: horarios.cursosSeleccionados,
        setCursosSeleccionados: horarios.setCursosSeleccionados,
        coloresAsignados: horarios.coloresAsignados,
        setColoresAsignados: horarios.setColoresAsignados,
        coloresActuales: paleta.coloresActuales,
        obtenerHorariosPorCurso: excel.obtenerHorariosPorCurso,
        onConflicto: conflictModal.open,
        onExito: successModal.open,
        setMensajeModal,
    });

    const compartir = useCompartir({
        horarioActivo: horarios.horarioActivo,
        resolvedTheme: resolvedTheme ?? 'light',
        onAbrirModal: shareModal.open,
        setMensajeModal,
        onExito: successModal.open,
        onError: errorModal.open,
    });

    const abrirModalNota = (key: string) => {
        setCeldaSeleccionada(key);
        noteModal.open();
    };

    const guardarNota = (datos: any) => {
        if (celdaSeleccionada) {
            notas.guardarNota(celdaSeleccionada, datos, noteModal.close);
        }
    };

    const [isDraggingFileOnWindow, setIsDraggingFileOnWindow] = useState(false);

    useEffect(() => {
        const handleDragOver = (e: DragEvent) => {
            if (e.dataTransfer?.types?.includes('Files')) {
                e.preventDefault();
                setIsDraggingFileOnWindow(true);
            }
        };

        const handleDragLeave = (e: DragEvent) => {
            if (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
                setIsDraggingFileOnWindow(false);
            }
        };

        const handleDragEnd = () => {
            setIsDraggingFileOnWindow(false);
        };

        const handleDrop = (e: DragEvent) => {
            // Garantizar que el overlay se oculte siempre al soltar cualquier archivo
            setIsDraggingFileOnWindow(false);

            if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
                const files = Array.from(e.dataTransfer.files);
                const tieneExcel = files.some(f => f.name.endsWith('.xlsx') || f.name.endsWith('.xls') || f.name.endsWith('.csv'));
                if (tieneExcel) {
                    e.preventDefault();
                    excel.cargarArchivos(files);
                }
            }
        };

        window.addEventListener('dragover', handleDragOver);
        window.addEventListener('dragleave', handleDragLeave);
        window.addEventListener('dragend', handleDragEnd);
        window.addEventListener('drop', handleDrop);

        return () => {
            window.removeEventListener('dragover', handleDragOver);
            window.removeEventListener('dragleave', handleDragLeave);
            window.removeEventListener('dragend', handleDragEnd);
            window.removeEventListener('drop', handleDrop);
        };
    }, [excel]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background p-2 md:p-4 relative">
            {/* Overlay visual al arrastrar archivos sobre la ventana */}
            {isDraggingFileOnWindow && (
                <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm border-4 border-dashed border-accent flex flex-col items-center justify-center p-6 text-center pointer-events-none">
                    <div className="bg-accent text-surface rounded-full p-6 mb-4 animate-bounce">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">¡Suelta los archivos Excel aquí!</h2>
                </div>
            )}

            <div className="max-w-[1800px] mx-auto">
                {/* Encabezado superior con título y carga de Excel */}
                <AppHeader
                    nombreArchivo={excel.nombreArchivo}
                    nombreArchivoTalleres={excel.nombreArchivoTalleres}
                    nombreArchivoElectivos={excel.nombreArchivoElectivos}
                    cargandoArchivo={excel.cargandoArchivo}
                    onCargaArchivo={excel.manejarCargaArchivo}
                />

                {/* Layout principal */}
                <div className="flex flex-col lg:flex-row gap-3 md:gap-6">
                    {/* Tabla de horario */}
                    <div className="order-2 lg:order-2 min-w-0 flex-1 bg-surface rounded-2xl shadow-md p-3 md:p-6">
                        <EncabezadoHorario
                            horarioActivo={horarios.horarioActivo}
                            creditosTotales={horarios.creditosTotales}
                            cambiarHorario={horarios.cambiarHorario}
                            limpiarHorario={limpiarHorario}
                            abrirShareModal={compartir.abrirShareModal}
                            abrirConfigDrawer={configDrawer.open}
                        />
                        <h3 className="text-sm md:text-base text-muted mb-3 md:mb-4">
                            Pulsa en un espacio en blanco para agregar un texto al horario.
                        </h3>
                        <TablaHorario
                            horarioPersonal={horarios.horarioPersonal}
                            coloresAsignados={horarios.coloresAsignados}
                            coloresActuales={paleta.coloresActuales}
                            notasCelda={notas.notasCelda}
                            onRemover={cursos.removerDelHorario}
                            onDragOver={cursos.handleDragOver}
                            onDrop={cursos.handleDrop}
                            onAbrirNota={abrirModalNota}
                            onQuitarNota={notas.quitarNota}
                        />
                    </div>

                    {/* Panel lateral de cursos */}
                    <div className="order-1 lg:order-1 w-full lg:w-80 relative">
                        <div className="lg:absolute lg:inset-0">
                            <PanelCursos
                                cicloSeleccionado={cursos.cicloSeleccionado}
                                setCicloSeleccionado={cursos.setCicloSeleccionado}
                                cursosSeleccionados={horarios.cursosSeleccionados}
                                nombreArchivo={excel.nombreArchivo}
                                cargandoArchivo={excel.cargandoArchivo}
                                obtenerHorariosPorCurso={excel.obtenerHorariosPorCurso}
                                onAgregarCurso={cursos.agregarCursoAlHorario}
                                onRemoverCurso={cursos.removerCursoPorId}
                                onDragStart={cursos.handleDragStart}
                                onAbrirModalCursoPersonalizado={addCourseModal.open}
                                onCargaArchivo={excel.manejarCargaArchivo}
                                onCargaTalleres={excel.manejarCargaTalleres}
                                onCargaElectivos={excel.manejarCargaElectivos}
                                onCargaArchivosDirectos={excel.cargarArchivos}
                                cargandoTalleres={excel.cargandoTalleres}
                                cargandoElectivos={excel.cargandoElectivos}
                                nombreArchivoTalleres={excel.nombreArchivoTalleres}
                                nombreArchivoElectivos={excel.nombreArchivoElectivos}
                            />
                        </div>
                    </div>
                </div>

                {/* Pie de página */}
                <h3 className="text-xs md:text-sm text-foreground-500 text-center mt-4 md:mt-6">
                    Creado por{' '}
                    <a className="hover:underline" target="_blank" rel="noopener noreferrer" href="https://finanfix.wordpress.com/">
                        Paolo
                    </a>
                </h3>

                <ConflictModal
                    isOpen={conflictModal.isOpen}
                    onClose={conflictModal.close}
                    conflictoInfo={cursos.conflictoInfo}
                />
                <SuccessModal
                    isOpen={successModal.isOpen}
                    onClose={successModal.close}
                    mensaje={mensajeModal}
                />
                <ErrorModal
                    isOpen={errorModal.isOpen}
                    onClose={errorModal.close}
                    mensaje={mensajeModal}
                />
                <ShareModal
                    isOpen={shareModal.isOpen}
                    onClose={shareModal.close}
                    dataUrl={compartir.shareDataUrl}
                    onCopy={compartir.copiarImagen}
                    onDownload={compartir.descargarImagen}
                    filename={compartir.shareFilename}
                    horarioPersonal={horarios.horarioPersonal}
                    notasCelda={notas.notasCelda}
                    horarioActivo={horarios.horarioActivo}
                />
                <ModalNota
                    isOpen={noteModal.isOpen}
                    onClose={noteModal.close}
                    onSave={guardarNota}
                    instanceKey={celdaSeleccionada}
                    textoDefault={celdaSeleccionada ? (notas.notasCelda[celdaSeleccionada]?.texto ?? '') : ''}
                    colorDefault={celdaSeleccionada ? (notas.notasCelda[celdaSeleccionada]?.color ?? '#fde68a') : '#fde68a'}
                    textColorDefault={celdaSeleccionada ? (notas.notasCelda[celdaSeleccionada]?.textColor ?? '#111827') : '#111827'}
                />
                <ModalAgregarCurso
                    isOpen={addCourseModal.isOpen}
                    onClose={addCourseModal.close}
                    onAgregarCurso={cursos.manejarAgregarPersonalizado}
                    onError={(msg: string) => { setMensajeModal(msg); errorModal.open(); }}
                    diasSemana={diasSemana}
                />
                <ConfigDrawer
                    isOpen={configDrawer.isOpen}
                    onClose={configDrawer.close}
                    paletaSeleccionada={paleta.paletaSeleccionada}
                    coloresActuales={paleta.coloresActuales}
                    cambiarPaleta={paleta.cambiarPaleta}
                />
            </div>
        </div>
    );
}
