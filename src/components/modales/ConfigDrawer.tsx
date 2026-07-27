"use client";

import { useState, useEffect, useSyncExternalStore } from 'react';
import { Switch, Checkbox, CheckboxGroup, Slider, Button, ButtonGroup, Label, Accordion } from "@heroui/react";
import { useTheme } from 'next-themes';

import PaletaSelector from "@/components/ui/PaletaSelector";
import { useConfigHorario } from "@/hooks/useConfigHorario";
import { Brush, Sun, Moon, Palette, UserRound, LayoutList, X, ChevronDown } from 'lucide-react';

const emptySubscribe = () => () => {};

const CAMPOS_LABELS = {
    curso: "Nombre del curso",
    seccion: "Sección",
    profesor: "Profesor",
    aula: "Salón / Aula",
};



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
    const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
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

    const handleCamposChange = (nuevos: any) => {
        if (nuevos.length === 0) return;
        const patch: any = {};
        for (const key of Object.keys(CAMPOS_LABELS)) {
            patch[key] = nuevos.includes(key);
        }
        actualizarConfig({ camposVisibles: patch });
    };



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
                    <Brush size={18} className="text-accent" />
                    <span className="font-semibold text-base flex-1">Personalización del Horario</span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-surface-secondary transition-colors cursor-pointer"
                        aria-label="Cerrar"
                    >
                        <X size={18} className="text-foreground-400" />
                    </button>
                </header>

                {/* Body */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-3 flex flex-col gap-2">

                    {/* ═══ GRUPO 1 — Apariencia ═══ */}
                    <Accordion className="w-full" variant="surface" defaultExpandedKeys={["apariencia"]}>
                        {/* ═══ GRUPO 1 — Apariencia ═══ */}
                        <Accordion.Item key="apariencia">
                            <Accordion.Heading>
                                <Accordion.Trigger>
                                    <Palette size={18} className="text-accent" />
                                    <span className="text-sm ml-2 font-semibold">Apariencia</span>
                                    <Accordion.Indicator>
                                        <ChevronDown size={16} className="text-foreground-400 shrink-0" />
                                    </Accordion.Indicator>
                                </Accordion.Trigger>
                            </Accordion.Heading>
                            <Accordion.Panel>
                                <Accordion.Body>
                                    <div className="flex flex-col gap-5">
                                        {/* Modo claro / oscuro */}
                                        <Switch
                                            isSelected={esDark}
                                            onChange={(v) => setTheme(v ? 'dark' : 'light')}
                                            size="md"
                                        >
                                            <Switch.Content>
                                                <Switch.Control>
                                                    <Switch.Thumb >
                                                        <Switch.Icon>
                                                            {esDark ? (
                                                                <Moon size={14} />
                                                            ) : (
                                                                <Sun size={14} />
                                                            )}
                                                        </Switch.Icon>
                                                    </Switch.Thumb>
                                                </Switch.Control>

                                                {esDark ? "Modo oscuro" : "Modo claro"}
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
                                            <Slider
                                                aria-label="Tamaño de letra"
                                                step={1}
                                                minValue={10}
                                                maxValue={18}
                                                value={config.tamanoLetra}
                                                onChange={(v) => {
                                                    const nextValue = Array.isArray(v) ? v[0] : v;
                                                    actualizarConfig({ tamanoLetra: nextValue });
                                                }}
                                                className="max-w-full"
                                            >
                                                <div className="mb-2 flex items-center justify-between gap-2">
                                                    <Label className="text-sm font-semibold text-foreground-700">Tamaño de letra en celdas</Label>
                                                    <Slider.Output className="text-xs text-foreground-500" />
                                                </div>
                                                <Slider.Track>
                                                    <Slider.Fill />
                                                    <Slider.Thumb />
                                                </Slider.Track>
                                            </Slider>
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
                                                >
                                                    <AlignLeftIcon />
                                                    Izquierda
                                                </Button>
                                                <Button
                                                    className="flex-1"
                                                    variant={config.alineacion === 'center' ? 'primary' : 'tertiary'}
                                                    onPress={() => actualizarConfig({ alineacion: 'center' })}
                                                >
                                                    <AlignCenterIcon />
                                                    Centro
                                                </Button>
                                                <Button
                                                    className="flex-1"
                                                    variant={config.alineacion === 'right' ? 'primary' : 'tertiary'}
                                                    onPress={() => actualizarConfig({ alineacion: 'right' })}
                                                >
                                                    <AlignRightIcon />
                                                    Derecha
                                                </Button>
                                            </ButtonGroup>
                                        </section>

                                        <Divider />

                                        {/* Ocultar filas vacías */}
                                        <Switch
                                            isSelected={config.ocultarFilasVacias}
                                            onChange={(v) => actualizarConfig({ ocultarFilasVacias: v })}
                                            size="md"
                                        >
                                            <Switch.Content>
                                                <Switch.Control>
                                                    <Switch.Thumb />
                                                </Switch.Control>
                                                Ocultar filas vacías al final
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
                                                                size="md"
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
                                                                size="md"
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
                                    </div>
                                </Accordion.Body>
                            </Accordion.Panel>
                        </Accordion.Item>

                        {/* ═══ GRUPO 2 — Campos visibles ═══ */}
                        <Accordion.Item key="campos">
                            <Accordion.Heading>
                                <Accordion.Trigger>
                                    <LayoutList size={18} className="text-success" />
                                    <div className="flex-1 ml-2 min-w-0 text-left">
                                        <span className="text-sm font-semibold block">Campos visibles</span>
                                        <span className="text-xs text-muted block">Mínimo 1 activo</span>
                                    </div>
                                    <Accordion.Indicator>
                                        <ChevronDown size={16} className="text-foreground-400 shrink-0" />
                                    </Accordion.Indicator>
                                </Accordion.Trigger>
                            </Accordion.Heading>
                            <Accordion.Panel>
                                <Accordion.Body>
                                    <div className="flex flex-col gap-5">
                                        <CheckboxGroup
                                            name="campos-visibles"
                                            value={camposActivos}
                                            onChange={handleCamposChange}
                                        >
                                            <Label>Selecciona los campos visibles</Label>
                                            {Object.entries(CAMPOS_LABELS).map(([key, label]) => (
                                                <Checkbox
                                                    key={key}
                                                    value={key}
                                                    isDisabled={camposActivos.length === 1 && camposActivos[0] === key}
                                                >
                                                    <Checkbox.Content>
                                                        <Checkbox.Control>
                                                            <Checkbox.Indicator />
                                                        </Checkbox.Control>
                                                        {label}
                                                    </Checkbox.Content>
                                                </Checkbox>
                                            ))}
                                        </CheckboxGroup>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Panel>
                        </Accordion.Item>

                        {/* ═══ GRUPO 3 — Formato del profesor ═══ */}
                        <Accordion.Item key="profesor">
                            <Accordion.Heading>
                                <Accordion.Trigger>
                                    <UserRound size={18} className="text-warning" />
                                    <span className="text-sm ml-2 font-semibold">Formato del profesor</span>
                                    <Accordion.Indicator>
                                        <ChevronDown size={16} className="text-foreground-400 shrink-0" />
                                    </Accordion.Indicator>
                                </Accordion.Trigger>
                            </Accordion.Heading>
                            <Accordion.Panel>
                                <Accordion.Body>
                                    <div className="flex flex-col gap-5">
                                        <div>
                                            <Switch
                                                isSelected={config.nombreCortoProfesor}
                                                onChange={(v) => actualizarConfig({ nombreCortoProfesor: v })}
                                                size="md"
                                            >
                                                <Switch.Content>
                                                    <Switch.Control>
                                                        <Switch.Thumb />
                                                    </Switch.Control>
                                                    Solo primer apellido y nombre
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
                                                size="md"
                                            >
                                                <Switch.Content>
                                                    <Switch.Control>
                                                        <Switch.Thumb />
                                                    </Switch.Control>
                                                    Nombre antes que apellido
                                                </Switch.Content>
                                            </Switch>
                                            <p className="text-xs text-foreground-400 mt-1 ml-1">
                                                Ej.: &quot;Lujan Carrion Andrés&quot; → &quot;Andrés Lujan Carrion&quot;
                                            </p>
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
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
            </aside >
        </>
    );
}

export default ConfigDrawer;
