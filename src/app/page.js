"use client";

import { useState } from "react";
import * as XLSX from 'xlsx';
import domtoimage from 'dom-to-image';
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Modal, ModalContent, ModalBody, ModalHeader, ModalFooter } from "@heroui/modal";
import { useDisclosure } from "@heroui/use-disclosure";
import DiaMatricula from "@/components/diaMatricula.jsx";
import ModalAgregarCurso from "@/components/ModalAgregarCurso.jsx";

const cursosIngenieriaSoftware = {
  "Primer Ciclo": [
    "Comunicación y literatura I",
    "Pre Cálculo",
    "Globalización y Realidad Nacional",
    "Estadística y Probabilidades",
    "Sistemas operativos I",
    "Fundamentos de Programación",
    "Taller: Desarrollo de competencias personales I"
  ],
  "Segundo Ciclo": [
    "Algoritmos y estructura de datos",
    "Cálculo I",
    "Ingeniería de requerimientos",
    "Análisis de datos I",
    "Arquitectura del computador I",
    "Base de Datos",
    "Taller: Desarrollo de competencias profesionales I"
  ],
  "Tercer Ciclo": [
    "Algebra lineal I",
    "Cálculo II",
    "Programación Orientada a Objetos",
    "Administración de base de datos",
    "Física I",
    "Ingeniería de procesos de negocio",
    "Taller: Desarrollo de Competencias Personales II"
  ],
  "Cuarto Ciclo": [
    "Matemática Discreta",
    "Estadistica Inferencial",
    "Análisis y diseño de algoritmos",
    "Inteligencia de Negocios",
    "Ingeniería de software I",
    "Robótica",
    "Redes de comunicaciones",
    "Taller: Desarrollo de competencias profesionales II"
  ]
};

const generarHorarios = () => {
  const horarios = [];

  for (let hora = 7; hora <= 22; hora++) {
    const horaStr = hora.toString().padStart(2, '0');
    const siguienteHora = hora + 1;
    const siguienteHoraStr = siguienteHora.toString().padStart(2, '0');

    horarios.push(`${horaStr}:30-${siguienteHoraStr}:15`);
  }

  return horarios;
};

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const horariosDelDia = generarHorarios();

