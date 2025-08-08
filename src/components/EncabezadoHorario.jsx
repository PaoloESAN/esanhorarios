import React, { memo } from "react";
import { Button, ButtonGroup } from "@heroui/button";
import { Tabs, Tab } from "@heroui/tabs";
import { Select, SelectItem } from "@heroui/select";

function EncabezadoHorario({
    horarioActivo,
    creditosTotales,
    paletaSeleccionada,
    coloresActuales,
    cambiarPaleta,
    cambiarHorario,
    resolvedTheme,
    setTheme,
    limpiarHorario,
    limpiarTodosLosHorarios,
    abrirShareModal,
}) {
    return (
        <>
            {/* HEADER DE MOBILE (sm) */}
            <div className="flex flex-col gap-4 mb-4 gap-y-6 md:hidden items-center">
                {/* Título */}
                <div className="flex items-center gap-3">
                    <h2 className="text-lg md:text-xl font-semibold text-foreground">Mi Horario Personal</h2>
                    <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-xs font-medium">
                        Opción {horarioActivo}
                    </span>
                </div>

                {/* Contador de créditos - centrado */}
                <div className="w-full flex justify-center">
                    <div className="flex items-center gap-2 bg-primary-50 px-3 py-2 rounded-lg border border-primary-200 shadow-sm">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <span className="text-sm font-semibold text-primary">
                            <span>Créditos: </span>
                            {creditosTotales}
                        </span>
                    </div>
                </div>

                {/* Fila: Modo (botón) - debajo del contador de créditos */}
                <div className="grid w-full grid-cols-[84px,1fr] items-center gap-3">
                    <span className="text-sm font-medium text-foreground-600 whitespace-nowrap">Modo:</span>
                    <div>
                        <Button
                            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                            color="default"
                            size="sm"
                            variant="ghost"
                            className="w-full justify-start"
                            startContent={
                                resolvedTheme === 'dark' ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )
                            }
                        >
                            {resolvedTheme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                        </Button>
                    </div>
                </div>

                {/* Fila: Tema */}
                <div className="grid w-full grid-cols-[84px,1fr] items-center gap-3">
                    <span className="text-sm font-medium text-foreground-600 whitespace-nowrap">Tema:</span>
                    <Select
                        placeholder="Selecciona paleta"
                        selectedKeys={[paletaSeleccionada]}
                        onSelectionChange={(keys) => {
                            const selectedKey = Array.from(keys)[0];
                            if (selectedKey && selectedKey !== paletaSeleccionada) {
                                cambiarPaleta(selectedKey);
                            }
                        }}
                        aria-label="Selecciona paleta de colores"
                        size="sm"
                        variant="bordered"
                        className="w-full"
                        classNames={{
                            trigger: "h-8 min-w-full border border-divider shadow-sm",
                            value: "text-xs",
                            listboxWrapper: "max-h-60"
                        }}
                        disallowEmptySelection={true}
                        renderValue={(items) => {
                            const nombresPaletas = {
                                'default': 'Clásica',
                                'pastel': 'Pastel',
                                'vibrante': 'Vibrante',
                                'monocromatico': 'Monocromático',
                                'neon': 'Neón',
                                'otono': 'Otoño',
                                'oceanico': 'Oceánico'
                            };

                            return (
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        <div className={`w-3 h-3 rounded-full ${coloresActuales[0]?.bg || 'bg-blue-200'}`}></div>
                                        <div className={`w-3 h-3 rounded-full ${coloresActuales[1]?.bg || 'bg-green-200'}`}></div>
                                        <div className={`w-3 h-3 rounded-full ${coloresActuales[2]?.bg || 'bg-red-200'}`}></div>
                                    </div>
                                    <span className="text-sm">{nombresPaletas[paletaSeleccionada] || 'Selecciona paleta'}</span>
                                </div>
                            );
                        }}
                    >
                        <SelectItem key="default" value="default" textValue="default">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    <div className="w-3 h-3 rounded-full bg-blue-200"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-200"></div>
                                    <div className="w-3 h-3 rounded-full bg-red-200"></div>
                                </div>
                                <span>Clásica</span>
                            </div>
                        </SelectItem>
                        <SelectItem key="pastel" value="pastel" textValue="pastel">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    <div className="w-3 h-3 rounded-full bg-rose-100"></div>
                                    <div className="w-3 h-3 rounded-full bg-sky-100"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-100"></div>
                                </div>
                                <span>Pastel</span>
                            </div>
                        </SelectItem>
                        <SelectItem key="vibrante" value="vibrante" textValue="vibrante">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                </div>
                                <span>Vibrante</span>
                            </div>
                        </SelectItem>
                        <SelectItem key="monocromatico" value="monocromatico" textValue="monocromatico">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                                </div>
                                <span>Monocromático</span>
                            </div>
                        </SelectItem>
                        <SelectItem key="neon" value="neon" textValue="neon">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    <div className="w-3 h-3 rounded-full bg-cyan-300"></div>
                                    <div className="w-3 h-3 rounded-full bg-lime-300"></div>
                                    <div className="w-3 h-3 rounded-full bg-pink-300"></div>
                                </div>
                                <span>Neón</span>
                            </div>
                        </SelectItem>
                        <SelectItem key="otono" value="otono" textValue="otono">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    <div className="w-3 h-3 rounded-full bg-amber-200"></div>
                                    <div className="w-3 h-3 rounded-full bg-orange-200"></div>
                                    <div className="w-3 h-3 rounded-full bg-red-200"></div>
                                </div>
                                <span>Otoño</span>
                            </div>
                        </SelectItem>
                        <SelectItem key="oceanico" value="oceanico" textValue="oceanico">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    <div className="w-3 h-3 rounded-full bg-blue-200"></div>
                                    <div className="w-3 h-3 rounded-full bg-cyan-200"></div>
                                    <div className="w-3 h-3 rounded-full bg-teal-200"></div>
                                </div>
                                <span>Oceánico</span>
                            </div>
                        </SelectItem>
                    </Select>
                </div>

                {/* Fila: Selección de horario */}
                <div className="grid w-full grid-cols-[84px,1fr] items-center gap-3">
                    <span className="text-sm font-medium text-foreground-600 whitespace-nowrap">Horarios:</span>
                    <div className="flex items-center">
                        <Tabs
                            selectedKey={horarioActivo.toString()}
                            onSelectionChange={(key) => cambiarHorario(parseInt(key))}
                            aria-label="Opciones de horarios"
                        >
                            <Tab key="1" title="1" />
                            <Tab key="2" title="2" />
                            <Tab key="3" title="3" />
                            <Tab key="4" title="4" />
                            <Tab key="5" title="5" />
                        </Tabs>
                    </div>
                </div>

                {/* Fila: Acciones de limpieza */}
                <div className="grid w-full grid-cols-[84px,1fr] items-center gap-3">
                    <span className="text-sm font-medium text-foreground-600 whitespace-nowrap">Limpiar:</span>
                    <div className="flex items-center">
                        <ButtonGroup size="sm">
                            <Button
                                onClick={limpiarHorario}
                                color="danger"
                                variant="flat"
                                startContent={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                }
                                className="px-4"
                            >
                                <span>Actual</span>
                            </Button>
                            <Button
                                onClick={limpiarTodosLosHorarios}
                                color="danger"
                                variant="flat"
                                startContent={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16l-1 10a2 2 0 01-2 2H7a2 2 0 01-2-2L4 7zM10 11v6M14 11v6M5 7l1-4h12l1 4" />
                                    </svg>
                                }
                                title="Limpiar todos los horarios"
                                className="px-4"
                            >
                                <span>Todos</span>
                            </Button>
                        </ButtonGroup>
                    </div>
                </div>

                {/* Fila: Compartir */}
                <div className="grid w-full grid-cols-[84px,1fr] items-center gap-3">
                    <span className="sr-only">Compartir:</span>
                    <Button
                        onClick={abrirShareModal}
                        color="success"
                        size="sm"
                        variant="flat"
                        startContent={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                        }
                        className="w-full px-6 shadow-sm border border-success-200"
                    >
                        <span className="font-medium">Compartir Horario</span>
                    </Button>
                </div>
            </div>








            {/* HEADER NORMAL (md) */}
            <div className="md:flex flex-col gap-4 mb-4 hidden">
                {/* Fila única: Título | Créditos (centro) | Opción */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                    <h2 className="text-lg font-semibold text-foreground justify-self-start">Mi Horario Personal</h2>
                    <div className="justify-self-center">
                        <div className="flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-lg border border-primary-200 shadow-sm">
                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            <span className="text-sm font-semibold text-primary">Créditos: {creditosTotales}</span>
                        </div>
                    </div>
                    <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-xs font-medium justify-self-end">Opción {horarioActivo}</span>
                </div>

                {/* Controles en grilla 2 columnas */}
                <div className="grid grid-cols-2 gap-4 mt-5">
                    {/* Horarios */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-foreground-600 whitespace-nowrap">Horarios:</span>
                        <Tabs
                            selectedKey={horarioActivo.toString()}
                            onSelectionChange={(key) => cambiarHorario(parseInt(key))}
                            aria-label="Opciones de horarios"
                        >
                            <Tab key="1" title="1" />
                            <Tab key="2" title="2" />
                            <Tab key="3" title="3" />
                            <Tab key="4" title="4" />
                            <Tab key="5" title="5" />
                        </Tabs>
                    </div>

                    {/* Tema (alineado a la derecha) */}
                    <div className="flex items-center gap-3 justify-end">
                        <span className="text-sm font-medium text-foreground-600 whitespace-nowrap">Tema:</span>
                        <div className="w-full min-w-0 max-w-53.5">
                            <Select
                                placeholder="Selecciona paleta"
                                selectedKeys={[paletaSeleccionada]}
                                onSelectionChange={(keys) => {
                                    const selectedKey = Array.from(keys)[0];
                                    if (selectedKey && selectedKey !== paletaSeleccionada) {
                                        cambiarPaleta(selectedKey);
                                    }
                                }}
                                aria-label="Selecciona paleta de colores"
                                size="sm"
                                variant="bordered"
                                className="w-full"
                                classNames={{
                                    trigger: "h-9 min-w-full border border-divider shadow-sm",
                                    value: "text-sm",
                                    listboxWrapper: "max-h-60"
                                }}
                                disallowEmptySelection={true}
                                renderValue={(items) => (
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            <div className={`w-3 h-3 rounded-full ${coloresActuales[0]?.bg || 'bg-blue-200'}`}></div>
                                            <div className={`w-3 h-3 rounded-full ${coloresActuales[1]?.bg || 'bg-green-200'}`}></div>
                                            <div className={`w-3 h-3 rounded-full ${coloresActuales[2]?.bg || 'bg-red-200'}`}></div>
                                        </div>
                                        <span className="text-sm">{({
                                            'default': 'Clásica',
                                            'pastel': 'Pastel',
                                            'vibrante': 'Vibrante',
                                            'monocromatico': 'Monocromático',
                                            'neon': 'Neón',
                                            'otono': 'Otoño',
                                            'oceanico': 'Oceánico'
                                        })[paletaSeleccionada] || 'Selecciona paleta'}</span>
                                    </div>
                                )}
                            >
                                <SelectItem key="default" value="default" textValue="default">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <div className="w-3 h-3 rounded-full bg-blue-200"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-200"></div>
                                            <div className="w-3 h-3 rounded-full bg-red-200"></div>
                                        </div>
                                        <span>Clásica</span>
                                    </div>
                                </SelectItem>
                                <SelectItem key="pastel" value="pastel" textValue="pastel">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <div className="w-3 h-3 rounded-full bg-rose-100"></div>
                                            <div className="w-3 h-3 rounded-full bg-sky-100"></div>
                                            <div className="w-3 h-3 rounded-full bg-emerald-100"></div>
                                        </div>
                                        <span>Pastel</span>
                                    </div>
                                </SelectItem>
                                <SelectItem key="vibrante" value="vibrante" textValue="vibrante">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        </div>
                                        <span>Vibrante</span>
                                    </div>
                                </SelectItem>
                                <SelectItem key="monocromatico" value="monocromatico" textValue="monocromatico">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                                            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                                            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                                        </div>
                                        <span>Monocromático</span>
                                    </div>
                                </SelectItem>
                                <SelectItem key="neon" value="neon" textValue="neon">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <div className="w-3 h-3 rounded-full bg-cyan-300"></div>
                                            <div className="w-3 h-3 rounded-full bg-lime-300"></div>
                                            <div className="w-3 h-3 rounded-full bg-pink-300"></div>
                                        </div>
                                        <span>Neón</span>
                                    </div>
                                </SelectItem>
                                <SelectItem key="otono" value="otono" textValue="otono">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <div className="w-3 h-3 rounded-full bg-amber-200"></div>
                                            <div className="w-3 h-3 rounded-full bg-orange-200"></div>
                                            <div className="w-3 h-3 rounded-full bg-red-200"></div>
                                        </div>
                                        <span>Otoño</span>
                                    </div>
                                </SelectItem>
                                <SelectItem key="oceanico" value="oceanico" textValue="oceanico">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <div className="w-3 h-3 rounded-full bg-blue-200"></div>
                                            <div className="w-3 h-3 rounded-full bg-cyan-200"></div>
                                            <div className="w-3 h-3 rounded-full bg-teal-200"></div>
                                        </div>
                                        <span>Oceánico</span>
                                    </div>
                                </SelectItem>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Acciones */}
                <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-foreground-600 whitespace-nowrap">Limpiar:</span>
                        <ButtonGroup size="sm" variant="bordered" className="border border-divider rounded-lg shadow-sm">
                            <Button onClick={limpiarHorario} color="danger" variant="flat"
                                startContent={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                }
                            >
                                Actual
                            </Button>
                            <Button onClick={limpiarTodosLosHorarios} color="danger" variant="flat" title="Limpiar todos los horarios"
                                startContent={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16l-1 10a2 2 0 01-2 2H7a2 2 0 01-2-2L4 7zM10 11v6M14 11v6M5 7l1-4h12l1 4" />
                                    </svg>
                                }
                            >
                                Todos
                            </Button>
                        </ButtonGroup>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button
                            className="lg:hidden"
                            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                            color="default"
                            size="sm"
                            variant="ghost"
                            startContent={
                                resolvedTheme === 'dark' ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )
                            }
                        >
                            {resolvedTheme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                        </Button>
                        <Button onClick={abrirShareModal} color="success" size="sm" variant="flat" className="px-6 shadow-sm border border-success-200"
                            startContent={
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                </svg>
                            }
                        >
                            <span className="font-medium">Compartir Horario</span>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default memo(EncabezadoHorario);
