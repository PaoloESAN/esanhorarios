"use client";

import { Button } from "@heroui/react";
import { Sun, Moon, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FacultadesCard from "./FacultadesCard";
import NotificacionModal from "../modales/NotificacionModal";
import { COLUMNAS } from "./data";

const emptySubscribe = () => () => { };

export default function Landing() {
    const { resolvedTheme, setTheme } = useTheme();
    const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
    const [expandedFacultad, setExpandedFacultad] = useState<string | null>(null);
    const [modalNotificacionesOpen, setModalNotificacionesOpen] = useState(false);

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

            {/* Contenedor Principal */}
            <div className="relative z-10 w-full max-w-325 calendar-enter my-auto flex flex-col items-center">
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
                <div className="w-full flex flex-col items-center">
                    {!expandedFacultad && (
                        <Button
                            onPress={() => setModalNotificacionesOpen(true)}
                            className="mb-2 md:mb-4 bg-black/70 dark:bg-black/80 backdrop-blur-md text-white hover:bg-black/90 hover:scale-105 transition-all shadow-lg border border-white/20 px-6 py-6 text-base md:text-lg font-bold rounded-full"
                            aria-label="Notifícame"
                        >
                            <Bell size={20} />
                            Notifícame
                        </Button>
                    )}
                    <FacultadesCard
                        expandedFacultad={expandedFacultad}
                        setExpandedFacultad={setExpandedFacultad}
                    />
                </div>
            </div>

            <NotificacionModal
                isOpen={modalNotificacionesOpen}
                onClose={() => setModalNotificacionesOpen(false)}
                onContinue={() => setModalNotificacionesOpen(false)}
            />
        </div>
    );
}
