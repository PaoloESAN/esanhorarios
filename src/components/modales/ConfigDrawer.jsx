"use client";

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
} from "@heroui/drawer";
import { Switch } from "@heroui/switch";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { Slider } from "@heroui/slider";
import { Divider } from "@heroui/divider";
import { Button, ButtonGroup } from "@heroui/button";

import PaletaSelector from "@/components/ui/PaletaSelector";
import { useConfigHorario } from "@/hooks/useConfigHorario";
import { Brush } from 'lucide-react';


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
                <DrawerBody className="flex flex-col gap-6 pb-4">
                    {/* ── Paleta de colores ─────────────────────────── */}
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

                    {/* ── Nombre del profesor ─────────────────────── */}
                    <section>
                        <h4 className="text-sm font-semibold text-foreground-700 mb-2">
                            Nombre del profesor
                        </h4>
                        <div className="flex flex-col gap-3">
                            <div>
                                <Switch
                                    isSelected={config.nombreCortoProfesor}
                                    onValueChange={(v) => actualizarConfig({ nombreCortoProfesor: v })}
                                    size="sm"
                                >
                                    <span className="text-sm">Solo primer apellido y nombre</span>
                                </Switch>
                                <p className="text-xs text-foreground-400 mt-1 ml-1">
                                    Ej.: "Andrés Alfredo Lujan Carrión" → "Andrés Lujan"
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
                                    Ej.: "Lujan Carrion Andrés" → "Andrés Lujan Carrion"
                                </p>
                            </div>
                        </div>
                    </section>

                    <Divider />

                    {/* ── Campos visibles en la celda ───────────────── */}
                    <section>
                        <h4 className="text-sm font-semibold text-foreground-700 mb-2">
                            Campos visibles en la celda
                        </h4>
                        <p className="text-xs text-foreground-400 mb-3">
                            Mínimo 1 campo debe estar activo.
                        </p>
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
                    </section>

                    <Divider />

                    {/* ── Tamaño de letra ───────────────────────────── */}
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

                    {/* ── Alineación del texto ──────────────────── */}
                    <section>
                        <h4 className="text-sm font-semibold text-foreground-700 mb-2">
                            Alineación del texto
                        </h4>
                        <ButtonGroup size="sm" variant="flat">
                            <Button
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
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}

export default ConfigDrawer;
