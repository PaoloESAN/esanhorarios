"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { useDisclosure } from "@heroui/use-disclosure";
import DiaMatricula from "@/components/diaMatricula.jsx";
import ModalAgregarCurso from "@/components/ModalAgregarCurso.jsx";
import { obtenerCursosCombinados, obtenerBadgeEspecialidad } from "@/components/datosCursos.js";
import { obtenerCreditosCurso } from "@/components/datosCreditos.js";
import { generarHorarios, diasSemana } from "@/components/utilidadesHorario.js";
import { obtenerColoresActuales, obtenerColorPorOrden, reasignarColores } from "@/components/paletasColores.js";
import { procesarArchivoExcel, mapeoEspecial } from "@/components/procesadorExcel.js";
import { ConflictModal, SuccessModal, ErrorModal, MatriculaModal } from "@/components/modales.jsx";
import { compartirHorario, compartirHorarioAlternativo } from "@/components/utilidadesCompartir.js";
import { useTheme } from "next-themes";


const cursosCombinados = obtenerCursosCombinados();
const horariosDelDia = generarHorarios();

const horariosIniciales = {

};

export default function Home() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [cicloSeleccionado, setCicloSeleccionado] = useState("Cuarto Ciclo");
  const [horarioPersonal, setHorarioPersonal] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [conflictoInfo, setConflictoInfo] = useState({ cursoExistente: '', cursoNuevo: '' });
  const [cursosSeleccionados, setCursosSeleccionados] = useState(new Set());
  const [horariosDisponibles, setHorariosDisponibles] = useState(horariosIniciales);
  const [cargandoArchivo, setCargandoArchivo] = useState(false);
  const [mensajeModal, setMensajeModal] = useState('');
  const [nombreArchivo, setNombreArchivo] = useState('');
  const [coloresAsignados, setColoresAsignados] = useState(new Map());
  const [paletaSeleccionada, setPaletaSeleccionada] = useState('default');

  const { isOpen: isConflictModalOpen, onOpen: onConflictModalOpen, onClose: onConflictModalClose } = useDisclosure();
  const { isOpen: isSuccessModalOpen, onOpen: onSuccessModalOpen, onClose: onSuccessModalClose } = useDisclosure();
  const { isOpen: isErrorModalOpen, onOpen: onErrorModalOpen, onClose: onErrorModalClose } = useDisclosure();
  const { isOpen: isMatriculaModalOpen, onOpen: onMatriculaModalOpen, onClose: onMatriculaModalClose } = useDisclosure();
  const { isOpen: isAddCourseModalOpen, onOpen: onAddCourseModalOpen, onClose: onAddCourseModalClose } = useDisclosure();

  const [imagenMatricula, setImagenMatricula] = useState(1);

  const coloresActuales = useMemo(() => {
    return obtenerColoresActuales(paletaSeleccionada);
  }, [paletaSeleccionada]);

  const cambiarPaleta = useCallback((nuevaPaleta) => {
    setPaletaSeleccionada(nuevaPaleta);

    const nuevosColores = obtenerColoresActuales(nuevaPaleta);
    const coloresReasignados = reasignarColores(cursosSeleccionados, horarioPersonal, nuevosColores);
    setColoresAsignados(coloresReasignados);
  }, [cursosSeleccionados, horarioPersonal]);

  const creditosTotales = useMemo(() => {
    const cursosUnicos = new Map();
    Object.values(horarioPersonal).forEach(clase => {
      if (clase && clase.curso) {
        const cursoKey = `${clase.curso}-${clase.seccion}`;
        if (!cursosUnicos.has(cursoKey)) {
          const creditos = clase.creditos || obtenerCreditosCurso(clase.curso);
          cursosUnicos.set(cursoKey, creditos);
        }
      }
    });

    let totalCreditos = 0;
    for (const creditos of cursosUnicos.values()) {
      totalCreditos += creditos;
    }

    return totalCreditos;
  }, [horarioPersonal]);

  const textosMatricula = {
    1: "Eres INCREIBLE.",
    2: "Lo lograste, podrás matricularte a todo.",
    3: "Tienes oportunidad.",
    4: "La esperanza es lo último que se pierde.",
    5: "Retírate de la Universidad."
  };

  const abrirModalMatricula = useCallback((numeroImagen) => {
    setImagenMatricula(numeroImagen);
    onMatriculaModalOpen();
  }, [onMatriculaModalOpen]);

  const procesarArchivoExcelLocal = useCallback(async (archivo) => {
    setCargandoArchivo(true);

    try {
      const nuevosHorarios = await procesarArchivoExcel(archivo);
      setHorariosDisponibles(nuevosHorarios);

      setMensajeModal('¡Archivo Excel cargado exitosamente!');
      onSuccessModalOpen();
    } catch (error) {
      console.error('Error al procesar archivo Excel:', error);
      setMensajeModal('Error al cargar el archivo Excel. Por favor, verifica el formato.');
      onErrorModalOpen();
    } finally {
      setCargandoArchivo(false);
    }
  }, [onSuccessModalOpen, onErrorModalOpen]);

  const limpiarHorario = useCallback(() => {
    setHorarioPersonal({});
    setCursosSeleccionados(new Set());
    setColoresAsignados(new Map());
  }, []);

  const manejarCargaArchivo = useCallback((evento) => {
    const archivo = evento.target.files[0];
    if (archivo) {
      setNombreArchivo(archivo.name);
      procesarArchivoExcelLocal(archivo);
      limpiarHorario();
    }
  }, [procesarArchivoExcelLocal, limpiarHorario]);

  const obtenerHorariosPorCurso = useCallback((nombreCurso) => {
    const normalizar = (texto) => {
      return texto
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, '')
        .trim();
    };

    const nombreNormalizado = normalizar(nombreCurso);

    if (horariosDisponibles[nombreCurso.toUpperCase()]) {
      return horariosDisponibles[nombreCurso.toUpperCase()];
    }

    for (const [clave, valor] of Object.entries(horariosDisponibles)) {
      if (normalizar(clave) === nombreNormalizado) {
        return valor;
      }
    }

    for (const [claveMapeo, valorMapeo] of Object.entries(mapeoEspecial)) {
      if (normalizar(claveMapeo) === nombreNormalizado) {
        for (const [clave, valor] of Object.entries(horariosDisponibles)) {
          if (normalizar(clave) === normalizar(valorMapeo)) {
            return valor;
          }
        }
      }
    }

    return [];
  }, [horariosDisponibles]);

  const agregarCursoAlHorario = useCallback((item) => {
    if (cursosSeleccionados.has(item.id)) {
      return;
    }

    const cursosData = obtenerHorariosPorCurso(item.curso);
    const seccionSeleccionada = cursosData.find(seccion => seccion.id === item.id);

    if (seccionSeleccionada) {
      const conflictos = [];
      seccionSeleccionada.horarios.forEach(horarioItem => {
        const key = `${horarioItem.dia}-${horarioItem.horario}`;
        if (horarioPersonal[key]) {
          conflictos.push({
            horario: horarioItem.horario,
            dia: horarioItem.dia,
            cursoExistente: horarioPersonal[key].curso,
            seccionExistente: horarioPersonal[key].seccion
          });
        }
      });

      if (conflictos.length > 0) {
        setConflictoInfo({
          cursoNuevo: `${item.curso} (${item.seccion})`,
          cursoExistente: `${conflictos[0].cursoExistente} (${conflictos[0].seccionExistente})`,
          detallesConflicto: conflictos
        });
        onConflictModalOpen();
        return;
      }

      const nuevoColorAsignado = obtenerColorPorOrden(item.id, coloresAsignados, coloresActuales);
      setColoresAsignados(prev => new Map(prev).set(item.id, nuevoColorAsignado));

      const nuevoHorario = { ...horarioPersonal };
      seccionSeleccionada.horarios.forEach(horarioItem => {
        const key = `${horarioItem.dia}-${horarioItem.horario}`;
        nuevoHorario[key] = {
          ...item,
          aula: horarioItem.aula,
          diaOriginal: horarioItem.dia,
          horarioOriginal: horarioItem.horario
        };
      });

      setHorarioPersonal(nuevoHorario);
      setCursosSeleccionados(prev => new Set([...prev, item.id]));
    }
  }, [cursosSeleccionados, obtenerHorariosPorCurso, horarioPersonal, coloresAsignados, coloresActuales, onConflictModalOpen]);

  const handleDragStart = useCallback((e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e, dia, horario) => {
    e.preventDefault();
    if (draggedItem) {
      agregarCursoAlHorario(draggedItem);
      setDraggedItem(null);
    }
  }, [draggedItem, agregarCursoAlHorario]);

  const removerDelHorario = useCallback((dia, horario) => {
    const key = `${dia}-${horario}`;
    const claseARemover = horarioPersonal[key];

    if (claseARemover && claseARemover.id) {
      const nuevoHorario = {};
      Object.keys(horarioPersonal).forEach(clave => {
        if (horarioPersonal[clave].id !== claseARemover.id) {
          nuevoHorario[clave] = horarioPersonal[clave];
        }
      });
      setHorarioPersonal(nuevoHorario);

      const nuevosCursosSeleccionados = new Set();
      cursosSeleccionados.forEach(cursoId => {
        if (cursoId !== claseARemover.id) {
          nuevosCursosSeleccionados.add(cursoId);
        }
      });
      setCursosSeleccionados(nuevosCursosSeleccionados);

      const nuevosColores = reasignarColores(nuevosCursosSeleccionados, nuevoHorario, coloresActuales);
      setColoresAsignados(nuevosColores);
    }
  }, [horarioPersonal, cursosSeleccionados, coloresActuales]);

  const removerCursoPorId = useCallback((cursoId) => {
    const nuevoHorario = {};
    Object.keys(horarioPersonal).forEach(clave => {
      if (horarioPersonal[clave].id !== cursoId) {
        nuevoHorario[clave] = horarioPersonal[clave];
      }
    });
    setHorarioPersonal(nuevoHorario);

    const nuevosCursosSeleccionados = new Set();
    cursosSeleccionados.forEach(id => {
      if (id !== cursoId) {
        nuevosCursosSeleccionados.add(id);
      }
    });
    setCursosSeleccionados(nuevosCursosSeleccionados);

    const nuevosColores = reasignarColores(nuevosCursosSeleccionados, nuevoHorario, coloresActuales);
    setColoresAsignados(nuevosColores);
  }, [horarioPersonal, cursosSeleccionados, coloresActuales]);

  const manejarAgregarCursoPersonalizado = useCallback((cursoData) => {
    const conflictos = [];
    cursoData.horarios.forEach(horarioItem => {
      const key = `${horarioItem.dia}-${horarioItem.horario}`;
      if (horarioPersonal[key]) {
        conflictos.push({
          horario: horarioItem.horario,
          dia: horarioItem.dia,
          cursoExistente: horarioPersonal[key].curso,
          seccionExistente: horarioPersonal[key].seccion
        });
      }
    });

    if (conflictos.length > 0) {
      setConflictoInfo({
        cursoNuevo: `${cursoData.nombre} (${cursoData.seccion})`,
        cursoExistente: `${conflictos[0].cursoExistente} (${conflictos[0].seccionExistente})`,
        detallesConflicto: conflictos
      });
      onConflictModalOpen();
      return { error: 'Conflicto de horarios' };
    }

    const cursoId = `personalizado-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const cursoItem = {
      id: cursoId,
      curso: cursoData.nombre,
      profesor: cursoData.profesor,
      seccion: cursoData.seccion
    };

    const nuevoColorAsignado = obtenerColorPorOrden(cursoId, coloresAsignados, coloresActuales);
    setColoresAsignados(prev => new Map(prev).set(cursoId, nuevoColorAsignado));

    const nuevoHorario = { ...horarioPersonal };
    cursoData.horarios.forEach(horarioItem => {
      const key = `${horarioItem.dia}-${horarioItem.horario}`;
      nuevoHorario[key] = {
        ...cursoItem,
        aula: cursoData.aula,
        creditos: cursoData.creditos,
        diaOriginal: horarioItem.dia,
        horarioOriginal: horarioItem.horario
      };
    });

    setHorarioPersonal(nuevoHorario);
    setCursosSeleccionados(prev => new Set([...prev, cursoId]));

    setMensajeModal('¡Curso personalizado agregado exitosamente!');
    onSuccessModalOpen();

    return { success: true };
  }, [horarioPersonal, coloresAsignados, coloresActuales, onConflictModalOpen, onSuccessModalOpen]);

  return (
    <div className={`min-h-screen ${resolvedTheme === 'dark' ? 'bg-background-dark' : 'bg-gray-50'}  p-2 md:p-4`}>
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="bg-content1 rounded-lg shadow-md p-3 md:p-6 mb-3 md:mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2">
                Creador de Horarios - Software y TI
              </h1>
              <p className="text-sm md:text-base text-foreground-500">
                Arrastra o selecciona los cursos desde el panel hacia la tabla de horarios.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3 items-center">
              {/* Mostrar nombre del archivo si existe */}
              {nombreArchivo && (
                <div className="flex items-center bg-content2 px-2 md:px-3 py-1 md:py-2 rounded-lg border border-divider">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-foreground-500 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-xs md:text-sm text-foreground font-medium truncate max-w-20 md:max-w-none">{nombreArchivo}</span>
                </div>
              )}

              {/* Botón para cargar Excel */}
              <Button
                as="label"
                color="primary"
                size="sm"
                className="cursor-pointer"
                isLoading={cargandoArchivo}
                startContent={
                  <svg className="w-3 h-3 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                }
              >
                <span className="hidden sm:inline">{cargandoArchivo ? 'Cargando...' : 'Cargar Excel'}</span>
                <span className="sm:hidden">Excel</span>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={manejarCargaArchivo}
                  className="hidden"
                  disabled={cargandoArchivo}
                />
              </Button>

              {/* Botón de cambio de tema */}
              <Button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                color="default"
                size="sm"
                variant="flat"
                isIconOnly
                title="Cambiar tema"
              >
                {resolvedTheme === 'dark' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </Button>


            </div>
          </div>
        </div>

        {/* Layout Principal */}
        <div className="flex flex-col lg:flex-row gap-3 md:gap-6">
          {/* Tabla de Horarios - Segunda en Mobile */}
          <div className="order-2 lg:order-2 flex-1 bg-content1 rounded-lg shadow-md p-3 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h2 className="text-lg md:text-xl font-semibold text-foreground">Mi Horario Personal</h2>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Selector de paleta de colores */}
                <Select
                  placeholder="Selecciona paleta"
                  selectedKeys={[paletaSeleccionada]}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0];
                    if (selectedKey && selectedKey !== paletaSeleccionada) {
                      cambiarPaleta(selectedKey);
                    }
                  }}
                  aria-label="Selecciona paleta de colores"
                  size="sm"
                  variant="bordered"
                  className="w-44 md:w-48"
                  classNames={{
                    trigger: "h-8 min-w-full",
                    value: "text-xs",
                    listboxWrapper: "max-h-60"
                  }}
                  disallowEmptySelection={true}
                  renderValue={(items) => {
                    const nombresPaletas = {
                      'default': 'Clásica',
                      'pastel': 'Pastel',
                      'vibrante': 'Vibrante',
                      'monocromatico': 'Monocromático',
                      'neon': 'Neón',
                      'otono': 'Otoño',
                      'oceanico': 'Oceánico'
                    };

                    return (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <div className={`w-3 h-3 rounded-full ${coloresActuales[0]?.bg || 'bg-blue-200'}`}></div>
                          <div className={`w-3 h-3 rounded-full ${coloresActuales[1]?.bg || 'bg-green-200'}`}></div>
                          <div className={`w-3 h-3 rounded-full ${coloresActuales[2]?.bg || 'bg-red-200'}`}></div>
                        </div>
                        <span className="text-sm">{nombresPaletas[paletaSeleccionada] || 'Selecciona paleta'}</span>
                      </div>
                    );
                  }}
                >
                  <SelectItem key="default" value="default" textValue="default">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-blue-200"></div>
                        <div className="w-3 h-3 rounded-full bg-green-200"></div>
                        <div className="w-3 h-3 rounded-full bg-red-200"></div>
                      </div>
                      <span>Clásica</span>
                    </div>
                  </SelectItem>
                  <SelectItem key="pastel" value="pastel" textValue="pastel">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-rose-100"></div>
                        <div className="w-3 h-3 rounded-full bg-sky-100"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-100"></div>
                      </div>
                      <span>Pastel</span>
                    </div>
                  </SelectItem>
                  <SelectItem key="vibrante" value="vibrante" textValue="vibrante">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      </div>
                      <span>Vibrante</span>
                    </div>
                  </SelectItem>
                  <SelectItem key="monocromatico" value="monocromatico" textValue="monocromatico">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                        <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                      </div>
                      <span>Monocromático</span>
                    </div>
                  </SelectItem>
                  <SelectItem key="neon" value="neon" textValue="neon">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-cyan-300"></div>
                        <div className="w-3 h-3 rounded-full bg-lime-300"></div>
                        <div className="w-3 h-3 rounded-full bg-pink-300"></div>
                      </div>
                      <span>Neón</span>
                    </div>
                  </SelectItem>
                  <SelectItem key="otono" value="otono" textValue="otono">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-amber-200"></div>
                        <div className="w-3 h-3 rounded-full bg-orange-200"></div>
                        <div className="w-3 h-3 rounded-full bg-red-200"></div>
                      </div>
                      <span>Otoño</span>
                    </div>
                  </SelectItem>
                  <SelectItem key="oceanico" value="oceanico" textValue="oceanico">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-blue-200"></div>
                        <div className="w-3 h-3 rounded-full bg-cyan-200"></div>
                        <div className="w-3 h-3 rounded-full bg-teal-200"></div>
                      </div>
                      <span>Oceánico</span>
                    </div>
                  </SelectItem>
                </Select>

                {/* Botones de acción */}
                <Button
                  onClick={limpiarHorario}
                  color="danger"
                  size="sm"
                  variant="flat"
                  startContent={
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  }
                  className="min-w-unit-10 md:min-w-unit-16"
                >
                  <span className="hidden md:inline">Limpiar</span>
                </Button>

                <Button
                  onClick={() => compartirHorario({ tema: resolvedTheme })}
                  color="success"
                  size="sm"
                  variant="flat"
                  startContent={
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  }
                  className="min-w-unit-10 md:min-w-unit-16"
                >
                  <span className="hidden md:inline">Compartir</span>
                </Button>

                {/* Contador de créditos */}
                <div className="flex items-center gap-1 md:gap-2 bg-primary-50 px-2 md:px-3 py-1 md:py-1 rounded-lg border border-primary-200 min-w-unit-10 md:min-w-unit-16 h-8 justify-center">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span className="text-xs md:text-sm font-semibold text-primary">
                    <span className="hidden md:inline">Créditos: </span>
                    {creditosTotales}
                  </span>
                </div>
              </div>
            </div>
            <h3 className="text-sm md:text-base text-foreground-500 mb-3 md:mb-4">
              Pulsa en el curso para removerlo del horario.
            </h3>
            <div className="overflow-x-auto">
              <table id="tabla-horario" className="w-full border-collapse text-xs md:text-sm">
                <thead>
                  <tr>
                    <th className="border border-divider p-1 md:p-2 bg-content2 w-16 md:w-20 text-xs text-foreground">Hora</th>
                    {diasSemana.map((dia) => (
                      <th key={dia} className="border border-divider p-1 md:p-2 bg-content2 min-w-20 md:min-w-32 text-xs text-foreground">
                        <span className="block md:hidden">{dia.substring(0, 3)}</span>
                        <span className="hidden md:block">{dia}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {horariosDelDia.map((horario) => (
                    <tr key={horario}>
                      <td className="border border-divider p-1 bg-content2 text-xs font-medium text-center text-foreground">
                        <span className="block md:hidden text-xs">{horario.split('-')[0]}</span>
                        <span className="hidden md:block">{horario}</span>
                      </td>
                      {diasSemana.map((dia) => {
                        const key = `${dia}-${horario}`;
                        const claseAsignada = horarioPersonal[key];

                        return (
                          <td
                            key={key}
                            className="border border-divider p-0.5 md:p-1 h-8 md:h-12 relative"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, dia, horario)}
                          >
                            {claseAsignada ? (
                              (() => {
                                const colorCurso = coloresAsignados.get(claseAsignada.id) || coloresActuales[0];
                                return (
                                  <div
                                    className={`${colorCurso.bg} ${colorCurso.border} border rounded p-0.5 md:p-1 h-full flex flex-col justify-between text-xs group relative cursor-pointer`}
                                    onClick={() => removerDelHorario(dia, horario)}
                                    title="Click para remover todo el curso"
                                  >
                                    <div className={`font-medium ${colorCurso.text} leading-tight text-xs`}>
                                      <span className="block">
                                        {claseAsignada.curso.length > 12
                                          ? claseAsignada.curso.substring(0, 12) + '...'
                                          : claseAsignada.curso
                                        }
                                      </span>
                                    </div>
                                    <div className={`${colorCurso.textSecondary} text-[10px] md:text-xs`}>
                                      {claseAsignada.seccion}
                                    </div>
                                    <div className={`${colorCurso.textSecondary} text-[10px] md:text-xs`}>
                                      {claseAsignada.profesor.length > 12
                                        ? claseAsignada.profesor.substring(0, 12) + '...'
                                        : claseAsignada.profesor
                                      }
                                    </div>
                                    {claseAsignada.aula && (
                                      <div className={`${colorCurso.textSecondary} text-[10px] md:text-xs`}>
                                        {claseAsignada.aula}
                                      </div>
                                    )}
                                    <div
                                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-3 h-3 md:w-4 md:h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                      style={{ fontSize: '8px' }}
                                    >
                                      ×
                                    </div>
                                  </div>
                                );
                              })()
                            ) : (
                              <div className="h-full bg-content1 hover:bg-content2 transition-colors rounded border-2 border-dashed border-transparent hover:border-primary">
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Panel Lateral - Cursos Disponibles */}
          <div className="order-1 lg:order-1 w-full lg:w-80 bg-content1 rounded-lg shadow-md p-3 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-foreground">Cursos Disponibles</h2>
              <Button
                onClick={onAddCourseModalOpen}
                color="primary"
                variant="flat"
                size="sm"
                isIconOnly
                title="Agregar curso personalizado"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </Button>
            </div>

            {/* Selector de Ciclo */}
            <div className="mb-4 md:mb-6">
              <Select
                label="Seleccionar Ciclo"
                labelPlacement="outside"
                placeholder="Selecciona un ciclo"
                selectedKeys={[cicloSeleccionado]}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];
                  if (selectedKey && selectedKey !== cicloSeleccionado) {
                    setCicloSeleccionado(selectedKey);
                  }
                }}
                size="sm"
                variant="bordered"
                disallowEmptySelection={true}
              >
                {Object.keys(cursosCombinados).map((ciclo) => (
                  <SelectItem key={ciclo} value={ciclo}>
                    {ciclo}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Lista de Cursos por Categorías */}
            <div className="space-y-3 max-h-[calc(100vh-500px)] lg:max-h-[47.75rem] overflow-y-auto" hidden={nombreArchivo ? false : true}>
              {cursosCombinados[cicloSeleccionado]?.map((curso, index) => {
                const horariosDisponiblesDelCurso = obtenerHorariosPorCurso(curso);
                const badgeEspecialidad = obtenerBadgeEspecialidad(curso, cicloSeleccionado);

                return (
                  <div key={index} className="border border-divider rounded-lg p-2 md:p-3 bg-content2">
                    <h4 className="font-semibold text-foreground text-xs md:text-sm mb-2 md:mb-3 border-b border-divider pb-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="flex-1">{curso}</span>
                        <div className="flex items-center gap-2">
                          {badgeEspecialidad && (
                            <span className={`inline-block text-white text-xs px-2 py-1 rounded-full font-medium ${badgeEspecialidad === 'Software' ? 'bg-primary' : 'bg-primary'
                              }`}>
                              {badgeEspecialidad}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-bold border border-emerald-200">
                            <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {obtenerCreditosCurso(curso)}
                          </span>
                        </div>
                      </div>
                    </h4>

                    {horariosDisponiblesDelCurso.length > 0 ? (
                      <div className="space-y-2">
                        {horariosDisponiblesDelCurso.map((seccionData, seccionIndex) => {
                          const estaSeleccionado = cursosSeleccionados.has(seccionData.id);

                          return (
                            <div
                              key={`${index}-${seccionIndex}`}
                              draggable={!estaSeleccionado}
                              onDragStart={(e) => {
                                if (!estaSeleccionado) {
                                  handleDragStart(e, {
                                    curso,
                                    profesor: seccionData.profesor,
                                    seccion: seccionData.seccion,
                                    id: seccionData.id
                                  });
                                }
                              }}
                              onClick={() => {
                                if (!estaSeleccionado) {
                                  agregarCursoAlHorario({
                                    curso,
                                    profesor: seccionData.profesor,
                                    seccion: seccionData.seccion,
                                    id: seccionData.id
                                  });
                                } else {
                                  removerCursoPorId(seccionData.id);
                                }
                              }}
                              className={`p-2 border rounded transition-colors ${estaSeleccionado
                                ? 'bg-content2 border-divider cursor-pointer hover:bg-content3'
                                : 'bg-primary-50 border-primary-200 cursor-move hover:bg-primary-100'
                                }`}
                            >
                              <div className={`text-xs font-medium mb-1 ${estaSeleccionado ? 'text-foreground-600' : 'text-foreground'
                                }`}>
                                Sección: {seccionData.seccion} {estaSeleccionado ? '✓ Click para remover' : ''}
                              </div>
                              <div className={`text-xs mb-1 ${estaSeleccionado ? 'text-foreground-500' : 'text-foreground-600'
                                } flex items-center gap-1`}>
                                <div className="flex items-center gap-1 flex-row-reverse">
                                  <span>
                                    Prof: {seccionData.profesor.length > 25
                                      ? seccionData.profesor.substring(0, 25) + '...'
                                      : seccionData.profesor
                                    }
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const searchQuery = encodeURIComponent(seccionData.profesor);
                                      window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
                                    }}
                                    className="p-0.5 hover:bg-content3 rounded transition-colors bg-content1 border border-divider shadow-sm"
                                    title={`Buscar información sobre ${seccionData.profesor}`}
                                  >
                                    <svg className="w-3 h-3 text-foreground-500 hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <div className={`text-xs ${estaSeleccionado ? 'text-foreground-500' : 'text-primary'
                                }`}>
                                Horarios: {seccionData.horarios.length} clase{seccionData.horarios.length !== 1 ? 's' : ''}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      // Solo mostrar "No hay horarios disponibles" si NO es un electivo
                      !curso.toLowerCase().includes('electivo') && (
                        <div className="p-2 bg-content3 border border-divider rounded text-center">
                          <div className="text-xs text-foreground-500">
                            No hay horarios disponibles
                          </div>
                        </div>
                      )
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mensaje cuando no hay archivo Excel cargado */}
            <div hidden={nombreArchivo ? true : false} className="flex flex-col items-center justify-center py-8 md:py-12 text-center">
              <div className="bg-primary-50 rounded-full p-4 mb-4">
                <svg className="w-8 h-8 md:w-12 md:h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                ¡Bienvenido!
              </h3>
              <p className="text-sm md:text-base text-foreground-500 mb-6 max-w-xs">
                Carga el archivo Excel con los horarios para ver los cursos disponibles.
              </p>

              <Button
                as="label"
                color="primary"
                size="md"
                className="cursor-pointer mb-4"
                isLoading={cargandoArchivo}
                startContent={
                  !cargandoArchivo && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  )
                }
              >
                {cargandoArchivo ? 'Cargando Excel...' : 'Cargar Archivo Excel'}
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={manejarCargaArchivo}
                  className="hidden"
                  disabled={cargandoArchivo}
                />
              </Button>
            </div>
          </div>
        </div>

        {/* DiaMatricula - Pasamos la función como prop */}
        <DiaMatricula onAbrirModal={abrirModalMatricula} />

        <h3
          className="text-xs md:text-sm text-foreground-500 text-center mt-4 md:mt-6"
        >
          Creado por {' '}
          <a className="hover:underline" target="_blank" rel="noopener noreferrer" href="https://finanfix.wordpress.com/">
            Paolo
          </a>
        </h3>

        <ConflictModal
          isOpen={isConflictModalOpen}
          onClose={onConflictModalClose}
          conflictoInfo={conflictoInfo}
        />

        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={onSuccessModalClose}
          mensaje={mensajeModal}
        />

        <MatriculaModal
          isOpen={isMatriculaModalOpen}
          onClose={onMatriculaModalClose}
          imagenMatricula={imagenMatricula}
          textosMatricula={textosMatricula}
        />

        <ErrorModal
          isOpen={isErrorModalOpen}
          onClose={onErrorModalClose}
          mensaje={mensajeModal}
        />

        {/* Modal de Agregar Curso Personalizado */}
        <ModalAgregarCurso
          isOpen={isAddCourseModalOpen}
          onClose={onAddCourseModalClose}
          onAgregarCurso={manejarAgregarCursoPersonalizado}
          onError={(mensaje) => {
            setMensajeModal(mensaje);
            onErrorModalOpen();
          }}
          diasSemana={diasSemana}
          horariosDelDia={horariosDelDia}
        />
      </div>
    </div >
  );
}
