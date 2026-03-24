import { useRef, useEffect } from 'react';
import { Button, Select, Label, ListBox, Chip } from '@heroui/react';
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
    const talleresInputRef = useRef(null);

    useEffect(() => {
        listaRef.current?.scrollTo({ top: 0 });
    }, [cicloSeleccionado]);

    const esTaller = (nombre) => nombre.toLowerCase().includes('taller');

    const hayAlgunTallerEnExcel = hayArchivo && Object.values(cursosPorCiclo).some(cursos =>
        cursos.some(c => esTaller(c) && obtenerHorariosPorCurso(c).length > 0)
    );

    const handleOpenTalleresPicker = () => {
        if (!talleresInputRef.current || cargandoTalleres) return;
        talleresInputRef.current.value = '';
        talleresInputRef.current.click();
    };

    return (
        <div className="bg-surface rounded-lg shadow-md p-3 md:p-6 flex flex-col max-h-[70vh] lg:max-h-none h-full overflow-hidden">
            {/* Cabecera del panel */}
            <div className="flex items-center justify-between mb-3 md:mb-4">
                <h2 className="text-lg md:text-xl font-semibold text-foreground">Cursos Disponibles</h2>
                <Button
                    onPress={onAbrirModalCursoPersonalizado}
                    variant="secondary"
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
                    value={cicloSeleccionado}
                    onChange={(value) => {
                        if (value && value !== cicloSeleccionado) setCicloSeleccionado(value);
                    }}
                    placeholder="Selecciona un ciclo"
                    className="w-full"
                >
                    <Label>Seleccionar Ciclo</Label>
                    <Select.Trigger className="border border-divider bg-surface-secondary">
                        <Select.Value />
                        <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                        <ListBox>
                            {Object.keys(cursosPorCiclo).map((ciclo) => (
                                <ListBox.Item key={ciclo} id={ciclo} textValue={ciclo}>
                                    {ciclo}
                                    <ListBox.ItemIndicator />
                                </ListBox.Item>
                            ))}
                        </ListBox>
                    </Select.Popover>
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
                            <div key={idx} className="border border-divider rounded-lg p-2 md:p-3 bg-surface-secondary">
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
                                                    <BadgeCheck className="w-3 h-3 text-accent" />
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
                                            <div className="p-2 bg-overlay border border-divider rounded text-center">
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
                                                    <>
                                                        <Button
                                                            variant="tertiary"
                                                            size="sm"
                                                            className="cursor-pointer"
                                                            isPending={cargandoTalleres}
                                                            onPress={handleOpenTalleresPicker}
                                                        >
                                                            {!cargandoTalleres && <CloudUpload size={14} />}
                                                            {cargandoTalleres ? 'Cargando...' : 'Subir Excel de Talleres'}
                                                        </Button>
                                                        <input
                                                            ref={talleresInputRef}
                                                            type="file"
                                                            accept=".xlsx,.xls"
                                                            onChange={onCargaTalleres}
                                                            className="hidden"
                                                            disabled={cargandoTalleres}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="p-2 bg-overlay border border-divider rounded text-center">
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

