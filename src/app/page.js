"use client";

import Link from "next/link";
import { getCarrerasPorFacultad } from "@/data";
import { Card, CardHeader, CardBody, Divider, Button } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ICONOS_FACULTAD = {
  "Ingeniería": (
    <svg viewBox="0 0 24 24" width={24} height={24} color="currentColor" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M13 11L18 6" />
      <path d="M19 7L17 5L19.5 3.5L20.5 4.5L19 7Z" />
      <path d="M4.02513 8.97487C3.01416 7.96391 2.75095 6.48836 3.23548 5.23548L4.65748 6.65748H6.65748V4.65748L5.23548 3.23548C6.48836 2.75095 7.96391 3.01416 8.97487 4.02513C9.98621 5.03647 10.2493 6.51274 9.76398 7.76593L16.2341 14.236C17.4873 13.7507 18.9635 14.0138 19.9749 15.0251C20.9858 16.0361 21.2491 17.5116 20.7645 18.7645L19.3425 17.3425L17.3425 17.3425V19.3425L18.7645 20.7645C17.5116 21.2491 16.0361 20.9858 15.0251 19.9749C14.0145 18.9643 13.7511 17.4895 14.2349 16.2369L7.76312 9.76507C6.51053 10.2489 5.03571 9.98546 4.02513 8.97487Z" />
      <path d="M12.203 14.5L6.59897 20.1041C6.07115 20.6319 5.2154 20.6319 4.68758 20.1041L3.89586 19.3124C3.36805 18.7846 3.36805 17.9288 3.89586 17.401L9.49994 11.7969" />
    </svg>
  ),
  "Comunicaciones": (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15a3 3 0 01-3-3V5.25a3 3 0 116 0V12a3 3 0 01-3 3z" />
    </svg>
  ),
  "Administración": (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
    </svg>
  ),
  "Derecho": (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v18m0-18L3 12m9-9l9 9" />
    </svg>
  ),
  "Economía": (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  "Psicología": (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};


export default function Home() {
  const facultades = getCarrerasPorFacultad();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-slate-50 via-gray-100 to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-black overflow-hidden relative selection:bg-primary selection:text-white">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Patrón de puntos sutil */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/15 dark:bg-blue-600/20 blur-3xl md:blur-[120px]" />
        <div className="absolute top-[30%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-400/15 dark:bg-purple-600/20 blur-3xl md:blur-[100px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[40%] rounded-full bg-orange-400/10 dark:bg-orange-600/20 blur-3xl md:blur-[120px]" />
      </div>

      {/* Theme Toggle Button */}
      {mounted && (
        <div className="absolute top-6 right-6 z-50">
          <Button
            isIconOnly
            variant="flat"
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:scale-105 transition-transform"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </Button>
        </div>
      )}

      <div className="flex flex-col h-full w-full max-w-7xl relative z-10 px-6 py-12 md:py-16">
        {/* Header Section */}
        <div className="flex-none text-center mb-10 md:mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <img src="/calendario.png" alt="Calendario" className="w-40 h-40" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            Genera tu horario de <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 dark:from-red-500 dark:to-red-300">ESAN</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Explora las facultades y haz clic en tu carrera para comenzar a generar tu horario ideal.
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full flex items-start justify-center overflow-y-auto no-scrollbar pb-8">
          <div className="flex flex-wrap justify-center gap-6 w-full max-w-7xl py-2">

            {facultades.map(({ facultad, carreras }, index) => {
              const paleta = [
                { bg: '#2563eb', light: '#eff6ff', lightText: '#1e40af', lightBorder: '#bfdbfe' },
                { bg: '#ea580c', light: '#fff7ed', lightText: '#c2410c', lightBorder: '#fed7aa' },
                { bg: '#0d9488', light: '#f0fdfa', lightText: '#0f766e', lightBorder: '#99f6e4' },
                { bg: '#4f46e5', light: '#eef2ff', lightText: '#4338ca', lightBorder: '#c7d2fe' },
                { bg: '#9333ea', light: '#faf5ff', lightText: '#7e22ce', lightBorder: '#d8b4fe' },
                { bg: '#db2777', light: '#fdf2f8', lightText: '#be185d', lightBorder: '#f9a8d4' },
              ];
              const color = paleta[index % paleta.length];

              return (
                <Card
                  key={facultad}
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] border border-gray-200/60 dark:border-gray-700/50 bg-white dark:bg-gray-800/90 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group rounded-2xl overflow-hidden"
                >
                  <div className="px-6 py-6 flex flex-row items-center gap-4 text-white rounded-t-2xl" style={{ backgroundColor: color.bg }}>
                    <div className="p-3 rounded-xl bg-white/20 text-white backdrop-blur-md shadow-inner">
                      {ICONOS_FACULTAD[facultad] ?? ICONOS_FACULTAD["Ingeniería"]}
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-90 mb-0.5">Facultad de</p>
                      <h3 className="text-xl font-bold tracking-tight leading-tight">{facultad}</h3>
                    </div>
                  </div>

                  <CardBody className="px-4 py-5 gap-3 bg-gray-50/80 dark:bg-gray-800/50">
                    {carreras.map(({ nombre, slug }) => (
                      <Button
                        key={slug}
                        as={Link}
                        href={`/${slug}`}
                        variant="flat"
                        className="justify-between h-auto py-4 px-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold w-full group/btn rounded-xl shadow-sm border border-gray-200/80 dark:border-gray-600 transition-all"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: color.light, color: color.lightText }}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                          <span className="truncate text-left">{nombre}</span>
                        </div>
                        <svg
                          className="w-4 h-4 text-gray-400 dark:text-gray-500 transform group-hover/btn:text-gray-600 dark:group-hover/btn:text-gray-300 group-hover/btn:translate-x-1 transition-all duration-300 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>
                    ))}
                  </CardBody>
                </Card>
              );
            })}

          </div>
        </div>
      </div>
    </div>
  );
}
