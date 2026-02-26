import { diasSemana, generarHorarios } from '@/lib/horario';
import { useConfigHorario } from '@/hooks/useConfigHorario';
import CeldaAsignada from './CeldaAsignada';
import CeldaVacia from './CeldaVacia';

const horariosDelDia = generarHorarios();

/**
 * Tabla de horarios semanal.
 * Muestra la grilla de días × franjas horarias y delega la
 * representación de cada celda a CeldaAsignada / CeldaVacia.
 */
function TablaHorario({
    horarioPersonal,
    coloresAsignados,
    coloresActuales,
    notasCelda,
    onRemover,
    onDragOver,
    onDrop,
    onAbrirNota,
    onQuitarNota,
}) {
    const { config } = useConfigHorario();

    // Determinar qué filas mostrar: si ocultarFilasVacias está activo,
    // recortamos las filas finales que estén completamente vacías.
    let filasVisibles = horariosDelDia;
    if (config.ocultarFilasVacias) {
        let ultimaFilaOcupada = -1;
        for (let i = horariosDelDia.length - 1; i >= 0; i--) {
            const horario = horariosDelDia[i];
            const tieneAlgo = diasSemana.some((dia) => {
                const key = `${dia}-${horario}`;
                return horarioPersonal[key] || notasCelda[key];
            });
            if (tieneAlgo) {
                ultimaFilaOcupada = i;
                break;
            }
        }
        // Mostrar al menos hasta la última fila ocupada + 1 extra, o mínimo 6 filas
        const corte = Math.max(ultimaFilaOcupada + 2, 6);
        filasVisibles = horariosDelDia.slice(0, Math.min(corte, horariosDelDia.length));
    }

    return (
        <div className="overflow-x-auto">
            <table
                id="tabla-horario"
                className="w-full min-w-[640px] md:min-w-[900px] table-fixed border-collapse text-xs md:text-sm"
            >
                <thead>
                    <tr>
                        <th className="border border-divider p-1 md:p-2 bg-content2 w-14 md:w-20 text-xs text-foreground">
                            Hora
                        </th>
                        {diasSemana.map((dia) => (
                            <th
                                key={dia}
                                className="border border-divider p-1 md:p-2 bg-content2 min-w-16 md:min-w-32 text-xs text-foreground"
                            >
                                <span className="block md:hidden">{dia.substring(0, 3)}</span>
                                <span className="hidden md:block">{dia}</span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filasVisibles.map((horario) => (
                        <tr key={horario}>
                            <td className="border border-divider p-1 bg-content2 text-xs font-medium text-center text-foreground">
                                <span className="block md:hidden text-xs">{horario.split('-')[0]}</span>
                                <span className="hidden md:block">{horario}</span>
                            </td>
                            {diasSemana.map((dia) => {
                                const key = `${dia}-${horario}`;
                                const clase = horarioPersonal[key];
                                const nota = notasCelda[key];

                                return (
                                    <td
                                        key={key}
                                        className="border border-divider p-0.5 md:p-1 h-7 md:h-12 relative"
                                        onDragOver={onDragOver}
                                        onDrop={(e) => onDrop(e, dia, horario)}
                                    >
                                        {clase ? (
                                            <CeldaAsignada
                                                clase={clase}
                                                color={coloresAsignados.get(clase.id) ?? coloresActuales[0]}
                                                onRemover={() => onRemover(dia, horario)}
                                            />
                                        ) : (
                                            <CeldaVacia
                                                nota={nota}
                                                onAbrirNota={() => onAbrirNota(key)}
                                                onEditarNota={() => onAbrirNota(key)}
                                                onQuitarNota={() => onQuitarNota(key)}
                                            />
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TablaHorario;
