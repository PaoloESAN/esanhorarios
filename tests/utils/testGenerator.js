import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { read, utils } from 'xlsx';
import { parsearDatosExcel, aliasCorrecciones } from '../../src/lib/excel.js';
import { normalizar } from '../../src/lib/horario.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function generarTestCarrera(carreraData) {
    describe(`CARRERA: ${carreraData.nombre}`, () => {
        let horariosParseados = {};

        let mapaHorariosNormalizados;
        let mapaAliasNormalizados;

        beforeAll(() => {
            // Encontrar Excel en la carpeta tests/excel
            const testDataDir = path.join(__dirname, '..', 'excel');
            if (!fs.existsSync(testDataDir)) {
                fs.mkdirSync(testDataDir, { recursive: true });
                throw new Error(`\n\n[!] Error crítico: La carpeta de datos "${testDataDir}" no existía. Hemos creado la carpeta. Por favor coloca un archivo Excel (.xlsx o .xls) con los horarios ahí y vuelve a correr el test.\n`);
            }

            const files = fs.readdirSync(testDataDir);
            const excelFile = files.find(f => f.endsWith('.xlsx') || f.endsWith('.xls'));

            if (!excelFile) {
                throw new Error(`\n\n[!] Error crítico: No se ha encontrado ningún archivo Excel en "${testDataDir}".\nPor favor, asegúrate de colocar el archivo Excel a probar allí.\n`);
            }

            const filePath = path.join(testDataDir, excelFile);
            const buffer = fs.readFileSync(filePath);

            const workbook = read(buffer);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

            horariosParseados = parsearDatosExcel(jsonData);

            if (Object.keys(horariosParseados).length === 0) {
                throw new Error(`\n\n[!] Error crítico: El archivo Excel "${excelFile}" no contiene datos válidos o no tiene la estructura de los horarios esperada.\n`);
            }

            mapaHorariosNormalizados = (() => {
                const map = new Map();
                for (const [clave, valor] of Object.entries(horariosParseados)) {
                    map.set(normalizar(clave), valor);
                }
                return map;
            })();

            mapaAliasNormalizados = (() => {
                const map = new Map();
                for (const [k, v] of Object.entries(aliasCorrecciones)) {
                    map.set(normalizar(k), normalizar(v));
                }
                return map;
            })();
        });

        const obtenerHorariosPorCurso = (nombreCurso) => {
            const key = normalizar(nombreCurso);
            if (mapaHorariosNormalizados.has(key)) return mapaHorariosNormalizados.get(key);
            const alias = mapaAliasNormalizados.get(key);
            if (alias && mapaHorariosNormalizados.has(alias)) return mapaHorariosNormalizados.get(alias);
            return [];
        };

        it(`Verificando todos los cursos de la carrera`, () => {
            const ciclos = Object.keys(carreraData.cursos);
            let erroresAgrupados = [];

            ciclos.forEach(ciclo => {
                const cursosDelCiclo = Object.keys(carreraData.cursos[ciclo]);
                const cursosFaltantes = [];

                for (const curso of cursosDelCiclo) {
                    const nombreMinuscula = curso.toLowerCase();
                    if (nombreMinuscula.includes('electivo') || nombreMinuscula.includes('trabajo de tesis')) {
                        continue;
                    }

                    const horarios = obtenerHorariosPorCurso(curso);

                    if (!horarios || horarios.length === 0) {
                        cursosFaltantes.push(curso);
                    }
                }

                if (cursosFaltantes.length > 0) {
                    const errorMsg = `En ${ciclo}, no se ha encontrado NINGÚN horario en el Excel para:\n` +
                        cursosFaltantes.map(c => `  ❌ ${c}`).join('\n');
                    erroresAgrupados.push(errorMsg);
                }
            });

            if (erroresAgrupados.length > 0) {
                const finalMensaje = '\n\n' + erroresAgrupados.join('\n\n') + '\n';
                const err = new Error(finalMensaje);
                err.name = ' '; // Esto quita la palabra "Error:" del inicio
                err.stack = ''; // Esto quita el rastro de lineas de código
                throw err;
            }
        });
    });
}
