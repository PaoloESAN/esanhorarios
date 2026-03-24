import { Modal, Button } from "@heroui/react";
import { Share2, Copy, Download, FileSpreadsheet } from 'lucide-react';
import { diasSemana, generarHorarios } from '@/lib/horario';
import { useConfigHorario, acortarNombreProfesor, invertirOrdenProfesor } from '@/hooks/useConfigHorario';

const horariosDelDia = generarHorarios();

const BORDER_STYLE = {
    top: { style: 'thin', color: { rgb: '000000' } },
    bottom: { style: 'thin', color: { rgb: '000000' } },
    left: { style: 'thin', color: { rgb: '000000' } },
    right: { style: 'thin', color: { rgb: '000000' } },
};

const HEADER_STYLE = {
    font: { bold: true, sz: 11 },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: BORDER_STYLE,
    fill: { fgColor: { rgb: 'E2E8F0' } },
};

const CELL_STYLE = {
    font: { sz: 10 },
    alignment: { wrapText: true, vertical: 'top' },
    border: BORDER_STYLE,
};

const HORA_STYLE = {
    font: { sz: 10 },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: BORDER_STYLE,
};

function formatearProfesor(nombre, nombreCortoProfesor, nombrePrimero) {
    if (nombreCortoProfesor) {
        return acortarNombreProfesor(nombre, nombrePrimero);
    } else if (nombrePrimero) {
        return invertirOrdenProfesor(nombre);
    }
    return nombre;
}

function exportarHorarioExcel(horarioPersonal, notasCelda, horarioActivo, config) {
    const { camposVisibles, nombreCortoProfesor, nombrePrimero } = config;
    import('xlsx-js-style').then((XLSX) => {
        const header = ['Hora', ...diasSemana];
        const filas = horariosDelDia.map((horario) => {
            const fila = [horario];
            for (const dia of diasSemana) {
                const key = `${dia}-${horario}`;
                const clase = horarioPersonal[key];
                const nota = notasCelda[key];

                if (clase) {
                    const profesor = formatearProfesor(clase.profesor, nombreCortoProfesor, nombrePrimero);
                    const partes = [
                        camposVisibles.curso && clase.curso,
                        camposVisibles.seccion && clase.seccion,
                        camposVisibles.profesor && profesor,
                        camposVisibles.aula && clase.aula,
                    ].filter(Boolean);
                    fila.push(partes.join('\n'));
                } else if (nota) {
                    fila.push(nota.texto || '');
                } else {
                    fila.push('');
                }
            }
            return fila;
        });

        const datos = [header, ...filas];
        const ws = XLSX.utils.aoa_to_sheet(datos);

        // Calcular anchos óptimos por columna
        const colWidths = header.map((_, colIdx) => {
            let maxLen = header[colIdx].length;
            for (const fila of filas) {
                const val = fila[colIdx] || '';
                // Para celdas con saltos de línea, tomar la línea más larga
                const lines = val.split('\n');
                for (const line of lines) {
                    maxLen = Math.max(maxLen, line.length);
                }
            }
            return { wch: Math.min(maxLen + 2, 40) };
        });
        ws['!cols'] = colWidths;

        // Aplicar estilos a todas las celdas
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let R = range.s.r; R <= range.e.r; R++) {
            for (let C = range.s.c; C <= range.e.c; C++) {
                const addr = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[addr]) ws[addr] = { v: '', t: 's' };

                if (R === 0) {
                    // Fila de encabezado
                    ws[addr].s = HEADER_STYLE;
                } else if (C === 0) {
                    // Columna de hora
                    ws[addr].s = HORA_STYLE;
                } else {
                    // Celdas de contenido
                    ws[addr].s = CELL_STYLE;
                }
            }
        }

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `Horario ${horarioActivo}`);
        XLSX.writeFile(wb, `horario-${horarioActivo}.xlsx`);
    });
}

export default function ShareModal({
    isOpen, onClose, dataUrl, onCopy, onDownload,
    filename = 'mi-horario.png',
    horarioPersonal, notasCelda, horarioActivo,
}) {
    const { config } = useConfigHorario();
    return (
        <Modal>
            <Modal.Trigger className="sr-only">
                <span />
            </Modal.Trigger>
            <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose?.()}>
                <Modal.Container size="lg" placement="center">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header className="flex gap-1 items-center">
                            <div className="bg-accent-soft rounded-full p-2 mr-3">
                                <Share2 className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                            </div>
                            <Modal.Heading className="text-foreground">Compartir horario</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="space-y-4">
                                <div className="text-sm text-foreground-600">Previsualización ({filename})</div>
                                <div className="w-full max-h-[60vh] overflow-auto bg-surface-secondary border border-divider rounded-lg p-2 flex justify-center">
                                    {dataUrl ? (
                                        <img src={dataUrl} alt="Previsualización del horario" className="max-w-full h-auto rounded-md shadow" />
                                    ) : (
                                        <div className="text-foreground-500 text-sm">Generando imagen…</div>
                                    )}
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center">
                                <Button className="w-full sm:w-auto" variant="danger-soft" onPress={onClose}>Cerrar</Button>
                                <div className="flex w-full sm:w-auto gap-2 sm:ml-auto flex-wrap">
                                    <Button
                                        className="w-full sm:w-auto"
                                        variant="secondary"
                                        onPress={() => exportarHorarioExcel(horarioPersonal, notasCelda, horarioActivo, config)}
                                        isDisabled={!dataUrl}
                                    >
                                        <FileSpreadsheet size={18} />
                                        Excel
                                    </Button>
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <Button
                                            className="w-full sm:w-auto"
                                            variant="secondary"
                                            onPress={onCopy}
                                            isDisabled={!dataUrl}
                                        >
                                            <Copy size={18} />
                                            Copiar imagen
                                        </Button>
                                        <Button
                                            className="w-full sm:w-auto"
                                            variant="secondary"
                                            onPress={onDownload}
                                            isDisabled={!dataUrl}
                                        >
                                            <Download size={18} />
                                            Descargar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
