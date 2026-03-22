import { useRef, useEffect } from 'react';
import { Button, Select, SelectItem, Chip } from '@heroui/react';
import { useCarrera } from '@/app/[slug]/CarreraContext';
import { Plus, BadgeCheck, CloudUpload, FileText } from 'lucide-react';
import TarjetaSeccion from './TarjetaSeccion';
import PantallaSubirExcel from '@/components/excel/PantallaSubirExcel';

function PanelCursos({
    cicloSeleccionado, setCicloSeleccionado,
    cursosSeleccionados,
    nombreArchivo, cargandoArchivo,
    obtenerHorariosPorCurso,
    onAgregarCurso,
    onRemoverCurso,
    onDragStart,
    onAbrirModalCursoPersonalizado,
    onCargaArchivo,
    onCargaTalleres,
    cargandoTalleres,
    nombreArchivoTalleres,
}) {
    const { cursosPorCiclo, obtenerCreditos } = useCarrera();
    const hayArchivo = Boolean(nombreArchivo);
    const listaRef = useRef(null);

    useEffect(() => {
        listaRef.current?.scrollTo({ top: 0 });
    }, [cicloSeleccionado]);

    const esTaller = (nombre) => nombre.toLowerCase().includes('taller');

    const hayAlgunTallerEnExcel = hayArchivo && Object.values(cursosPorCiclo).some(cursos =>
        cursos.some(c => esTaller(c) && obtenerHorariosPorCurso(c).length > 0)
    );

    return (
        <div className="bg-content1 rounded-lg shadow-md p-3 md:p-6 flex flex-col max-h-[70vh] lg:max-h-none h-full overflow-hidden">
            {/* Cabecera del panel */}
            <div className="flex items-center justify-between mb-3 md:mb-4">
                <h2 className="text-lg md:text-xl font-semibold text-foreground">Cursos Disponibles</h2>
                <Button
                    onPress={onAbrirModalCursoPersonalizado}
                    variant="tertiary"
                    size="sm"
                    isIconOnly
                    title="Agregar curso personalizado"
                >
                    <Plus />
                </Button>
            </div>

            {/* Selector de ciclo */}
            <div className="mb-4 md:mb-6">
                <Select
                    label="Seleccionar Ciclo"
                    labelPlacement="outside"
                    placeholder="Selecciona un ciclo"
                    selectedKeys={[cicloSeleccionado]}
                    onSelectionChange={(keys) => {
                        const k = Array.from(keys)[0];
                        if (k && k !== cicloSeleccionado) setCicloSeleccionado(k);
                    }}
                    size="sm"
                    variant="bordered"
                    disallowEmptySelection
                >
                    {Object.keys(cursosPorCiclo).map((ciclo) => (
                        <SelectItem key={ciclo} value={ciclo}>{ciclo}</SelectItem>
                    ))}
                </Select>
            </div>

            {/* Lista de cursos o pantalla de bienvenida */}
            {hayArchivo ? (
                <div ref={listaRef} className="space-y-3 flex-1 min-h-0 overflow-y-auto">
                    {cursosPorCiclo[cicloSeleccionado]?.map((curso, idx) => {
                        const secciones = obtenerHorariosPorCurso(curso);
                        const creditos = obtenerCreditos(curso);
                        const esElectivo = curso.toLowerCase().includes('electivo');
                        const cursoEsTaller = esTaller(curso);

                        return (
                            <div key={idx} className="border border-divider rounded-lg p-2 md:p-3 bg-content2">
                                {/* Cabecera del curso */}
                                <h4 className="font-semibold text-foreground text-xs md:text-sm mb-2 md:mb-3 border-b border-divider pb-2">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="flex-1">{curso}</span>
                                        <div className="flex items-center gap-2">
                                            <Chip
                                                color='accent'
                                                variant='tertiary'
                                                size='sm'
                                            >
                                                <div className="flex items-center gap-1">
                                                    <BadgeCheck className="w-3 h-3 text-primary" />
                                                    {creditos}
                                                </div>
                                            </Chip>
                                        </div>
                                    </div>
                                </h4>

                                {/* Secciones */}
                                {secciones.length > 0 ? (
                                    <div className="space-y-2">
                                        {secciones.map((seccionData, si) => (
                                            <TarjetaSeccion
                                                key={`${idx}-${si}`}
                                                curso={curso}
                                                seccionData={seccionData}
                                                estaSeleccionado={cursosSeleccionados.has(seccionData.id)}
                                                onAgregar={onAgregarCurso}
                                                onRemover={onRemoverCurso}
                                                onDragStart={onDragStart}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    !esElectivo && (
                                        cursoEsTaller && !hayAlgunTallerEnExcel ? (
                                            <div className="p-2 bg-content3 border border-divider rounded text-center">
                                                {nombreArchivoTalleres ? (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <div className="flex items-center gap-1">
                                                            <FileText className="w-3 h-3 text-foreground-500" />
                                                            <span className="text-xs text-foreground-500 truncate max-w-[140px]">
                                                                {nombreArchivoTalleres}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-foreground-500">No hay horarios disponibles</div>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        as="label"
                                                        variant="tertiary"
                                                        size="sm"
                                                        className="cursor-pointer"
                                                        isPending={cargandoTalleres}
                                                        startContent={!cargandoTalleres && <CloudUpload size={14} />}
                                                    >
                                                        {cargandoTalleres ? 'Cargando...' : 'Subir Excel de Talleres'}
                                                        <input
                                                            type="file"
                                                            accept=".xlsx,.xls"
                                                            onChange={onCargaTalleres}
                                                            className="hidden"
                                                            disabled={cargandoTalleres}
                                                        />
                                                    </Button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="p-2 bg-content3 border border-divider rounded text-center">
                                                <div className="text-xs text-foreground-500">No hay horarios disponibles</div>
                                            </div>
                                        )
                                    )
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <PantallaSubirExcel cargandoArchivo={cargandoArchivo} onCargaArchivo={onCargaArchivo} />
            )}
        </div>
    );
}

export default PanelCursos;

