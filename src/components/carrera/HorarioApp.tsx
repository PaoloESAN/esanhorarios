import { useState, lazy, Suspense } from "react";
import { useOverlayState, useTheme } from "@heroui/react";

import { CarreraProvider } from "./CarreraContext";
import { Carrera } from "@/data";

import AppHeader from "@/components/header/AppHeader";
import EncabezadoHorario from "@/components/header/EncabezadoHorario";
import TablaHorario from "@/components/horario/TablaHorario";
import PanelCursos from "@/components/cursos/PanelCursos";

import { ConflictModal, SuccessModal, ErrorModal, ModalAgregarCurso } from "@/components/modales";
import ConfigDrawer from "@/components/modales/ConfigDrawer";
import ChifaPromo from "@/components/chifa/ChifaPromo";

const ModalNota = lazy(() => import("@/components/modales/ModalNota"));
const ShareModal = lazy(() => import("@/components/modales/ShareModal"));

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
    const { theme } = useTheme();
    const resolvedTheme = theme === 'system'
        ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;

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
        onExito: successModal.open,
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
                    <div className="order-2 lg:order-2 min-w-0 flex-1 bg-surface rounded-lg shadow-md p-3 md:p-6">
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
                <Suspense fallback={null}>
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
                </Suspense>
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
