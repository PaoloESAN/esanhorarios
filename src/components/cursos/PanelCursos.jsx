import { memo } from 'react';
import { Button } from '@heroui/button';
import { Select, SelectItem } from '@heroui/select';
import { useCarrera } from '@/app/[slug]/CarreraContext';
import { IconMas, IconCreditoBadge } from '@/constants/icons';
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
}) {
    const { cursosPorCiclo, obtenerCreditos } = useCarrera();
    const hayArchivo = Boolean(nombreArchivo);

    return (
        <div className="order-1 lg:order-1 w-full lg:w-80 bg-content1 rounded-lg shadow-md p-3 md:p-6">
            {/* Cabecera del panel */}
            <div className="flex items-center justify-between mb-3 md:mb-4">
                <h2 className="text-lg md:text-xl font-semibold text-foreground">Cursos Disponibles</h2>
                <Button
                    onClick={onAbrirModalCursoPersonalizado}
                    color="primary"
                    variant="flat"
                    size="sm"
                    isIconOnly
                    title="Agregar curso personalizado"
                >
                    <IconMas />
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
                <div className="space-y-3 max-h-[calc(100vh-500px)] lg:max-h-[56.75rem] overflow-y-auto">
                    {cursosPorCiclo[cicloSeleccionado]?.map((curso, idx) => {
                        const secciones = obtenerHorariosPorCurso(curso);
                        const creditos = obtenerCreditos(curso);
                        const esElectivo = curso.toLowerCase().includes('electivo');

                        return (
                            <div key={idx} className="border border-divider rounded-lg p-2 md:p-3 bg-content2">
                                {/* Cabecera del curso */}
                                <h4 className="font-semibold text-foreground text-xs md:text-sm mb-2 md:mb-3 border-b border-divider pb-2">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="flex-1">{curso}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-bold border border-emerald-200">
                                                <IconCreditoBadge className="w-3 h-3 text-emerald-600" />
                                                {creditos}
                                            </span>
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
                                        <div className="p-2 bg-content3 border border-divider rounded text-center">
                                            <div className="text-xs text-foreground-500">No hay horarios disponibles</div>
                                        </div>
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

export default memo(PanelCursos);
