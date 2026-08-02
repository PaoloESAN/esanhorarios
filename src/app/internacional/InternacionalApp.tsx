"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useOverlayState } from "@heroui/react";

import AppHeader from "@/components/header/AppHeader";
import EncabezadoHorario from "@/components/header/EncabezadoHorario";
import TablaHorario from "@/components/horario/TablaHorario";
import PanelInternacional from "@/components/cursos/PanelInternacional";

import { ConflictModal, SuccessModal, ErrorModal, ModalAgregarCurso, ModalGestionExcels } from "@/components/modales";
import ConfigDrawer from "@/components/configdrawer/ConfigDrawer";
const ModalNota = dynamic(() => import("@/components/modales/ModalNota"), { ssr: false });
const ShareModal = dynamic(() => import("@/components/modales/ShareModal"), { ssr: false });

import { useHorarios } from "@/hooks/useHorarios";
import { useNotas } from "@/hooks/useNotas";
import { usePaleta } from "@/hooks/usePaleta";
import { useCursos, CursoItem } from "@/hooks/useCursos";
import { useExcel } from "@/hooks/useExcel";
import { useCompartir } from "@/hooks/useCompartir";
import { ConfigHorarioProvider } from "@/hooks/useConfigHorario";

import { CarreraProvider } from "@/app/[slug]/CarreraContext";
import { carreraInternacional, obtenerTurnoElectivoInternacional } from "@/data/internacionales";
import { diasSemana } from "@/lib/horario";

export default function InternacionalApp() {
    return (
        <CarreraProvider carrera={carreraInternacional}>
            <ConfigHorarioProvider>
                <InternacionalAppInner />
            </ConfigHorarioProvider>
        </CarreraProvider>
    );
}

function InternacionalAppInner() {
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
    const excelModal = useOverlayState();

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

    const agregarCursoInternacional = (item: CursoItem) => {
        const turnoNuevo = obtenerTurnoElectivoInternacional(item.curso);

        if (turnoNuevo) {
            for (const key of Array.from(horarios.cursosSeleccionados)) {
                const claseInfo = Object.values(horarios.horarioPersonal).find(h => h.id === key);
                if (claseInfo) {
                    const turnoExistente = obtenerTurnoElectivoInternacional(claseInfo.curso);
                    if (turnoExistente === turnoNuevo && claseInfo.curso !== item.curso) {
                        const turnoNombre = turnoNuevo === 'manana' ? 'Turno Mañana (8:30 am - 1:30 pm)' : 'Turno Tarde (4:00 pm - 9:00 pm)';
                        setMensajeModal('Solo puedes seleccionar 1 curso por turno.');
                        errorModal.open();
                        return;
                    }
                }
            }
        }

        cursos.agregarCursoAlHorario(item);
    };

    const compartir = useCompartir({
        horarioActivo: horarios.horarioActivo,
        resolvedTheme: 'light',
        onAbrirModal: shareModal.open,
        setMensajeModal,
        onExito: successModal.open,
        onError: errorModal.open,
    });

    const abrirModalNota = (key: string) => {
        setCeldaSeleccionada(key);
        noteModal.open();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background p-2 md:p-4 relative">
            <div className="max-w-[1800px] mx-auto space-y-4">
                {/* Header Principal */}
                <AppHeader
                    nombreArchivo={excel.nombreArchivo}
                    nombreArchivoTalleres={excel.nombreArchivoTalleres}
                    nombreArchivoElectivos={excel.nombreArchivoElectivos}
                    cargandoArchivo={excel.cargandoArchivo}
                    onCargaArchivo={excel.manejarCargaArchivo}
                    onAbrirModalGestion={excelModal.open}
                />

                {/* Layout Principal (2 Columnas) */}
                <div className="flex flex-col lg:flex-row gap-3 md:gap-6">
                    {/* Columna Derecha: Grilla del Horario */}
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
                            Pulsa en un espacio en blanco para agregar una nota al horario.
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

                    {/* Columna Izquierda: Panel de Cursos Internacionales */}
                    <div className="order-1 lg:order-1 w-full lg:w-96 relative">
                        <PanelInternacional
                            cursosSeleccionados={horarios.cursosSeleccionados}
                            obtenerHorariosPorCurso={excel.obtenerHorariosPorCurso}
                            onAgregarCurso={agregarCursoInternacional}
                            onRemoverCurso={cursos.removerCursoPorId}
                            onDragStart={cursos.handleDragStart}
                        />
                    </div>
                </div>
            </div>

            {/* Modales Overlay */}
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

            <ModalAgregarCurso
                isOpen={addCourseModal.isOpen}
                onClose={addCourseModal.close}
                diasSemana={diasSemana}
                onAgregarCurso={cursos.manejarAgregarPersonalizado}
            />

            <ModalNota
                isOpen={noteModal.isOpen}
                onClose={noteModal.close}
                instanceKey={celdaSeleccionada}
                textoDefault={celdaSeleccionada ? notas.notasCelda[celdaSeleccionada]?.texto : ''}
                colorDefault={celdaSeleccionada ? notas.notasCelda[celdaSeleccionada]?.color : undefined}
                textColorDefault={celdaSeleccionada ? notas.notasCelda[celdaSeleccionada]?.textColor : undefined}
                onSave={(datos) => {
                    if (celdaSeleccionada) {
                        notas.guardarNota(celdaSeleccionada, datos);
                    }
                }}
            />

            <ShareModal
                isOpen={shareModal.isOpen}
                onClose={shareModal.close}
                dataUrl={compartir.shareDataUrl}
                filename={compartir.shareFilename}
                onCopy={compartir.copiarImagen}
                onDownload={compartir.descargarImagen}
                horarioPersonal={horarios.horarioPersonal}
                notasCelda={notas.notasCelda}
                horarioActivo={horarios.horarioActivo}
            />

            <ConfigDrawer
                isOpen={configDrawer.isOpen}
                onClose={configDrawer.close}
                paletaSeleccionada={paleta.paletaSeleccionada}
                coloresActuales={paleta.coloresActuales}
                cambiarPaleta={paleta.cambiarPaleta}
            />

            <ModalGestionExcels
                isOpen={excelModal.isOpen}
                onClose={excelModal.close}
                nombreArchivo={excel.nombreArchivo}
                nombreArchivoTalleres={excel.nombreArchivoTalleres}
                nombreArchivoElectivos={excel.nombreArchivoElectivos}
                cargandoArchivo={excel.cargandoArchivo}
                cargandoTalleres={excel.cargandoTalleres}
                cargandoElectivos={excel.cargandoElectivos}
                onCargaArchivo={excel.manejarCargaArchivo}
                onCargaTalleres={excel.manejarCargaTalleres}
                onCargaElectivos={excel.manejarCargaElectivos}
                onEliminarBase={excel.eliminarExcelBase}
                onEliminarTalleres={excel.eliminarExcelTalleres}
                onEliminarElectivos={excel.eliminarExcelElectivos}
            />
        </div>
    );
}
