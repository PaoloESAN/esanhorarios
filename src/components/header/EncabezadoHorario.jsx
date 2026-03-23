import { Button, Tabs, Popover } from '@heroui/react';
import {
    Trash2, Share2, BadgeCheck, Brush,
} from 'lucide-react';

function ContadorCreditos({ total }) {
    return (
        <Popover key={total}>
            <Button variant="tertiary" className="h-10 flex items-center gap-2 bg-accent-soft px-3 md:px-4 py-2 rounded-lg border border-accent shadow-sm">
                <BadgeCheck size={18} className="text-accent" />
                <span className="text-sm font-semibold text-accent">Créditos: {total}</span>
            </Button>
            <Popover.Content
                placement="bottom"
                offset={10}
                className="rounded-xl border border-divider bg-content1 shadow-lg"
            >
                <Popover.Dialog className="px-3 py-2.5 max-w-[240px]">
                    <Popover.Heading className="text-sm font-semibold text-foreground leading-snug text-center">
                        Los créditos máximos son 24
                    </Popover.Heading>
                </Popover.Dialog>
            </Popover.Content>
        </Popover>
    );
}

function SelectorHorarios({ activo, onChange }) {
    return (
        <Tabs
            className='mt-5'
            selectedKey={activo.toString()}
            onSelectionChange={(k) => onChange(parseInt(String(k), 10))}
        >
            <Tabs.ListContainer>
                <Tabs.List aria-label="Opciones de horarios">
                    {[1, 2, 3, 4, 5].map((n) => {
                        const id = n.toString();
                        return (
                            <Tabs.Tab key={id} id={id}>
                                {id}
                                <Tabs.Indicator />
                            </Tabs.Tab>
                        );
                    })}
                </Tabs.List>
            </Tabs.ListContainer>
            {[1, 2, 3, 4, 5].map((n) => {
                const id = n.toString();
                return <Tabs.Panel key={`panel-${id}`} id={id} />;
            })}
        </Tabs>
    );
}

function BotonLimpiar({ onLimpiarActual }) {
    return (
        <Button
            onPress={onLimpiarActual}
            variant="danger-soft"
            aria-label='limpiar actual'
            className="h-10 px-4 inline-flex items-center gap-2"
        >
            <Trash2 size={18} />
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
                        onPress={abrirConfigDrawer}
                        size="sm"
                        variant="tertiary"
                        className="flex-1 border border-warning-200 shadow-sm inline-flex items-center justify-center gap-2"
                    >
                        <Brush size={18} />
                        Personalizar
                    </Button>
                    <Button
                        onPress={abrirShareModal}
                        size="sm"
                        variant="tertiary"
                        className="flex-1 shadow-sm border border-success-200 inline-flex items-center justify-center gap-2"
                    >
                        <Share2 size={18} />
                        <span className="font-medium">Compartir Horario</span>
                    </Button>
                </div>
            </div>

            {/* ── DESKTOP ─────────────────────────────────────────────────── */}
            <div className="md:flex flex-col gap-4 mb-4 hidden">
                {/* Fila: Horarios | Boton Limpiar | Creditos | Personalizar | Compartir Horario */}
                <div className='lg:hidden justify-center items-center flex'>
                    <ContadorCreditos total={creditosTotales} />
                </div>
                <div className="flex flex-row items-start justify-between gap-4 flex-wrap">
                    <div className="h-10 flex items-center gap-3 shrink-0">
                        <span className="h-full flex items-center text-sm font-medium text-foreground-600 whitespace-nowrap">Horarios:</span>
                        <div className="h-full flex items-center">
                            <SelectorHorarios activo={horarioActivo} onChange={cambiarHorario} />
                        </div>
                        <BotonLimpiar onLimpiarActual={limpiarHorario} />
                    </div>
                    <div className='hidden lg:flex h-10 items-center'>
                        <ContadorCreditos total={creditosTotales} />
                    </div>
                    <div className="h-10 flex items-center gap-3 shrink-0">
                        <Button
                            onPress={abrirConfigDrawer}
                            size="sm"
                            variant="secondary"
                            className="h-full px-6 border border-warning-200 shadow-sm inline-flex items-center justify-center gap-2"
                        >
                            <Brush size={18} />
                            <span className="font-medium whitespace-nowrap">Personalizar</span>
                        </Button>
                        <Button
                            onPress={abrirShareModal}
                            size="sm"
                            variant="secondary"
                            className="h-full px-6 shadow-sm border border-success-200 whitespace-nowrap min-w-fit inline-flex items-center justify-center gap-2"
                        >
                            <Share2 size={18} />
                            <span className="font-medium whitespace-nowrap">Compartir Horario</span>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EncabezadoHorario;
