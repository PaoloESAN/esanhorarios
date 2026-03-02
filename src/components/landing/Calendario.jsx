"use client";

import { Button } from "@heroui/react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FacultadesCard from "./FacultadesCard";
import { COLUMNAS } from "./data";

export default function Calendario() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [expandedFacultad, setExpandedFacultad] = useState(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const activeFacultad = COLUMNAS.find(c => c.facultad === expandedFacultad);
    const bgImage = activeFacultad ? activeFacultad.bgImage : "/esancampus.webp";

    return (
        <div className="min-h-screen w-full flex flex-col items-center p-4 md:p-6 lg:p-8 relative overflow-hidden">
            {/* Imagen de fondo dinámica con transición */}
            <div className="absolute inset-0 z-[-2] bg-black bg-cover bg-center bg-no-repeat">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={bgImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
                        style={{ backgroundImage: `url(${bgImage})` }}
                    />
                </AnimatePresence>
            </div>
            {/* Overlay oscurecedor para leer el contenido */}
            <div className="absolute inset-0 z-[-1] bg-black/30 transition-colors duration-500" />

            {/* Botón cambiar tema */}
            {mounted && (
                <Button
                    isIconOnly
                    variant="flat"
                    className="fixed top-4 right-4 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg border border-gray-200/60 dark:border-gray-700/60 text-gray-600 dark:text-gray-300 hover:scale-110 transition-transform"
                    onPress={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                    aria-label="Cambiar tema"
                >
                    {resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </Button>
            )}

            {/* Contenedor Principal */}
            <div className="relative z-10 w-full max-w-[1300px] calendar-enter my-auto flex flex-col items-center">
                {/* Título Superior (se oculta al seleccionar una facultad) */}
                {!expandedFacultad && (
                    <div className="mb-8 md:mb-12 text-center px-4">
                        <h1
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight"
                            style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
                        >
                            Crea tu horario de{" "}
                            <span className="text-red-500" style={{ textShadow: "0 2px 15px rgba(239,68,68,0.4)" }}>
                                ESAN
                            </span>
                        </h1>
                    </div>
                )}

                {/* Vista principal responsiva (Grilla de facultades / Lista de carreras) */}
                <div className="w-full">
                    <FacultadesCard
                        expandedFacultad={expandedFacultad}
                        setExpandedFacultad={setExpandedFacultad}
                    />
                </div>
            </div>
        </div>
    );
}
