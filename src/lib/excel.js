import { read, utils } from 'xlsx';

/** "GARCIA LOPEZ JUAN CARLOS" → "Garcia Lopez Juan Carlos" */
const capitalizarNombre = (texto) =>
    texto.replace(/\S+/g, (p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());

/**
 * Correcciones semánticas de nombres de cursos.
 * Solo incluye entradas donde el nombre real difiere del que aparece en el Excel
 */
export const aliasCorrecciones = {
    "INGENIERIA DE PROCESOS DE NEGOCIO": "INGENIERIA DE PROCESOS DE NEGOCIOS",
    "PRECALCULO": "PRE CALCULO",
};

export const extraerHorarios = (textoHorario) => {
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

            const horarioFormateado = `${horaInicio.toString().padStart(2, '0')}:30-${(horaInicio + 1).toString().padStart(2, '0')}:15`;

            if (!horarios.some(h => h.horario === horarioFormateado)) {
                horarios.push({
                    horario: horarioFormateado,
                    aula: aula || 'Por definir'
                });
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

export const parsearDatosExcel = (datos) => {
    const horariosParseados = {};

    let filaEncabezados = -1;
    for (let i = 0; i < Math.min(10, datos.length); i++) {
        const fila = datos[i];
        if (!fila) continue;
        const textos = fila
            .filter(c => c && typeof c === 'string')
            .map(c => c.toUpperCase());
        const tieneCurso = textos.some(t =>
            t.includes('CURSO') || t.includes('MATERIA') || t.includes('ASIGNATURA'));
        const tieneDiaOSeccion = textos.some(t =>
            t.includes('LUNES') || t.includes('MARTES') ||
            t.includes('MIÉRCOLES') || t.includes('MIERCOLES') ||
            t.includes('JUEVES') || t.includes('VIERNES') ||
            t.includes('SÁBADO') || t.includes('SABADO') ||
            t.includes('SECCION') || t.includes('SECCIÓN') ||
            t.includes('PROFESOR') || t.includes('DOCENTE'));
        if (tieneCurso && tieneDiaOSeccion) {
            filaEncabezados = i;
            break;
        }
    }

    if (filaEncabezados === -1) {
        console.warn('No se encontraron encabezados válidos');
        return {};
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
            } else if (enc.includes('MIÉRCOLES') || enc.includes('MIERCOLES')) {
                indiceColumnas.miercoles = index;
            } else if (enc.includes('JUEVES')) {
                indiceColumnas.jueves = index;
            } else if (enc.includes('VIERNES')) {
                indiceColumnas.viernes = index;
            } else if (enc.includes('SÁBADO') || enc.includes('SABADO')) {
                indiceColumnas.sabado = index;
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
                            aula: horarioObj.aula
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
                profesor: capitalizarNombre(profesor.toString().trim()),
                seccion: seccion ? seccion.toString().trim() : 'S-001',
                horarios: horarios
            });
        }
    }

    return horariosParseados;
};

export const procesarArchivoExcel = async (archivo) => {
    const data = await archivo.arrayBuffer();
    const workbook = read(data);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

    return parsearDatosExcel(jsonData);
};
