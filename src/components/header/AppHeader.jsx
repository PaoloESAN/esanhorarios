import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@heroui/button';
import { useTheme } from 'next-themes';
import { useCarrera } from '@/app/[slug]/CarreraContext';
import { Sun, Moon } from 'lucide-react';
import ExcelUploader from '@/components/excel/ExcelUploader';

/**
 * Encabezado superior de la aplicación: título, zona de carga de Excel y toggle de tema.
 */
function AppHeader({ nombreArchivo, cargandoArchivo, onCargaArchivo }) {
    const { setTheme, resolvedTheme } = useTheme();
    const { nombre } = useCarrera();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const esDark = mounted && resolvedTheme === 'dark';

    return (
        <div className="bg-content1 rounded-lg shadow-md p-3 md:p-6 mb-3 md:mb-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div className="flex items-center gap-3">
                    <Button
                        as={Link}
                        href="/"
                        size="sm"
                        variant="flat"
                        isIconOnly
                        title="Volver al inicio"
                        className="shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Button>
                    <div>
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-1">
                            Creador de Horarios - {nombre}
                        </h1>
                        <p className="text-sm md:text-base text-foreground-500">
                            Arrastra o selecciona los cursos desde el panel hacia la tabla de horarios.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 md:gap-3 items-center justify-end">
                    <ExcelUploader
                        nombreArchivo={nombreArchivo}
                        cargandoArchivo={cargandoArchivo}
                        onCargaArchivo={onCargaArchivo}
                    />

                    {/* Toggle de tema (sólo en desktop, en mobile lo maneja EncabezadoHorario) */}
                    <Button
                        className="hidden lg:inline-flex"
                        onClick={() => setTheme(esDark ? 'light' : 'dark')}
                        color="default"
                        size="sm"
                        variant="ghost"
                        title="Cambiar tema"
                        startContent={esDark ? <Sun size={18} /> : <Moon size={18} />}
                    >
                        {esDark ? 'Modo claro' : 'Modo oscuro'}
                    </Button>
                </div>
            </div>
        </div >
    );
}

export default AppHeader;
