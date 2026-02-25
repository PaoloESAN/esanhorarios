import { useState, useEffect } from 'react';
import { Button, ButtonGroup } from '@heroui/button';
import { Tabs, Tab } from '@heroui/tabs';
import { useTheme } from 'next-themes';
import PaletaSelector from '@/components/ui/PaletaSelector';
import {
    IconSol, IconLuna, IconTrash, IconTrashAll, IconShare, IconCreditos,
} from '@/constants/icons';

function ContadorCreditos({ total }) {
    return (
        <div className="flex items-center gap-2 bg-primary-50 px-3 md:px-4 py-2 rounded-lg border border-primary-200 shadow-sm">
            <IconCreditos className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Créditos: {total}</span>
        </div>
    );
}

function SelectorHorarios({ activo, onChange }) {
    return (
        <Tabs
            selectedKey={activo.toString()}
            onSelectionChange={(k) => onChange(parseInt(k))}
            aria-label="Opciones de horarios"
        >
            {[1, 2, 3, 4, 5].map(n => <Tab key={n.toString()} title={n.toString()} />)}
        </Tabs>
    );
}

function BotonesLimpiar({ onLimpiarActual, onLimpiarTodos, variant = 'flat' }) {
    const groupClass = variant === 'bordered' ? 'border border-divider rounded-lg shadow-sm' : '';
    return (
        <ButtonGroup size="sm" variant={variant} className={groupClass}>
            <Button onClick={onLimpiarActual} color="danger" variant="flat" startContent={<IconTrash />} className="px-4">
                Actual
            </Button>
            <Button onClick={onLimpiarTodos} color="danger" variant="flat" title="Limpiar todos" startContent={<IconTrashAll />} className="px-4">
                Todos
            </Button>
        </ButtonGroup>
    );
}

function BotonLimpiar({ onLimpiarActual }) {
    return (
        <Button isIconOnly onClick={onLimpiarActual} color="danger" variant="flat" aria-label='limpiar actual' >
            <IconTrash className='w-5 h-5' />
        </Button>
    );
}

function BotonTema({ className = '' }) {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const esDark = mounted && resolvedTheme === 'dark';
    return (
        <Button
            className={className}
            onClick={() => setTheme(esDark ? 'light' : 'dark')}
            color="default"
            size="sm"
            variant="ghost"
            startContent={esDark ? <IconSol /> : <IconLuna />}
        >
            {esDark ? 'Modo claro' : 'Modo oscuro'}
        </Button>
    );
}

/** Fila de control para mobile */
function FilaMobile({ label, children }) {
    return (
        <div className="grid w-full grid-cols-[84px,1fr] items-center gap-3">
            <span className="text-sm font-medium text-foreground-600 whitespace-nowrap">{label}</span>
            <div>{children}</div>
        </div>
    );
}

// ── Componente principal ──────────────────────────────────────────────────────

function EncabezadoHorario({
    horarioActivo,
    creditosTotales,
    paletaSeleccionada,
    coloresActuales,
    cambiarPaleta,
    cambiarHorario,
    limpiarHorario,
    limpiarTodosLosHorarios,
    abrirShareModal,
}) {
    return (
        <>
            {/* ── MOBILE ──────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-6 mb-4 md:hidden items-center">
                <ContadorCreditos total={creditosTotales} />
                <FilaMobile label="Modo:">
                    <BotonTema className="w-full justify-start" />
                </FilaMobile>
                <FilaMobile label="Tema:">
                    <PaletaSelector
                        paletaSeleccionada={paletaSeleccionada}
                        coloresActuales={coloresActuales}
                        onChange={cambiarPaleta}
                        className="w-full"
                    />
                </FilaMobile>
                <FilaMobile label="Horarios:">
                    <SelectorHorarios activo={horarioActivo} onChange={cambiarHorario} />
                </FilaMobile>
                <FilaMobile label="Limpiar:">
                    <BotonesLimpiar onLimpiarActual={limpiarHorario} onLimpiarTodos={limpiarTodosLosHorarios} />
                </FilaMobile>
                <FilaMobile label="">
                    <Button
                        onClick={abrirShareModal}
                        color="success"
                        size="sm"
                        variant="flat"
                        startContent={<IconShare />}
                        className="w-full px-6 shadow-sm border border-success-200"
                    >
                        <span className="font-medium">Compartir Horario</span>
                    </Button>
                </FilaMobile>
            </div>

            {/* ── DESKTOP ─────────────────────────────────────────────────── */}
            <div className="md:flex flex-col gap-4 mb-4 hidden">


                {/* Fila 2: Horarios | Boton Limpiar | Tema | Compartir Horario */}
                <div className="flex flex-row items-center justify-between gap-4 ">
                    <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-medium text-foreground-600 whitespace-nowrap">Horarios:</span>
                        <SelectorHorarios activo={horarioActivo} onChange={cambiarHorario} />
                        <BotonLimpiar onLimpiarActual={limpiarHorario} />
                    </div>
                    <ContadorCreditos total={creditosTotales} />
                    <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-medium text-foreground-600 whitespace-nowrap">Tema:</span>
                        <PaletaSelector
                            paletaSeleccionada={paletaSeleccionada}
                            coloresActuales={coloresActuales}
                            onChange={cambiarPaleta}
                            className="min-w-[160px]"
                        />
                        <Button
                            onClick={abrirShareModal}
                            color="success"
                            size="sm"
                            variant="flat"
                            startContent={<IconShare />}
                            className="px-6 shadow-sm border border-success-200 whitespace-nowrap min-w-fit"
                        >
                            <span className="font-medium whitespace-nowrap">Compartir Horario</span>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EncabezadoHorario;
