"use client";

import { useState } from "react";
import * as XLSX from 'xlsx';
import domtoimage from 'dom-to-image';

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
  const [mostrarModalConflicto, setMostrarModalConflicto] = useState(false);
  const [conflictoInfo, setConflictoInfo] = useState({ cursoExistente: '', cursoNuevo: '' });
  const [cursosSeleccionados, setCursosSeleccionados] = useState(new Set());
  const [horariosDisponibles, setHorariosDisponibles] = useState(horariosIniciales);
  const [cargandoArchivo, setCargandoArchivo] = useState(false);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const [mostrarModalError, setMostrarModalError] = useState(false);
  const [mensajeModal, setMensajeModal] = useState('');
  const [nombreArchivo, setNombreArchivo] = useState('');

  const procesarArchivoExcel = async (archivo) => {
    setCargandoArchivo(true);

    try {
      const data = await archivo.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      console.log('Datos del Excel:', jsonData);

      const nuevosHorarios = parsearDatosExcel(jsonData);
      setHorariosDisponibles(nuevosHorarios);

      setMensajeModal('¡Archivo Excel cargado exitosamente!');
      setMostrarModalExito(true);
    } catch (error) {
      console.error('Error al procesar archivo Excel:', error);
      setMensajeModal('Error al cargar el archivo Excel. Por favor, verifica el formato.');
      setMostrarModalError(true);
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
        } else if (enc.includes('SECCION') || enc.includes('SECCIÓN')) {
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

    console.log('Índices de columnas encontrados:', indiceColumnas);

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

      console.log(`Procesando curso: "${curso}" -> normalizado: "${cursoNormalizado}"`);

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

    console.log('Cursos procesados exitosamente:', Object.keys(horariosParseados));
    console.log('Total de cursos encontrados:', Object.keys(horariosParseados).length);

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

          if (minutoActual <= 30) {
            if (horaActual > 0) {
              const horaAnterior = horaActual - 1;
              horarioFormateado = `${horaAnterior.toString().padStart(2, '0')}:30-${horaActual.toString().padStart(2, '0')}:15`;
            }
          } else {
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
        setMostrarModalConflicto(true);
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
      setMostrarModalExito(true);

    } catch (error) {
      console.error('Error al capturar la tabla:', error);

      try {
        await compartirHorarioAlternativo();
      } catch (errorFallback) {
        console.error('Error en método alternativo:', errorFallback);
        setMensajeModal('Error al guardar la imagen. Por favor, intenta de nuevo.');
        setMostrarModalError(true);
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
        setMostrarModalExito(true);
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
                Creador de Horarios - Ingeniería de Software
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                Arrastra los cursos desde el panel lateral hacia la tabla de horarios
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
              <label className={`cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg font-medium inline-flex items-center gap-1 md:gap-2 text-xs md:text-sm ${cargandoArchivo ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <svg className="w-3 h-3 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="hidden sm:inline">{cargandoArchivo ? 'Cargando...' : 'Cargar Excel'}</span>
                <span className="sm:hidden">Excel</span>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={manejarCargaArchivo}
                  className="hidden"
                  disabled={cargandoArchivo}
                />
              </label>

              <button
                onClick={limpiarHorario}
                className="bg-red-500 hover:bg-red-600 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg font-medium text-xs md:text-sm"
              >
                <span className="hidden sm:inline">Limpiar Horario</span>
                <span className="sm:hidden">Limpiar</span>
              </button>

              <button
                onClick={compartirHorario}
                className="bg-green-500 hover:bg-green-600 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg font-medium inline-flex items-center gap-1 md:gap-2 text-xs md:text-sm"
              >
                <svg className="w-3 h-3 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span className="hidden sm:inline">Compartir</span>
                <span className="sm:hidden">IMG</span>
              </button>
            </div>
          </div>
        </div>

        {/* Layout Principal - Responsive */}
        <div className="flex flex-col lg:flex-row gap-3 md:gap-6">
          {/* Tabla de Horarios - Primera en Mobile */}
          <div className="order-1 lg:order-2 flex-1 bg-white rounded-lg shadow-md p-3 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Mi Horario Personal</h2>

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
                                      <span className="block md:hidden">
                                        {claseAsignada.curso.length > 8
                                          ? claseAsignada.curso.substring(0, 8) + '...'
                                          : claseAsignada.curso
                                        }
                                      </span>
                                      <span className="hidden md:block">
                                        {claseAsignada.curso.length > 25
                                          ? claseAsignada.curso.substring(0, 25) + '...'
                                          : claseAsignada.curso
                                        }
                                      </span>
                                    </div>
                                    <div className={`${colorCurso.textSecondary} text-xs hidden md:block`}>
                                      {claseAsignada.seccion}
                                    </div>
                                    <div className={`${colorCurso.textSecondary} text-xs hidden md:block`}>
                                      {claseAsignada.profesor.length > 20
                                        ? claseAsignada.profesor.substring(0, 20) + '...'
                                        : claseAsignada.profesor
                                      }
                                    </div>
                                    {claseAsignada.aula && (
                                      <div className={`${colorCurso.textSecondary} text-xs hidden md:block`}>
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
          <div className="order-2 lg:order-1 w-full lg:w-80 bg-white rounded-lg shadow-md p-3 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Cursos Disponibles</h2>

            {/* Selector de Ciclo */}
            <div className="mb-4 md:mb-6">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Seleccionar Ciclo:
              </label>
              <select
                value={cicloSeleccionado}
                onChange={(e) => setCicloSeleccionado(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.keys(cursosIngenieriaSoftware).map((ciclo) => (
                  <option key={ciclo} value={ciclo}>
                    {ciclo}
                  </option>
                ))}
              </select>
            </div>

            {/* Lista de Cursos por Categorías */}
            <div className="space-y-3 max-h-[300px] lg:max-h-[calc(100vh-500px)] overflow-y-auto">
              {cursosIngenieriaSoftware[cicloSeleccionado]?.map((curso, index) => {
                const horariosDisponiblesDelCurso = obtenerHorariosPorCurso(curso);

                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-2 md:p-3">
                    <h4 className="font-semibold text-gray-800 text-xs md:text-sm mb-2 md:mb-3 border-b border-gray-200 pb-2">
                      {curso}
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
                                }`}>
                                Prof: {seccionData.profesor.length > 25
                                  ? seccionData.profesor.substring(0, 25) + '...'
                                  : seccionData.profesor
                                }
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

        {/* Modal de Conflicto */}
        {mostrarModalConflicto && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg p-4 md:p-6 max-w-md w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 rounded-full p-2 mr-3">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.862-.833-2.632 0L4.182 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Conflicto de Horarios</h3>
              </div>

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

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setMostrarModalConflicto(false)}
                  className="px-3 md:px-4 py-2 text-sm md:text-base text-gray-600 hover:text-gray-800 font-medium"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Éxito */}
        {mostrarModalExito && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg p-4 md:p-6 max-w-md w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 rounded-full p-2 mr-3">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900">¡Éxito!</h3>
              </div>

              <div className="mb-6">
                <p className="text-sm md:text-base text-gray-700">
                  {mensajeModal}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setMostrarModalExito(false)}
                  className="px-3 md:px-4 py-2 text-sm md:text-base bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Error */}
        {mostrarModalError && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg p-4 md:p-6 max-w-md w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 rounded-full p-2 mr-3">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Error</h3>
              </div>

              <div className="mb-6">
                <p className="text-sm md:text-base text-gray-700">
                  {mensajeModal}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setMostrarModalError(false)}
                  className="px-3 md:px-4 py-2 text-sm md:text-base bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
