"use client";

import { useState, useEffect } from 'react';
import { Switch, Checkbox, CheckboxGroup, Slider, Button, ButtonGroup, Label } from "@heroui/react";
import { useTheme } from 'next-themes';

import PaletaSelector from "@/components/ui/PaletaSelector";
import { useConfigHorario } from "@/hooks/useConfigHorario";
import { Brush, Sun, Moon, Palette, UserRound, LayoutList, X, ChevronDown } from 'lucide-react';


const CAMPOS_LABELS = {
    curso: "Nombre del curso",
    seccion: "Sección",
    profesor: "Profesor",
    aula: "Salón / Aula",
};

/* ── Accordion ligero con CSS ── */
function LightAccordion({ icon, title, subtitle, isOpen, onToggle, children }) {
    return (
        <div className="rounded-xl bg-content2 overflow-hidden shrink-0">
            <button
                type="button"
                className="w-full flex items-center gap-2 px-4 py-3 text-left cursor-pointer"
                onClick={onToggle}
            >
                {icon}
                <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold block">{title}</span>
                    {subtitle && <span className="text-xs text-foreground-400 block">{subtitle}</span>}
                </div>
                <ChevronDown
                    size={16}
                    className="text-foreground-400 shrink-0"
                    style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.15s ease',
                    }}
                />
            </button>
            <div
                className="accordion-body"
                style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.15s ease',
                }}
            >
                <div style={{ overflow: 'hidden' }}>
                    <div className="px-4 pb-4 flex flex-col gap-5">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Divider simple ── */
function Divider() {
    return <hr className="border-divider my-0" />;
}

/* ── Iconos SVG de alineación inline ── */
const AlignLeftIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h12M3 18h16" />
    </svg>
);
const AlignCenterIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M6 12h12M4 18h16" />
    </svg>
);
const AlignRightIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M9 12h12M5 18h16" />
    </svg>
);