const generarColorCurso = (nombreCurso) => {
  const coloresPorCategoria = {
    "PRE CÁLCULO": { bg: 'bg-blue-200', border: 'border-blue-400', text: 'text-blue-900', textSecondary: 'text-blue-800' },
    "CÁLCULO I": { bg: 'bg-blue-200', border: 'border-blue-400', text: 'text-blue-900', textSecondary: 'text-blue-800' },
    "CÁLCULO II": { bg: 'bg-blue-200', border: 'border-blue-400', text: 'text-blue-900', textSecondary: 'text-blue-800' },
    "ÁLGEBRA LINEAL I": { bg: 'bg-blue-200', border: 'border-blue-400', text: 'text-blue-900', textSecondary: 'text-blue-800' },
    "ALGEBRA LINEAL I": { bg: 'bg-blue-200', border: 'border-blue-400', text: 'text-blue-900', textSecondary: 'text-blue-800' },
    "MATEMÁTICA DISCRETA": { bg: 'bg-blue-200', border: 'border-blue-400', text: 'text-blue-900', textSecondary: 'text-blue-800' },

    "FUNDAMENTOS DE PROGRAMACIÓN": { bg: 'bg-green-200', border: 'border-green-400', text: 'text-green-900', textSecondary: 'text-green-800' },
    "ALGORITMOS Y ESTRUCTURA DE DATOS": { bg: 'bg-green-200', border: 'border-green-400', text: 'text-green-900', textSecondary: 'text-green-800' },
    "PROGRAMACIÓN ORIENTADA A OBJETOS": { bg: 'bg-green-200', border: 'border-green-400', text: 'text-green-900', textSecondary: 'text-green-800' },
    "ANÁLISIS Y DISEÑO DE ALGORITMOS": { bg: 'bg-green-200', border: 'border-green-400', text: 'text-green-900', textSecondary: 'text-green-800' },

    "BASE DE DATOS": { bg: 'bg-red-200', border: 'border-red-400', text: 'text-red-900', textSecondary: 'text-red-800' },
    "ADMINISTRACIÓN DE BASE DE DATOS": { bg: 'bg-red-200', border: 'border-red-400', text: 'text-red-900', textSecondary: 'text-red-800' },

    "SISTEMAS OPERATIVOS I": { bg: 'bg-yellow-200', border: 'border-yellow-400', text: 'text-yellow-900', textSecondary: 'text-yellow-800' },
    "ARQUITECTURA DEL COMPUTADOR I": { bg: 'bg-yellow-200', border: 'border-yellow-400', text: 'text-yellow-900', textSecondary: 'text-yellow-800' },
    "REDES DE COMUNICACIONES": { bg: 'bg-yellow-200', border: 'border-yellow-400', text: 'text-yellow-900', textSecondary: 'text-yellow-800' },

    "INGENIERÍA DE REQUERIMIENTOS": { bg: 'bg-orange-200', border: 'border-orange-400', text: 'text-orange-900', textSecondary: 'text-orange-800' },
    "INGENIERÍA DE SOFTWARE I": { bg: 'bg-orange-200', border: 'border-orange-400', text: 'text-orange-900', textSecondary: 'text-orange-800' },
    "INGENIERÍA DE PROCESOS DE NEGOCIO": { bg: 'bg-orange-200', border: 'border-orange-400', text: 'text-orange-900', textSecondary: 'text-orange-800' },

    "ANÁLISIS DE DATOS I": { bg: 'bg-cyan-200', border: 'border-cyan-400', text: 'text-cyan-900', textSecondary: 'text-cyan-800' },
    "ESTADÍSTICA Y PROBABILIDADES": { bg: 'bg-cyan-200', border: 'border-cyan-400', text: 'text-cyan-900', textSecondary: 'text-cyan-800' },
    "ESTADÍSTICA INFERENCIAL": { bg: 'bg-cyan-200', border: 'border-cyan-400', text: 'text-cyan-900', textSecondary: 'text-cyan-800' },
    "INTELIGENCIA DE NEGOCIOS": { bg: 'bg-cyan-200', border: 'border-cyan-400', text: 'text-cyan-900', textSecondary: 'text-cyan-800' },

    "COMUNICACIÓN Y LITERATURA I": { bg: 'bg-lime-200', border: 'border-lime-400', text: 'text-lime-900', textSecondary: 'text-lime-800' },
    "GLOBALIZACIÓN Y REALIDAD NACIONAL": { bg: 'bg-lime-200', border: 'border-lime-400', text: 'text-lime-900', textSecondary: 'text-lime-800' },

    "TALLER: DESARROLLO DE COMPETENCIAS PERSONALES I": { bg: 'bg-teal-200', border: 'border-teal-400', text: 'text-teal-900', textSecondary: 'text-teal-800' },
    "TALLER: DESARROLLO DE COMPETENCIAS PROFESIONALES I": { bg: 'bg-teal-200', border: 'border-teal-400', text: 'text-teal-900', textSecondary: 'text-teal-800' },
    "TALLER: DESARROLLO DE COMPETENCIAS PERSONALES II": { bg: 'bg-teal-200', border: 'border-teal-400', text: 'text-teal-900', textSecondary: 'text-teal-800' },
    "TALLER: DESARROLLO DE COMPETENCIAS PROFESIONALES II": { bg: 'bg-teal-200', border: 'border-teal-400', text: 'text-teal-900', textSecondary: 'text-teal-800' },

    "FÍSICA I": { bg: 'bg-indigo-200', border: 'border-indigo-400', text: 'text-indigo-900', textSecondary: 'text-indigo-800' },

    "ROBÓTICA": { bg: 'bg-pink-200', border: 'border-pink-400', text: 'text-pink-900', textSecondary: 'text-pink-800' }
  };

  const cursoNormalizado = nombreCurso.toString().toUpperCase().trim();

  if (coloresPorCategoria[cursoNormalizado]) {
    return coloresPorCategoria[cursoNormalizado];
  }

  const coloresRespaldo = [
    { bg: 'bg-emerald-200', border: 'border-emerald-400', text: 'text-emerald-900', textSecondary: 'text-emerald-800' },
    { bg: 'bg-sky-200', border: 'border-sky-400', text: 'text-sky-900', textSecondary: 'text-sky-800' },
    { bg: 'bg-violet-200', border: 'border-violet-400', text: 'text-violet-900', textSecondary: 'text-violet-800' }
  ];

  let hash = 0;
  for (let i = 0; i < cursoNormalizado.length; i++) {
    hash = ((hash << 5) - hash) + cursoNormalizado.charCodeAt(i);
    hash = hash & hash;
  }

  return coloresRespaldo[Math.abs(hash) % coloresRespaldo.length];
};

