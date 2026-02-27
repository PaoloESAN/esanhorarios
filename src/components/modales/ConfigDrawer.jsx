"use client";

import { useState, useEffect } from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
} from "@heroui/drawer";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Switch } from "@heroui/switch";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { Slider } from "@heroui/slider";
import { Divider } from "@heroui/divider";
import { Button, ButtonGroup } from "@heroui/button";
import { useTheme } from 'next-themes';

import PaletaSelector from "@/components/ui/PaletaSelector";
import { useConfigHorario } from "@/hooks/useConfigHorario";
import { Brush, Sun, Moon, Palette, UserRound, LayoutList } from 'lucide-react';


const CAMPOS_LABELS = {
    curso: "Nombre del curso",
    seccion: "Sección",
    profesor: "Profesor",
    aula: "Salón / Aula",
};

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

    return (
        <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="sm" hideCloseButton>
            <DrawerContent>
                <DrawerHeader className="flex items-center gap-2">
                    <Brush size={18} className="text-primary" />
                    <span>Personalización del Horario</span>
                </DrawerHeader>
                <DrawerBody className="flex flex-col gap-2 pb-4 px-2">
                    <Accordion
                        defaultExpandedKeys={["apariencia"]}
                        variant="splitted"
                        itemClasses={{ base: "!bg-content2" }}
                    >
                        {/* ═══ GRUPO 1 — Apariencia ═══ */}
                        <AccordionItem
                            key="apariencia"
                            aria-label="Apariencia"
                            startContent={<Palette size={18} className="text-primary" />}
                            title={<span className="text-sm font-semibold">Apariencia</span>}
                            classNames={{ content: "flex flex-col gap-5 pb-4" }}
                        >
                            {/* Modo claro / oscuro */}
                            <Switch
                                isSelected={esDark}
                                onValueChange={(v) => setTheme(v ? 'dark' : 'light')}
                                size="sm"
                                startContent={<Moon size={14} />}
                                endContent={<Sun size={14} />}
                            >
                                <span className="text-sm">{esDark ? "Modo oscuro" : "Modo claro"}</span>
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

                            {/* Ocultar filas vacías */}
                            <Switch
                                isSelected={config.ocultarFilasVacias}
                                onValueChange={(v) => actualizarConfig({ ocultarFilasVacias: v })}
                                size="sm"
                            >
                                <span className="text-sm">Ocultar filas vacías al final</span>
                            </Switch>

                            <Divider />

                            {/* Alineación del texto */}
                            <section>
                                <h4 className="text-sm font-semibold text-foreground-700 mb-2">
                                    Alineación del texto
                                </h4>
                                <ButtonGroup size="sm" variant="flat" className="w-full">
                                    <Button
                                        className="flex-1"
                                        color={config.alineacion === 'left' ? 'primary' : 'default'}
                                        variant={config.alineacion === 'left' ? 'solid' : 'flat'}
                                        onPress={() => actualizarConfig({ alineacion: 'left' })}
                                        startContent={
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h12M3 18h16" />
                                            </svg>
                                        }
                                    >
                                        Izquierda
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        color={config.alineacion === 'center' ? 'primary' : 'default'}
                                        variant={config.alineacion === 'center' ? 'solid' : 'flat'}
                                        onPress={() => actualizarConfig({ alineacion: 'center' })}
                                        startContent={
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M6 12h12M4 18h16" />
                                            </svg>
                                        }
                                    >
                                        Centro
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        color={config.alineacion === 'right' ? 'primary' : 'default'}
                                        variant={config.alineacion === 'right' ? 'solid' : 'flat'}
                                        onPress={() => actualizarConfig({ alineacion: 'right' })}
                                        startContent={
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M9 12h12M5 18h16" />
                                            </svg>
                                        }
                                    >
                                        Derecha
                                    </Button>
                                </ButtonGroup>
                            </section>

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
                                                    color='warning'
                                                    isSelected={config.fondoChiJauKay}
                                                    onValueChange={(v) =>
                                                        actualizarConfig({
                                                            fondoChiJauKay: v,
                                                            ...(v ? { fondoTiPaKay: false } : {}),
                                                        })
                                                    }
                                                    size="sm"
                                                >
                                                    <span className="text-sm">Chi Jau Kay</span>
                                                </Switch>
                                            )}
                                            {config.tipakayDesbloqueado && (
                                                <Switch
                                                    color='warning'
                                                    isSelected={config.fondoTiPaKay}
                                                    onValueChange={(v) =>
                                                        actualizarConfig({
                                                            fondoTiPaKay: v,
                                                            ...(v ? { fondoChiJauKay: false } : {}),
                                                        })
                                                    }
                                                    size="sm"
                                                >
                                                    <span className="text-sm">Ti Pa Kay</span>
                                                </Switch>
                                            )}
                                        </div>
                                    </section>
                                </>
                            )}
                        </AccordionItem>

                        {/* ═══ GRUPO 2 — Campos visibles ═══ */}
                        <AccordionItem
                            key="campos"
                            aria-label="Campos visibles en la celda"
                            startContent={<LayoutList size={18} className="text-success" />}
                            title={<span className="text-sm font-semibold">Campos visibles</span>}
                            subtitle={<span className="text-xs text-foreground-400">Mínimo 1 activo</span>}
                            classNames={{ content: "pb-4" }}
                        >
                            <CheckboxGroup
                                value={camposActivos}
                                onValueChange={handleCamposChange}
                                size="sm"
                            >
                                {Object.entries(CAMPOS_LABELS).map(([key, label]) => (
                                    <Checkbox
                                        key={key}
                                        value={key}
                                        isDisabled={camposActivos.length === 1 && camposActivos[0] === key}
                                    >
                                        {label}
                                    </Checkbox>
                                ))}
                            </CheckboxGroup>
                        </AccordionItem>

                        {/* ═══ GRUPO 3 — Formato del profesor ═══ */}
                        <AccordionItem
                            key="profesor"
                            aria-label="Formato del profesor"
                            startContent={<UserRound size={18} className="text-warning" />}
                            title={<span className="text-sm font-semibold">Formato del profesor</span>}
                            classNames={{ content: "flex flex-col gap-3 pb-4" }}
                        >
                            <div>
                                <Switch
                                    isSelected={config.nombreCortoProfesor}
                                    onValueChange={(v) => actualizarConfig({ nombreCortoProfesor: v })}
                                    size="sm"
                                >
                                    <span className="text-sm">Solo primer apellido y nombre</span>
                                </Switch>
                                <p className="text-xs text-foreground-400 mt-1 ml-1">
                                    Ej.: &quot;Andrés Alfredo Lujan Carrión&quot; → &quot;Andrés Lujan&quot;
                                </p>
                            </div>
                            <div>
                                <Switch
                                    isSelected={config.nombrePrimero}
                                    onValueChange={(v) => actualizarConfig({ nombrePrimero: v })}
                                    size="sm"
                                >
                                    <span className="text-sm">Nombre antes que apellido</span>
                                </Switch>
                                <p className="text-xs text-foreground-400 mt-1 ml-1">
                                    Ej.: &quot;Lujan Carrion Andrés&quot; → &quot;Andrés Lujan Carrion&quot;
                                </p>
                            </div>
                        </AccordionItem>
                    </Accordion>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}

export default ConfigDrawer;
