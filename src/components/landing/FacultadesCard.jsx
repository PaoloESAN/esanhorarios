"use client";

import Link from "next/link";
import { Card, Button } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Lock, X } from "lucide-react";
import { COLUMNAS } from "./data";

export default function FacultadesCard({ expandedFacultad, setExpandedFacultad }) {
    return (
        <div className="bg-transparent p-4 md:p-8 lg:p-12 overflow-hidden mx-auto w-full">
            <AnimatePresence mode="wait">
                {/* Cuadrícula de facultades */}
                {!expandedFacultad && (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.12, ease: "easeOut" }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-[280px] sm:max-w-sm lg:max-w-5xl mx-auto w-full"
                    >
                        {COLUMNAS.map((col) => {
                            return (
                                <Card
                                    key={col.facultad}
                                    className="aspect-square border-none shadow-md hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all duration-300 relative overflow-hidden"
                                    style={{ backgroundColor: col.color }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setExpandedFacultad(col.facultad)}
                                        className="w-full h-full text-left"
                                    >
                                        <Card.Content className="flex flex-col items-center justify-center gap-3 md:gap-4 p-4 text-white relative z-10 w-full h-full overflow-hidden">
                                            <div
                                                className="w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl md:rounded-3xl flex items-center justify-center border border-white/10 bg-white/10 shrink-0"
                                            >
                                                <img src={col.icon} alt={col.facultad} className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 object-contain drop-shadow-md" />
                                            </div>
                                            <h2
                                                className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold tracking-tight text-center leading-tight px-1 w-full break-words"
                                            >
                                                {col.facultad}
                                            </h2>
                                        </Card.Content>
                                    </button>
                                </Card>
                            );
                        })}
                    </motion.div>
                )}

                {/* Lista de carreras de la facultad seleccionada */}
                {expandedFacultad && (() => {
                    const col = COLUMNAS.find((c) => c.facultad === expandedFacultad);
                    return (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="max-w-[280px] sm:max-w-sm md:max-w-3xl lg:max-w-5xl mx-auto w-full py-2 md:py-6"
                        >
                            {/* Encabezado con botón cerrar */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div
                                        className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center"
                                        style={{ backgroundColor: col.color }}
                                    >
                                        <img src={col.icon} alt={col.facultad} className="w-7 h-7 md:w-8 md:h-8 object-contain drop-shadow-sm" />
                                    </div>
                                    <h3
                                        className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-white"
                                    >
                                        {col.facultad}
                                    </h3>
                                </div>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="tertiary"
                                    className="bg-black/50 hover:bg-black/70 text-white shadow-sm transition-colors"
                                    onPress={() => setExpandedFacultad(null)}
                                    aria-label="Volver"
                                >
                                    <X size={20} />
                                </Button>
                            </div>

                            {/* Lista de carreras */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                {col.carreras.map((carrera, idx) => {
                                    if (carrera.activa) {
                                        return (
                                            <motion.div
                                                key={carrera.nombre}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.12, delay: idx * 0.03 }}
                                            >
                                                <Link
                                                    href={`/${carrera.slug}`}
                                                    className="flex items-center justify-between h-auto py-4 md:py-5 px-5 text-white text-sm md:text-base font-bold w-full rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                                                    style={{ backgroundColor: col.color }}
                                                >
                                                    <span className="truncate">{carrera.nombre}</span>
                                                    <ChevronRight size={18} className="shrink-0 ml-2 opacity-80" />
                                                </Link>
                                            </motion.div>
                                        );
                                    }
                                    return (
                                        <motion.div
                                            key={carrera.nombre}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.12, delay: idx * 0.03 }}
                                            className="flex items-center justify-between py-4 md:py-5 px-5 rounded-2xl bg-white/10 dark:bg-black/20 border border-white/20 shadow-inner"
                                        >
                                            <span className="text-sm md:text-base text-white/60 font-medium">
                                                {carrera.nombre}
                                            </span>
                                            <Lock size={16} className="text-white/40 shrink-0 ml-2" />
                                        </motion.div>
                                    );
                                })}
                                {col.carreras.length % 2 !== 0 && (
                                    <div className="hidden md:block h-full rounded-2xl border border-dashed border-white/10 bg-transparent" />
                                )}
                            </div>
                        </motion.div>
                    );
                })()}
            </AnimatePresence>
        </div>
    );
}
