"use client";

import { Card, CardHeader, Button } from "@heroui/react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import VistaMobile from "./VistaMobile";
import VistaDesktop from "./VistaDesktop";

export default function Calendario() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [expandedFacultad, setExpandedFacultad] = useState(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-black p-4 md:p-6 lg:p-8 relative overflow-hidden">
            {/* Decoración de fondo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div
                    className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
                    style={{
                        backgroundImage: "radial-gradient(circle, #666 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                    }}
                />
                <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-green-300/15 dark:bg-green-600/8 blur-3xl" />
                <div className="absolute top-1/4 -right-40 w-[450px] h-[450px] rounded-full bg-blue-300/15 dark:bg-blue-600/8 blur-3xl" />
                <div className="absolute -bottom-40 left-1/3 w-[500px] h-[400px] rounded-full bg-purple-200/15 dark:bg-purple-600/8 blur-3xl" />
            </div>

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

            {/* Calendario */}
            <div className="relative z-10 w-full max-w-[1300px] calendar-enter my-auto">
                {/* Anillos metálicos */}
                <div className="relative z-20 flex justify-between px-[22%] sm:px-[25%] md:px-[28%]">
                    {[0, 1].map((i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div
                                className="w-7 h-10 md:w-10 md:h-16 rounded-full shadow-lg"
                                style={{
                                    background: "linear-gradient(180deg, #b8bcc4 0%, #d4d8de 30%, #a0a4ac 70%, #b8bcc4 100%)",
                                    border: "2.5px solid #9ca3af",
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Cuerpo del calendario */}
                <Card className="rounded-3xl overflow-hidden shadow-2xl dark:shadow-black/50 -mt-5 md:-mt-8 border-none">
                    {/* Cabecera roja */}
                    <CardHeader
                        className="relative px-6 py-8 md:py-14 flex flex-col items-center justify-center text-center overflow-hidden rounded-none"
                        style={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 40%, #b91c1c 100%)" }}
                    >
                        <div
                            className="absolute inset-0 opacity-[0.06]"
                            style={{
                                backgroundImage:
                                    "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.12) 10px, rgba(255,255,255,0.12) 20px)",
                            }}
                        />
                        <h1
                            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight relative"
                            style={{ textShadow: "0 3px 12px rgba(0,0,0,0.2)" }}
                        >
                            Genera tu horario de{" "}
                            <span className="text-amber-200" style={{ textShadow: "0 2px 20px rgba(251,191,36,0.35)" }}>
                                ESAN
                            </span>
                        </h1>
                        <p className="text-white/65 mt-2 md:mt-4 text-xs sm:text-sm md:text-lg font-medium relative tracking-wide max-w-2xl">
                            Selecciona tu carrera para comenzar a armar tu horario ideal
                        </p>
                    </CardHeader>

                    {/* Vista móvil */}
                    <VistaMobile
                        expandedFacultad={expandedFacultad}
                        setExpandedFacultad={setExpandedFacultad}
                    />

                    {/* Vista escritorio */}
                    <VistaDesktop />
                </Card>
            </div>
        </div>
    );
}