function ConfigDrawer({
    isOpen,
    onClose,
    paletaSeleccionada,
    coloresActuales,
    cambiarPaleta,
}) {
    const { config, actualizarConfig } = useConfigHorario();
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const esDark = mounted && resolvedTheme === 'dark';

    // Prevenir scroll del body cuando está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const camposActivos = Object.entries(config.camposVisibles)
        .filter(([, v]) => v)
        .map(([k]) => k);

    const handleCamposChange = (nuevos) => {
        if (nuevos.length === 0) return;
        const patch = {};
        for (const key of Object.keys(CAMPOS_LABELS)) {
            patch[key] = nuevos.includes(key);
        }
        actualizarConfig({ camposVisibles: patch });
    };

    const [panelAbierto, setPanelAbierto] = useState('apariencia');
    const togglePanel = (key) => setPanelAbierto(prev => prev === key ? null : key);

    return (
        <>
            {/* Backdrop */}
            <div
                className="config-drawer-backdrop"
                data-open={isOpen || undefined}
                onClick={onClose}
            />

            {/* Panel */}
            <aside
                className="config-drawer-panel"
                data-open={isOpen || undefined}
                aria-hidden={!isOpen}
            >
                {/* Header */}
                <header className="flex items-center gap-2 px-4 py-3 border-b border-divider shrink-0">
                    <Brush size={18} className="text-primary" />
                    <span className="font-semibold text-base flex-1">Personalización del Horario</span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-content2 transition-colors cursor-pointer"
                        aria-label="Cerrar"
                    >
                        <X size={18} className="text-foreground-400" />
                    </button>
                </header>

                {/* Body */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-3 flex flex-col gap-2">

                    {/* ═══ GRUPO 1 — Apariencia ═══ */}
                    <LightAccordion
                        icon={<Palette size={18} className="text-primary" />}
                        title="Apariencia"
                        isOpen={panelAbierto === 'apariencia'}
                        onToggle={() => togglePanel('apariencia')}
                    >
                        {/* Modo claro / oscuro */}
                        <Switch
                            isSelected={esDark}
                            onChange={(v) => setTheme(v ? 'dark' : 'light')}
                            size="sm"
                        >
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                            <Switch.Content>
                                <Label className="text-sm flex items-center gap-2">
                                    {esDark ? <Moon size={14} /> : <Sun size={14} />}
                                    {esDark ? "Modo oscuro" : "Modo claro"}
                                </Label>
                            </Switch.Content>
                        </Switch>

                        <Divider />

                        {/* Paleta de colores */}
                        <section>
                            <h4 className="text-sm font-semibold text-foreground-700 mb-2">
                                Paleta de colores
                            </h4>
                            <PaletaSelector
                                paletaSeleccionada={paletaSeleccionada}
                                coloresActuales={coloresActuales}
                                onChange={cambiarPaleta}
                                className="w-full"
                            />
                        </section>

                        <Divider />

                        {/* Tamaño de letra */}
                        <section>
                            <h4 className="text-sm font-semibold text-foreground-700 mb-2">
                                Tamaño de letra en celdas
                            </h4>
                            <Slider
                                aria-label="Tamaño de letra"
                                step={1}
                                minValue={10}
                                maxValue={18}
                                value={config.tamanoLetra}
                                onChange={(v) => actualizarConfig({ tamanoLetra: v })}
                                className="max-w-full"
                                size="sm"
                                showSteps
                                marks={[
                                    { value: 10, label: "10px" },
                                    { value: 12, label: "12" },
                                    { value: 14, label: "14" },
                                    { value: 16, label: "16" },
                                    { value: 18, label: "18px" },
                                ]}
                            />
                        </section>

                        <Divider />

                        {/* Alineación del texto */}
                        <section>
                            <h4 className="text-sm font-semibold text-foreground-700 mb-2">
                                Alineación del texto
                            </h4>
                            <ButtonGroup size="sm" className="w-full">
                                <Button
                                    className="flex-1"
                                    variant={config.alineacion === 'left' ? 'primary' : 'tertiary'}
                                    onPress={() => actualizarConfig({ alineacion: 'left' })}
                                    startContent={<AlignLeftIcon />}
                                >
                                    Izquierda
                                </Button>
                                <Button
                                    className="flex-1"
                                    variant={config.alineacion === 'center' ? 'primary' : 'tertiary'}
                                    onPress={() => actualizarConfig({ alineacion: 'center' })}
                                    startContent={<AlignCenterIcon />}
                                >
                                    Centro
                                </Button>
                                <Button
                                    className="flex-1"
                                    variant={config.alineacion === 'right' ? 'primary' : 'tertiary'}
                                    onPress={() => actualizarConfig({ alineacion: 'right' })}
                                    startContent={<AlignRightIcon />}
                                >
                                    Derecha
                                </Button>
                            </ButtonGroup>
                        </section>

                        <Divider />

                        {/* Ocultar filas vacías */}
                        <Switch
                            isSelected={config.ocultarFilasVacias}
                            onChange={(v) => actualizarConfig({ ocultarFilasVacias: v })}
                            size="sm"
                        >
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                            <Switch.Content>
                                <Label className="text-sm">Ocultar filas vacías al final</Label>
                            </Switch.Content>
                        </Switch>

                        {/* ═══ Fondos de Chaufa (ocultos hasta desbloqueo) ═══ */}
                        {(config.chijaukayDesbloqueado || config.tipakayDesbloqueado) && (
                            <>
                                <Divider />
                                <section>
                                    <h4 className="text-sm font-semibold text-foreground-700 mb-2">
                                        Fondo de chaufa
                                    </h4>
                                    <div className='flex flex-row gap-3'>
                                        {config.chijaukayDesbloqueado && (
                                            <Switch
                                                isSelected={config.fondoChiJauKay}
                                                onChange={(v) =>
                                                    actualizarConfig({
                                                        fondoChiJauKay: v,
                                                        ...(v ? { fondoTiPaKay: false } : {}),
                                                    })
                                                }
                                                size="sm"
                                            >
                                                <Switch.Control className="data-[selected=true]:bg-warning data-[selected=true]:border-warning">
                                                    <Switch.Thumb />
                                                </Switch.Control>
                                                <Switch.Content>
                                                    <Label className="text-sm">Chi Jau Kay</Label>
                                                </Switch.Content>
                                            </Switch>
                                        )}
                                        {config.tipakayDesbloqueado && (
                                            <Switch
                                                isSelected={config.fondoTiPaKay}
                                                onChange={(v) =>
                                                    actualizarConfig({
                                                        fondoTiPaKay: v,
                                                        ...(v ? { fondoChiJauKay: false } : {}),
                                                    })
                                                }
                                                size="sm"
                                            >
                                                <Switch.Control className="data-[selected=true]:bg-warning data-[selected=true]:border-warning">
                                                    <Switch.Thumb />
                                                </Switch.Control>
                                                <Switch.Content>
                                                    <Label className="text-sm">Ti Pa Kay</Label>
                                                </Switch.Content>
                                            </Switch>
                                        )}
                                    </div>
                                </section>
                            </>
                        )}
                    </LightAccordion>

                    {/* ═══ GRUPO 2 — Campos visibles ═══ */}
                    <LightAccordion
                        icon={<LayoutList size={18} className="text-success" />}
                        title="Campos visibles"
                        subtitle="Mínimo 1 activo"
                        isOpen={panelAbierto === 'campos'}
                        onToggle={() => togglePanel('campos')}
                    >
                        <CheckboxGroup
                            name="campos-visibles"
                            value={camposActivos}
                            onChange={handleCamposChange}
                            size="sm"
                        >
                            <Label>Selecciona los campos visibles</Label>
                            {Object.entries(CAMPOS_LABELS).map(([key, label]) => (
                                <Checkbox
                                    key={key}
                                    value={key}
                                    isDisabled={camposActivos.length === 1 && camposActivos[0] === key}
                                >
                                    <Checkbox.Control>
                                        <Checkbox.Indicator />
                                    </Checkbox.Control>
                                    <Checkbox.Content>
                                        <Label>{label}</Label>
                                    </Checkbox.Content>
                                </Checkbox>
                            ))}
                        </CheckboxGroup>
                    </LightAccordion>

                    {/* ═══ GRUPO 3 — Formato del profesor ═══ */}
                    <LightAccordion
                        icon={<UserRound size={18} className="text-warning" />}
                        title="Formato del profesor"
                        isOpen={panelAbierto === 'profesor'}
                        onToggle={() => togglePanel('profesor')}
                    >
                        <div>
                            <Switch
                                isSelected={config.nombreCortoProfesor}
                                onChange={(v) => actualizarConfig({ nombreCortoProfesor: v })}
                                size="sm"
                            >
                                <Switch.Control>
                                    <Switch.Thumb />
                                </Switch.Control>
                                <Switch.Content>
                                    <Label className="text-sm">Solo primer apellido y nombre</Label>
                                </Switch.Content>
                            </Switch>
                            <p className="text-xs text-foreground-400 mt-1 ml-1">
                                Ej.: &quot;Andrés Alfredo Lujan Carrión&quot; → &quot;Andrés Lujan&quot;
                            </p>
                        </div>
                        <div>
                            <Switch
                                isSelected={config.nombrePrimero}
                                onChange={(v) => actualizarConfig({ nombrePrimero: v })}
                                size="sm"
                            >
                                <Switch.Control>
                                    <Switch.Thumb />
                                </Switch.Control>
                                <Switch.Content>
                                    <Label className="text-sm">Nombre antes que apellido</Label>
                                </Switch.Content>
                            </Switch>
                            <p className="text-xs text-foreground-400 mt-1 ml-1">
                                Ej.: &quot;Lujan Carrion Andrés&quot; → &quot;Andrés Lujan Carrion&quot;
                            </p>
                        </div>
                    </LightAccordion>
                </div>

                {/* Footer */}
                <footer className="px-4 py-3 border-t border-divider flex justify-end shrink-0">
                    <Button
                        variant="tertiary"
                        onPress={onClose}
                    >
                        Cerrar
                    </Button>
                </footer>
            </aside>
        </>
    );
}

export default ConfigDrawer;