const horariosIniciales = {

};

export default function Home() {
  const [cicloSeleccionado, setCicloSeleccionado] = useState("Cuarto Ciclo");
  const [horarioPersonal, setHorarioPersonal] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [conflictoInfo, setConflictoInfo] = useState({ cursoExistente: '', cursoNuevo: '' });
  const [cursosSeleccionados, setCursosSeleccionados] = useState(new Set());
  const [horariosDisponibles, setHorariosDisponibles] = useState(horariosIniciales);
  const [cargandoArchivo, setCargandoArchivo] = useState(false);
  const [mensajeModal, setMensajeModal] = useState('');
  const [nombreArchivo, setNombreArchivo] = useState('');

  const { isOpen: isConflictModalOpen, onOpen: onConflictModalOpen, onClose: onConflictModalClose } = useDisclosure();
  const { isOpen: isSuccessModalOpen, onOpen: onSuccessModalOpen, onClose: onSuccessModalClose } = useDisclosure();
  const { isOpen: isErrorModalOpen, onOpen: onErrorModalOpen, onClose: onErrorModalClose } = useDisclosure();
  const { isOpen: isMatriculaModalOpen, onOpen: onMatriculaModalOpen, onClose: onMatriculaModalClose } = useDisclosure();
  const { isOpen: isAddCourseModalOpen, onOpen: onAddCourseModalOpen, onClose: onAddCourseModalClose } = useDisclosure();

  const [imagenMatricula, setImagenMatricula] = useState(1);

  const textosMatricula = {
    1: "Eres INCREIBLE.",
    2: "Lo lograste, podrás matricularte a todo.",
    3: "Tienes oportunidad.",
    4: "La esperanza es lo último que se pierde.",
    5: "Retírate de la Universidad."
  };

  const abrirModalMatricula = (numeroImagen) => {
    setImagenMatricula(numeroImagen);
    onMatriculaModalOpen();
  };

  const procesarArchivoExcel = async (archivo) => {
    setCargandoArchivo(true);

    try {
      const data = await archivo.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const nuevosHorarios = parsearDatosExcel(jsonData);
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
  };

  const parsearDatosExcel = (datos) => {
    const horariosParseados = {};

    let filaEncabezados = -1;
    for (let i = 0; i < Math.min(10, datos.length); i++) {
      const fila = datos[i];
      if (fila && fila.some(celda =>
        celda && typeof celda === 'string' &&
        (celda.toUpperCase().includes('CURSO') ||
          celda.toUpperCase().includes('MATERIA') ||
          celda.toUpperCase().includes('ASIGNATURA'))
      )) {
        filaEncabezados = i;
        break;
      }
    }

    if (filaEncabezados === -1) {
      console.warn('No se encontraron encabezados válidos');
      return horariosIniciales;
    }

    const encabezados = datos[filaEncabezados];
    const indiceColumnas = {};

    encabezados.forEach((encabezado, index) => {
      if (encabezado && typeof encabezado === 'string') {
        const enc = encabezado.toUpperCase();
        if (enc.includes('CURSO') || enc.includes('MATERIA') || enc.includes('ASIGNATURA')) {
          indiceColumnas.curso = index;
        } else if (enc.includes('PROFESOR') || enc.includes('DOCENTE')) {
          indiceColumnas.profesor = index;
        } else if (enc.includes('SECCION') || enc.includes('SECCIÓN') || enc.includes('SECC')) {
          indiceColumnas.seccion = index;
        } else if (enc.includes('LUNES')) {
          indiceColumnas.lunes = index;
        } else if (enc.includes('MARTES')) {
          indiceColumnas.martes = index;
        } else if (enc.includes('MIERCOLES') || enc.includes('MIÉRCOLES')) {
          indiceColumnas.miercoles = index;
        } else if (enc.includes('JUEVES')) {
          indiceColumnas.jueves = index;
        } else if (enc.includes('VIERNES')) {
          indiceColumnas.viernes = index;
        } else if (enc.includes('SABADO') || enc.includes('SÁBADO')) {
          indiceColumnas.sabado = index;
        } else if (enc.includes('AULA') || enc.includes('SALON')) {
          indiceColumnas.aula = index;
        }
      }
    });

    for (let i = filaEncabezados + 1; i < datos.length; i++) {
      const fila = datos[i];
      if (!fila || fila.length === 0) continue;

      const curso = fila[indiceColumnas.curso];
      const profesor = fila[indiceColumnas.profesor];
      const seccion = fila[indiceColumnas.seccion];

      if (!curso || !profesor) continue;

      let cursoNormalizado = curso.toString().toUpperCase().trim();

      cursoNormalizado = cursoNormalizado
        .replace(/[^\w\sáéíóúñü:]/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

      const horarios = [];
      const diasExcel = [
        { nombre: 'Lunes', indice: indiceColumnas.lunes },
        { nombre: 'Martes', indice: indiceColumnas.martes },
        { nombre: 'Miércoles', indice: indiceColumnas.miercoles },
        { nombre: 'Jueves', indice: indiceColumnas.jueves },
        { nombre: 'Viernes', indice: indiceColumnas.viernes },
        { nombre: 'Sábado', indice: indiceColumnas.sabado }
      ];

      diasExcel.forEach(dia => {
        if (dia.indice !== undefined && fila[dia.indice]) {
          const horarioTexto = fila[dia.indice].toString().trim();
          if (horarioTexto && horarioTexto !== '') {
            const horariosEncontrados = extraerHorarios(horarioTexto);
            horariosEncontrados.forEach(horarioObj => {
              horarios.push({
                dia: dia.nombre,
                horario: horarioObj.horario,
                aula: horarioObj.aula || fila[indiceColumnas.aula] || 'Por definir'
              });
            });
          }
        }
      });

      if (horarios.length > 0) {
        if (!horariosParseados[cursoNormalizado]) {
          horariosParseados[cursoNormalizado] = [];
        }

        horariosParseados[cursoNormalizado].push({
          id: `${cursoNormalizado.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          profesor: profesor.toString().trim(),
          seccion: seccion ? seccion.toString().trim() : 'S-001',
          horarios: horarios
        });
      }
    }

    return horariosParseados;
  };

  const extraerHorarios = (textoHorario) => {
    const horarios = [];

    const patterns = [
      /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})\s*\(([^)]+)\)/g,
      /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/g,
      /(\d{1,2})\.(\d{2})\s*-\s*(\d{1,2})\.(\d{2})\s*\(([^)]+)\)/g,
      /(\d{1,2})\.(\d{2})\s*-\s*(\d{1,2})\.(\d{2})/g,
      /(\d{1,2}):(\d{2})\s*a\s*(\d{1,2}):(\d{2})\s*\(([^)]+)\)/gi,
      /(\d{1,2}):(\d{2})\s*a\s*(\d{1,2}):(\d{2})/gi,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(textoHorario)) !== null) {
        const horaInicio = parseInt(match[1]);
        const minutoInicio = parseInt(match[2]);
        const horaFin = parseInt(match[3]);
        const minutoFin = parseInt(match[4]);
        const aula = match[5] || null;

        const inicioMinutos = horaInicio * 60 + minutoInicio;
        const finMinutos = horaFin * 60 + minutoFin;

        let minutosActual = inicioMinutos;

        while (minutosActual < finMinutos) {
          const horaActual = Math.floor(minutosActual / 60);
          const minutoActual = minutosActual % 60;

          let horarioFormateado;

          // Si el minuto es <= 30, pertenece al slot que empieza en esa hora a las :30
          // Si el minuto es > 30, pertenece al slot que empieza en esa hora a las :30
          if (minutoActual <= 15) {
            // Si está entre :00 y :15, pertenece al slot anterior (hora-1):30-hora:15
            if (horaActual > 0) {
              const horaAnterior = horaActual - 1;
              horarioFormateado = `${horaAnterior.toString().padStart(2, '0')}:30-${horaActual.toString().padStart(2, '0')}:15`;
            }
          } else {
            // Si está entre :16 y :59, pertenece al slot hora:30-(hora+1):15
            const horaSiguiente = horaActual + 1;
            horarioFormateado = `${horaActual.toString().padStart(2, '0')}:30-${horaSiguiente.toString().padStart(2, '0')}:15`;
          }

          if (horarioFormateado && !horarios.some(h => h.horario === horarioFormateado)) {
            horarios.push({
              horario: horarioFormateado,
              aula: aula || 'Por definir'
            });
          }

          minutosActual += 45;
        }
      }
    }

    if (horarios.length === 0) {
      const horaSimple = textoHorario.match(/(\d{1,2})/);
      if (horaSimple) {
        const hora = parseInt(horaSimple[1]);
        if (hora >= 7 && hora <= 22) {
          horarios.push({
            horario: `${hora.toString().padStart(2, '0')}:30-${(hora + 1).toString().padStart(2, '0')}:15`,
            aula: 'Por definir'
          });
        }
      }
    }

    return horarios;
  };

  const manejarCargaArchivo = (evento) => {
    const archivo = evento.target.files[0];
    if (archivo) {
      setNombreArchivo(archivo.name);
      procesarArchivoExcel(archivo);
      limpiarHorario();
    }
  };

  const obtenerHorariosPorCurso = (nombreCurso) => {
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

    const mapeoEspecial = {
      "ANALISIS DE DATOS I": "ANÁLISIS DE DATOS I",
      "TALLER DESARROLLO DE COMPETENCIAS PERSONALES I": "TALLER: DESARROLLO DE COMPETENCIAS PROFESIONALES I",
      "TALLER DESARROLLO DE COMPETENCIAS PROFESIONALES I": "TALLER: DESARROLLO DE COMPETENCIAS PROFESIONALES I",
      "ESTADISTICA Y PROBABILIDADES": "ESTADÍSTICA Y PROBABILIDADES",
      "GLOBALIZACION Y REALIDAD NACIONAL": "GLOBALIZACIÓN Y REALIDAD NACIONAL",
      "INGENIERIA DE REQUERIMIENTOS": "INGENIERÍA DE REQUERIMIENTOS",
      "MATEMATICA DISCRETA": "MATEMÁTICA DISCRETA",
      "ESTADISTICA INFERENCIAL": "ESTADÍSTICA INFERENCIAL",
      "ANALISIS Y DISEÑO DE ALGORITMOS": "ANÁLISIS Y DISEÑO DE ALGORITMOS",
      "INTELIGENCIA DE NEGOCIOS": "INTELIGENCIA DE NEGOCIOS",
      "INGENIERIA DE SOFTWARE I": "INGENIERÍA DE SOFTWARE I",
      "ROBOTICA": "ROBÓTICA",
      "CALCULO I": "CÁLCULO I",
      "CALCULO II": "CÁLCULO II",
      "ALGEBRA LINEAL I": "ÁLGEBRA LINEAL I",
      "PROGRAMACION ORIENTADA A OBJETOS": "PROGRAMACIÓN ORIENTADA A OBJETOS",
      "ADMINISTRACION DE BASE DE DATOS": "ADMINISTRACIÓN DE BASE DE DATOS",
      "FISICA I": "FÍSICA I",
      "INGENIERIA DE PROCESOS DE NEGOCIO": "INGENIERÍA DE PROCESOS DE NEGOCIO",
      "COMUNICACION Y LITERATURA I": "COMUNICACIÓN Y LITERATURA I",
      "PRE CALCULO": "PRE CÁLCULO",
      "FUNDAMENTOS DE PROGRAMACION": "FUNDAMENTOS DE PROGRAMACIÓN"
    };

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
  };

  const agregarCursoAlHorario = (item) => {
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
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dia, horario) => {
    e.preventDefault();
    if (draggedItem) {
      agregarCursoAlHorario(draggedItem);
      setDraggedItem(null);
    }
  };

  const removerDelHorario = (dia, horario) => {
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

      setCursosSeleccionados(prev => {
        const newSet = new Set(prev);
        newSet.delete(claseARemover.id);
        return newSet;
      });
    }
  };

  const limpiarHorario = () => {
    setHorarioPersonal({});
    setCursosSeleccionados(new Set());
  };

  const manejarAgregarCursoPersonalizado = (cursoData) => {
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

    const nuevoHorario = { ...horarioPersonal };
    cursoData.horarios.forEach(horarioItem => {
      const key = `${horarioItem.dia}-${horarioItem.horario}`;
      nuevoHorario[key] = {
        ...cursoItem,
        aula: cursoData.aula,
        diaOriginal: horarioItem.dia,
        horarioOriginal: horarioItem.horario
      };
    });

    setHorarioPersonal(nuevoHorario);
    setCursosSeleccionados(prev => new Set([...prev, cursoId]));

    setMensajeModal('¡Curso personalizado agregado exitosamente!');
    onSuccessModalOpen();

    return { success: true };
  };

  const compartirHorario = async () => {
    try {
      const tablaElement = document.getElementById('tabla-horario');
      if (!tablaElement) {
        console.error('No se encontró la tabla de horarios');
        return;
      }

      const estilosOriginales = tablaElement.style.cssText;

      tablaElement.style.cssText += `
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
        background-color: white !important;
        border-collapse: collapse !important;
      `;

      const opciones = {
        width: tablaElement.offsetWidth * 2,
        height: tablaElement.offsetHeight * 2,
        style: {
          transform: 'scale(2)',
          transformOrigin: 'top left',
          width: tablaElement.offsetWidth + 'px',
          height: tablaElement.offsetHeight + 'px',
          backgroundColor: 'white',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
          fontSize: '14px'
        },
        quality: 1.0,
        bgcolor: 'white',
        filter: (node) => {
          if (node.classList) {
            return !node.classList.contains('group-hover:opacity-100');
          }
          return true;
        }
      };

      const dataUrl = await domtoimage.toPng(tablaElement, opciones);

      tablaElement.style.cssText = estilosOriginales;

      const link = document.createElement('a');
      link.download = `mi-horario-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMensajeModal('¡Horario guardado como imagen exitosamente!');
      onSuccessModalOpen();

    } catch (error) {
      console.error('Error al capturar la tabla:', error);

      try {
        await compartirHorarioAlternativo();
      } catch (errorFallback) {
        console.error('Error en método alternativo:', errorFallback);
        setMensajeModal('Error al guardar la imagen. Por favor, intenta de nuevo.');
        onErrorModalOpen();
      }
    }
  };

  const compartirHorarioAlternativo = async () => {
    const tablaElement = document.getElementById('tabla-horario');
    if (!tablaElement) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const rect = tablaElement.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;

    ctx.scale(2, 2);

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const dibujarTabla = () => {
      const filas = tablaElement.querySelectorAll('tr');
      let yPos = 0;

      filas.forEach((fila, indiceFila) => {
        const celdas = fila.querySelectorAll('th, td');
        let xPos = 0;
        let alturaFila = 48;

        celdas.forEach((celda, indiceCelda) => {
          const anchoCelda = celda.offsetWidth;

          ctx.strokeStyle = '#d1d5db';
          ctx.lineWidth = 1;
          ctx.strokeRect(xPos, yPos, anchoCelda, alturaFila);

          if (celda.tagName === 'TH') {
            ctx.fillStyle = '#f9fafb';
            ctx.fillRect(xPos + 1, yPos + 1, anchoCelda - 2, alturaFila - 2);
          }

          const textoCelda = celda.textContent.trim();

          if (textoCelda) {
            ctx.fillStyle = celda.tagName === 'TH' ? '#374151' : '#111827';

            const lineas = textoCelda.split('\n').filter(linea => linea.trim());
            lineas.forEach((linea, indiceLinea) => {
              ctx.fillText(
                linea.substring(0, 20),
                xPos + 4,
                yPos + 4 + (indiceLinea * 14)
              );
            });
          }

          xPos += anchoCelda;
        });

        yPos += alturaFila;
      });
    };

    dibujarTabla();

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `mi-horario-simple-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = url;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        setMensajeModal('¡Horario guardado como imagen simple exitosamente!');
        onSuccessModalOpen();
      }
    }, 'image/png');
  }; return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-4">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-3 md:p-6 mb-3 md:mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                Creador de Horarios - Software y TI
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                Arrastra o selecciona los cursos desde el panel hacia la tabla de horarios.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3 items-center">
              {/* Mostrar nombre del archivo si existe */}
              {nombreArchivo && (
                <div className="flex items-center bg-gray-100 px-2 md:px-3 py-1 md:py-2 rounded-lg">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-600 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-xs md:text-sm text-gray-700 font-medium truncate max-w-20 md:max-w-none">{nombreArchivo}</span>
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

              <Button
                onClick={limpiarHorario}
                color="danger"
                size="sm"
              >
                <span className="hidden sm:inline">Limpiar Horario</span>
                <span className="sm:hidden">Limpiar</span>
              </Button>

              <Button
                onClick={compartirHorario}
                color="success"
                size="sm"
                startContent={
                  <svg className="w-3 h-3 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                }
              >
                <span className="hidden sm:inline">Compartir</span>
                <span className="sm:hidden">IMG</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Layout Principal */}
        <div className="flex flex-col lg:flex-row gap-3 md:gap-6">
          {/* Tabla de Horarios - Segunda en Mobile */}
          <div className="order-2 lg:order-2 flex-1 bg-white rounded-lg shadow-md p-3 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-2">Mi Horario Personal</h2>
            <h3 className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
              Pulsa en el curso para removerlo del horario.
            </h3>
            <div className="overflow-x-auto">
              <table id="tabla-horario" className="w-full border-collapse text-xs md:text-sm">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-1 md:p-2 bg-gray-50 w-16 md:w-20 text-xs">Hora</th>
                    {diasSemana.map((dia) => (
                      <th key={dia} className="border border-gray-300 p-1 md:p-2 bg-gray-50 min-w-20 md:min-w-32 text-xs">
                        <span className="block md:hidden">{dia.substring(0, 3)}</span>
                        <span className="hidden md:block">{dia}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {horariosDelDia.map((horario) => (
                    <tr key={horario}>
                      <td className="border border-gray-300 p-1 bg-gray-50 text-xs font-medium text-center">
                        <span className="block md:hidden text-xs">{horario.split('-')[0]}</span>
                        <span className="hidden md:block">{horario}</span>
                      </td>
                      {diasSemana.map((dia) => {
                        const key = `${dia}-${horario}`;
                        const claseAsignada = horarioPersonal[key];

                        return (
                          <td
                            key={key}
                            className="border border-gray-300 p-0.5 md:p-1 h-8 md:h-12 relative"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, dia, horario)}
                          >
                            {claseAsignada ? (
                              (() => {
                                const colorCurso = generarColorCurso(claseAsignada.curso);
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
                              <div className="h-full bg-gray-50 hover:bg-blue-50 transition-colors rounded border-2 border-dashed border-transparent hover:border-blue-300">
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
          <div className="order-1 lg:order-1 w-full lg:w-80 bg-white rounded-lg shadow-md p-3 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-lg md:text-xl font-semibold">Cursos Disponibles</h2>
              <Button
                onClick={onAddCourseModalOpen}
                color="primary"
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
                {Object.keys(cursosIngenieriaSoftware).map((ciclo) => (
                  <SelectItem key={ciclo} value={ciclo}>
                    {ciclo}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Lista de Cursos por Categorías */}
            <div className="space-y-3 max-h-[calc(100vh-500px)] lg:max-h-[47.75rem] overflow-y-auto">
              {cursosIngenieriaSoftware[cicloSeleccionado]?.map((curso, index) => {
                const horariosDisponiblesDelCurso = obtenerHorariosPorCurso(curso);

                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-2 md:p-3">
                    <h4 className="font-semibold text-gray-800 text-xs md:text-sm mb-2 md:mb-3 border-b border-gray-200 pb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span>{curso}</span>
                        {curso === "Administración de base de datos" && (
                          <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            software
                          </span>
                        )}
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
                                }
                              }}
                              className={`p-2 border rounded transition-colors ${estaSeleccionado
                                ? 'bg-gray-200 border-gray-300 cursor-not-allowed'
                                : 'bg-blue-50 border-blue-200 cursor-move hover:bg-blue-100'
                                }`}
                            >
                              <div className={`text-xs font-medium mb-1 ${estaSeleccionado ? 'text-gray-600' : 'text-blue-900'
                                }`}>
                                Sección: {seccionData.seccion} {estaSeleccionado ? '✓ Seleccionado' : ''}
                              </div>
                              <div className={`text-xs mb-1 ${estaSeleccionado ? 'text-gray-500' : 'text-blue-700'
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
                                    className="p-0.5 hover:bg-gray-200 rounded transition-colors bg-white border border-gray-300 shadow-sm"
                                    title={`Buscar información sobre ${seccionData.profesor}`}
                                  >
                                    <svg className="w-3 h-3 text-gray-600 hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <div className={`text-xs ${estaSeleccionado ? 'text-gray-500' : 'text-blue-600'
                                }`}>
                                Horarios: {seccionData.horarios.length} clase{seccionData.horarios.length !== 1 ? 's' : ''}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-2 bg-gray-50 border border-gray-200 rounded text-center">
                        <div className="text-xs text-gray-500">
                          No hay horarios disponibles
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* DiaMatricula - Pasamos la función como prop */}
        <DiaMatricula onAbrirModal={abrirModalMatricula} />

        <h3
          className="text-xs md:text-sm text-gray-500 text-center mt-4 md:mt-6"
        >
          Creado por {' '}
          <a className="hover:underline" target="_blank" rel="noopener noreferrer" href="https://finanfix.wordpress.com/">
            Paolo
          </a>
        </h3>

        {/* Modal de Conflicto */}
        <Modal isOpen={isConflictModalOpen} onClose={onConflictModalClose} size="md" placement="center">
          <ModalContent>
            <ModalHeader className="flex gap-1 items-center">
              <div className="bg-red-100 rounded-full p-2 mr-3">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.862-.833-2.632 0L4.182 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              Conflicto de Horarios
            </ModalHeader>
            <ModalBody>
              <div className="mb-4">
                <p className="text-sm md:text-base text-gray-700 mb-2">
                  No se puede agregar <span className="font-semibold text-blue-600">{conflictoInfo.cursoNuevo}</span>
                  porque tiene conflicto de horarios con:
                </p>
                <p className="text-sm md:text-base font-semibold text-red-600">
                  {conflictoInfo.cursoExistente}
                </p>
              </div>

              {conflictoInfo.detallesConflicto && (
                <div className="mb-4 p-3 bg-red-50 rounded-lg">
                  <p className="text-xs md:text-sm font-medium text-red-800 mb-2">Horarios en conflicto:</p>
                  {conflictoInfo.detallesConflicto.map((conflicto, index) => (
                    <div key={index} className="text-xs md:text-sm text-red-700">
                      • {conflicto.dia} {conflicto.horario}
                    </div>
                  ))}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onConflictModalClose}>
                Entendido
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal de Éxito */}
        <Modal isOpen={isSuccessModalOpen} onClose={onSuccessModalClose} size="md" placement="center">
          <ModalContent>
            <ModalHeader className="flex gap-1 items-center">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              ¡Éxito!
            </ModalHeader>
            <ModalBody>
              <p className="text-sm md:text-base text-gray-700">
                {mensajeModal}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="success" onPress={onSuccessModalClose}>
                Aceptar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal de Matrícula */}
        <Modal isOpen={isMatriculaModalOpen} onClose={onMatriculaModalClose} size="xl" placement="center">
          <ModalContent>
            <ModalHeader className="flex gap-1 items-center">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Información de Matrícula
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-full text-center">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                    {textosMatricula[imagenMatricula]}
                  </h3>
                </div>

                <div className="w-full flex justify-center">
                  <img
                    src={`/increible${imagenMatricula}.png`}
                    alt={`Información de matrícula ${imagenMatricula}`}
                    className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                    onError={(e) => {
                      e.target.src = `/increible${imagenMatricula}.jpg`;
                      e.target.onerror = () => {
                        e.target.src = '/increible1.png';
                      };
                    }}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onMatriculaModalClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal de Error */}
        <Modal isOpen={isErrorModalOpen} onClose={onErrorModalClose} size="md" placement="center">
          <ModalContent>
            <ModalHeader className="flex gap-1 items-center">
              <div className="bg-red-100 rounded-full p-2 mr-3">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              Error
            </ModalHeader>
            <ModalBody>
              <p className="text-sm md:text-base text-gray-700">
                {mensajeModal}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onErrorModalClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

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
