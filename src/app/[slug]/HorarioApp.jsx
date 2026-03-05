"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useDisclosure } from "@heroui/use-disclosure";
import { useTheme } from "next-themes";

import { CarreraProvider } from "./CarreraContext";

import AppHeader from "@/components/header/AppHeader";
import EncabezadoHorario from "@/components/header/EncabezadoHorario";
import TablaHorario from "@/components/horario/TablaHorario";
import PanelCursos from "@/components/cursos/PanelCursos";

import { ConflictModal, SuccessModal, ErrorModal, ModalAgregarCurso } from "@/components/modales";
import ConfigDrawer from "@/components/modales/ConfigDrawer";
import ChifaPromo from "@/components/chifa/ChifaPromo";
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

export default function HorarioApp({ carrera }) {
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
    const [celdaSeleccionada, setCeldaSeleccionada] = useState(null);

    const conflictModal = useDisclosure();
    const successModal = useDisclosure();
    const errorModal = useDisclosure();
    const addCourseModal = useDisclosure();
    const shareModal = useDisclosure();
    const noteModal = useDisclosure();
    const configDrawer = useDisclosure();

    const limpiarHorario = () => {
        horarios.limpiarHorarioActual();
        notas.limpiarNotasActivas();
    };

    const limpiarTodosLosHorarios = () => {
        horarios.limpiarTodosLosHorarios();
        notas.limpiarTodasLasNotas();
    };

    const excel = useExcel({
        limpiarHorarioActual: limpiarHorario,
        setMensajeModal,
        onExito: successModal.onOpen,
        onError: errorModal.onOpen,
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
        onConflicto: conflictModal.onOpen,
        onExito: successModal.onOpen,
        setMensajeModal,
    });

    const compartir = useCompartir({
        horarioActivo: horarios.horarioActivo,
        resolvedTheme,
        onAbrirModal: shareModal.onOpen,
        setMensajeModal,
        onExito: successModal.onOpen,
        onError: errorModal.onOpen,
    });

    const abrirModalNota = (key) => {
        setCeldaSeleccionada(key);
        noteModal.onOpen();
    };

    const guardarNota = (datos) => {
        notas.guardarNota(celdaSeleccionada, datos, noteModal.onClose);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background p-2 md:p-4">
            <div className="max-w-[1800px] mx-auto">
                {/* Encabezado superior con título y carga de Excel */}
                <AppHeader
                    nombreArchivo={excel.nombreArchivo}
                    nombreArchivoTalleres={excel.nombreArchivoTalleres}
                    cargandoArchivo={excel.cargandoArchivo}
                    onCargaArchivo={excel.manejarCargaArchivo}
                />

                {/* Layout principal */}
                <div className="flex flex-col lg:flex-row gap-3 md:gap-6">
                    {/* Tabla de horario */}
                    <div className="order-2 lg:order-2 min-w-0 flex-1 bg-content1 rounded-lg shadow-md p-3 md:p-6">
                        <EncabezadoHorario
                            horarioActivo={horarios.horarioActivo}
                            creditosTotales={horarios.creditosTotales}
                            cambiarHorario={horarios.cambiarHorario}
                            limpiarHorario={limpiarHorario}
                            abrirShareModal={compartir.abrirShareModal}
                            abrirConfigDrawer={configDrawer.onOpen}
                        />
                        <h3 className="text-sm md:text-base text-foreground-500 mb-3 md:mb-4">
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

                    {/* Panel lateral de cursos – wrapper para que la tabla dicte la altura */}
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
                                onAbrirModalCursoPersonalizado={addCourseModal.onOpen}
                                onCargaArchivo={excel.manejarCargaArchivo}
                                onCargaTalleres={excel.manejarCargaTalleres}
                                cargandoTalleres={excel.cargandoTalleres}
                                nombreArchivoTalleres={excel.nombreArchivoTalleres}
                            />
                        </div>
                    </div>
                </div>

                {/* Promo Chifa la Unión */}
                <ChifaPromo />

                {/* Pie de página */}
                <h3 className="text-xs md:text-sm text-foreground-500 text-center mt-4 md:mt-6">
                    Creado por{' '}
                    <a className="hover:underline" target="_blank" rel="noopener noreferrer" href="https://finanfix.wordpress.com/">
                        Paolo
                    </a>
                </h3>

                <ConflictModal
                    isOpen={conflictModal.isOpen}
                    onClose={conflictModal.onClose}
                    conflictoInfo={cursos.conflictoInfo}
                />
                <SuccessModal
                    isOpen={successModal.isOpen}
                    onClose={successModal.onClose}
                    mensaje={mensajeModal}
                />
                <ErrorModal
                    isOpen={errorModal.isOpen}
                    onClose={errorModal.onClose}
                    mensaje={mensajeModal}
                />
                <ShareModal
                    isOpen={shareModal.isOpen}
                    onClose={shareModal.onClose}
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
                    onClose={noteModal.onClose}
                    onSave={guardarNota}
                    instanceKey={celdaSeleccionada}
                    textoDefault={celdaSeleccionada ? (notas.notasCelda[celdaSeleccionada]?.texto ?? '') : ''}
                    colorDefault={celdaSeleccionada ? (notas.notasCelda[celdaSeleccionada]?.color ?? '#fde68a') : '#fde68a'}
                    textColorDefault={celdaSeleccionada ? (notas.notasCelda[celdaSeleccionada]?.textColor ?? '#111827') : '#111827'}
                />
                <ModalAgregarCurso
                    isOpen={addCourseModal.isOpen}
                    onClose={addCourseModal.onClose}
                    onAgregarCurso={cursos.manejarAgregarPersonalizado}
                    onError={(msg) => { setMensajeModal(msg); errorModal.onOpen(); }}
                    diasSemana={diasSemana}
                />
                <ConfigDrawer
                    isOpen={configDrawer.isOpen}
                    onClose={configDrawer.onClose}
                    paletaSeleccionada={paleta.paletaSeleccionada}
                    coloresActuales={paleta.coloresActuales}
                    cambiarPaleta={paleta.cambiarPaleta}
                />
            </div>
        </div>
    );
}
