"use client";

import Link from "next/link";
import { Card, CardBody } from "@heroui/react";
import { COLUMNAS, NUM_FILAS } from "./data";

export default function VistaDesktop() {
    return (
        <CardBody className="bg-[#edf0f5] dark:bg-[#1a1f2e] p-4 md:p-6 lg:p-8 hidden md:block">
            {/* Cabeceras de facultades con iconos */}
            <div className="grid grid-cols-4 gap-4 lg:gap-5 mb-5">
                {COLUMNAS.map((col) => {
                    const IconComponent = col.icon;
                    return (
                        <Card
                            key={col.facultad}
                            className="border border-gray-100 dark:border-gray-600/40 shadow-sm bg-white dark:bg-gray-900 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative z-0 hover:z-10"
                        >
                            <CardBody className="flex flex-col items-center py-5 md:py-6 gap-3">
                                <div
                                    className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center"
                                    style={{ backgroundColor: col.colorLight, color: col.color }}
                                >
                                    <IconComponent size={26} strokeWidth={1.8} />
                                </div>
                                <h2
                                    className="text-sm md:text-base lg:text-lg font-extrabold tracking-tight text-center leading-tight"
                                    style={{ color: col.color }}
                                >
                                    {col.facultad}
                                </h2>
                            </CardBody>
                        </Card>
                    );
                })}
            </div>

            {/* Celdas de carreras */}
            {Array.from({ length: NUM_FILAS }, (_, rowIdx) => (
                <div key={rowIdx} className="grid grid-cols-4 gap-4 lg:gap-5 mb-3 md:mb-4">
                    {COLUMNAS.map((col) => {
                        const carrera = col.carreras[rowIdx];

                        {/* Celda vacía */ }
                        if (!carrera) {
                            return (
                                <div
                                    key={col.facultad}
                                    className="h-20 md:h-24 lg:h-[108px] rounded-2xl bg-[#c8cdd8] dark:bg-[#1e2330]"
                                />
                            );
                        }

                        {/* Carrera activa — enlace clickeable */ }
                        if (carrera.activa) {
                            return (
                                <Card
                                    key={col.facultad}
                                    as={Link}
                                    href={`/${carrera.slug}`}
                                    isPressable
                                    className="cell-active h-20 md:h-24 lg:h-[108px] border-none text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden relative z-0 hover:z-10"
                                    style={{
                                        background: `linear-gradient(135deg, ${col.color}, ${col.color}cc)`,
                                        ["--cell-glow"]: `${col.color}45`,
                                    }}
                                >
                                    <CardBody className="flex items-center justify-center p-3">
                                        <span className="font-bold text-xs md:text-sm lg:text-base leading-snug text-center drop-shadow-sm">
                                            {carrera.nombre}
                                        </span>
                                    </CardBody>
                                </Card>
                            );
                        }

                        {/* Carrera próximamente */ }
                        return (
                            <Card
                                key={col.facultad}
                                className="h-20 md:h-24 lg:h-[108px] shadow-none bg-[#d8dce4] dark:!bg-[#1e2330] border-2 border-dashed border-gray-300/80 dark:border-gray-600/50"
                            >
                                <CardBody className="flex flex-col items-center justify-center p-3">
                                    <p className="text-[10px] md:text-xs lg:text-sm font-semibold text-gray-400 dark:text-gray-500 leading-tight text-center">
                                        {carrera.nombre}
                                    </p>
                                    <p className="text-[8px] md:text-[9px] text-gray-300 dark:text-gray-600 mt-1.5 font-semibold uppercase tracking-widest">
                                        Próximamente
                                    </p>
                                </CardBody>
                            </Card>
                        );
                    })}
                </div>
            ))}
        </CardBody>
    );
}
