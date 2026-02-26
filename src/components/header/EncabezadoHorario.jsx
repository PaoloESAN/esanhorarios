import { Button } from '@heroui/button';
import { Tabs, Tab } from '@heroui/tabs';
import {
    Trash2, Share2, BadgeCheck, Brush,
} from 'lucide-react';

function ContadorCreditos({ total }) {
    return (
        <div className="flex items-center gap-2 bg-primary-50 px-3 md:px-4 py-2 rounded-lg border border-primary-200 shadow-sm">
            <BadgeCheck size={18} className="text-primary" />
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

function BotonLimpiar({ onLimpiarActual }) {
    return (
        <Button onClick={onLimpiarActual} color="danger" variant="flat" aria-label='limpiar actual' startContent={<Trash2 size={18} />} className="px-4">
            Limpiar
        </Button>
    );
}

// ── Componente principal ──────────────────────────────────────────────────────

function EncabezadoHorario({
    horarioActivo,
    creditosTotales,
    cambiarHorario,
    limpiarHorario,
    abrirShareModal,
    abrirConfigDrawer,
}) {
    return (
        <>
            {/* ── MOBILE ───────────────────────────────────────────── */}
            <div className="flex flex-col gap-4 mb-4 md:hidden items-center">
                <ContadorCreditos total={creditosTotales} />
                <div className="flex flex-col w-full gap-3 items-center">
                    <span className="text-sm font-medium text-foreground-600 whitespace-nowrap">Horarios:</span>
                    <div className="flex items-center gap-3">
                        <SelectorHorarios activo={horarioActivo} onChange={cambiarHorario} />
                        <BotonLimpiar onLimpiarActual={limpiarHorario} />
                    </div>
                </div>
                <div className="flex w-full gap-3">
                    <Button
                        onClick={abrirConfigDrawer}
                        color="warning"
                        size="sm"
                        variant="flat"
                        startContent={<Brush size={18} />}
                        className="flex-1 border border-warning-200 shadow-sm"
                    >
                        Personalizar
                    </Button>
                    <Button
                        onClick={abrirShareModal}
                        color="success"
                        size="sm"
                        variant="flat"
                        startContent={<Share2 size={18} />}
                        className="flex-1 shadow-sm border border-success-200"
                    >
                        <span className="font-medium">Compartir Horario</span>
                    </Button>
                </div>
            </div>

            {/* ── DESKTOP ─────────────────────────────────────────────────── */}
            <div className="md:flex flex-col gap-4 mb-4 hidden">
                {/* Fila 2: Horarios | Boton Limpiar | Creditos | Personalizar | Compartir Horario */}
                <div className='lg:hidden justify-center items-center flex'>
                    <ContadorCreditos total={creditosTotales} />
                </div>
                <div className="flex flex-row items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-medium text-foreground-600 whitespace-nowrap">Horarios:</span>
                        <SelectorHorarios activo={horarioActivo} onChange={cambiarHorario} />
                        <BotonLimpiar onLimpiarActual={limpiarHorario} />
                    </div>
                    <div className='hidden lg:flex'>
                        <ContadorCreditos total={creditosTotales} />
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <Button
                            onClick={abrirConfigDrawer}
                            color="warning"
                            size="sm"
                            variant="flat"
                            startContent={<Brush size={18} />}
                            className="px-6 border border-warning-200 shadow-sm"
                        >
                            <span className="font-medium whitespace-nowrap">Personalizar</span>
                        </Button>
                        <Button
                            onClick={abrirShareModal}
                            color="success"
                            size="sm"
                            variant="flat"
                            startContent={<Share2 size={18} />}
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
