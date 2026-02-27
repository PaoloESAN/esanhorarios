"use client";

import Link from "next/link";
import { Card, CardBody, Button } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Lock, X } from "lucide-react";
import { COLUMNAS } from "./data";

export default function VistaMobile({ expandedFacultad, setExpandedFacultad }) {
    return (
        <CardBody className="bg-[#edf0f5] dark:bg-[#1a1f2e] p-4 md:hidden overflow-hidden">
            <AnimatePresence mode="wait">
                {/* Cuadrícula 2×2 de facultades */}
                {!expandedFacultad && (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.12, ease: "easeOut" }}
                        className="grid grid-cols-2 gap-3 max-w-sm mx-auto"
                    >
                        {COLUMNAS.map((col) => {
                            const IconComponent = col.icon;
                            const activeCount = col.carreras.filter((c) => c.activa).length;
                            return (
                                <Card
                                    key={col.facultad}
                                    isPressable
                                    onPress={() => setExpandedFacultad(col.facultad)}
                                    className="aspect-square border border-gray-200/50 dark:border-gray-600/30 shadow-sm bg-white dark:bg-gray-900 active:scale-95 transition-transform duration-200"
                                >
                                    <CardBody className="flex flex-col items-center justify-center gap-2.5 p-3">
                                        <div
                                            className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                            style={{ backgroundColor: col.colorLight, color: col.color }}
                                        >
                                            <IconComponent size={24} strokeWidth={1.8} />
                                        </div>
                                        <h2
                                            className="text-sm font-extrabold tracking-tight text-center leading-tight"
                                            style={{ color: col.color }}
                                        >
                                            {col.facultad}
                                        </h2>
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                                            {activeCount > 0 ? `${activeCount} disponible(s)` : "Próximamente"}
                                        </span>
                                    </CardBody>
                                </Card>
                            );
                        })}
                    </motion.div>
                )}

                {/* Lista de carreras de la facultad seleccionada */}
                {expandedFacultad && (() => {
                    const col = COLUMNAS.find((c) => c.facultad === expandedFacultad);
                    const IconComponent = col.icon;
                    return (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="max-w-sm mx-auto w-full"
                        >
                            {/* Encabezado con botón cerrar */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: col.colorLight, color: col.color }}
                                    >
                                        <IconComponent size={20} strokeWidth={1.8} />
                                    </div>
                                    <h3
                                        className="text-lg font-extrabold tracking-tight"
                                        style={{ color: col.color }}
                                    >
                                        {col.facultad}
                                    </h3>
                                </div>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="flat"
                                    className="bg-white/80 dark:bg-[#1f2535] text-gray-500 dark:text-gray-400"
                                    onPress={() => setExpandedFacultad(null)}
                                    aria-label="Volver"
                                >
                                    <X size={18} />
                                </Button>
                            </div>

                            {/* Lista de carreras + celdas vacías */}
                            <div className="flex flex-col gap-2.5">
                                {col.carreras.map((carrera, idx) => {
                                    if (carrera.activa) {
                                        return (
                                            <motion.div
                                                key={carrera.nombre}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.12, delay: idx * 0.03 }}
                                            >
                                                <Button
                                                    as={Link}
                                                    href={`/${carrera.slug}`}
                                                    className="justify-between h-auto py-4 px-4 text-white text-sm font-semibold w-full rounded-xl shadow-md"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${col.color}, ${col.color}cc)`,
                                                    }}
                                                >
                                                    <span className="truncate">{carrera.nombre}</span>
                                                    <ChevronRight size={16} className="shrink-0 ml-2" />
                                                </Button>
                                            </motion.div>
                                        );
                                    }
                                    return (
                                        <motion.div
                                            key={carrera.nombre}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.12, delay: idx * 0.03 }}
                                            className="flex items-center justify-between py-3.5 px-4 rounded-xl bg-white dark:bg-[#1f2535] border border-dashed border-gray-300 dark:border-gray-600"
                                        >
                                            <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">
                                                {carrera.nombre}
                                            </span>
                                            <Lock size={14} className="text-gray-300 dark:text-gray-600 shrink-0 ml-2" />
                                        </motion.div>
                                    );
                                })}

                                {/* Celdas vacías grises para completar la cuadrícula */}
                                {Array.from(
                                    { length: Math.max(0, 3 - col.carreras.length) },
                                    (_, i) => (
                                        <motion.div
                                            key={`empty-${i}`}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.12, delay: (col.carreras.length + i) * 0.03 }}
                                            className="h-12 rounded-xl bg-[#c8cdd8] dark:bg-[#1e2330]"
                                        />
                                    )
                                )}
                            </div>
                        </motion.div>
                    );
                })()}
            </AnimatePresence>
        </CardBody>
    );
}
