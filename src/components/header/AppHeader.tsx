import Link from 'next/link';
import { useCarrera } from '@/app/[slug]/CarreraContext';
import ExcelUploader from '@/components/excel/ExcelUploader';
import { ChangeEvent } from 'react';

export interface AppHeaderProps {
    nombreArchivo: string;
    nombreArchivoTalleres?: string;
    nombreArchivoElectivos?: string;
    cargandoArchivo: boolean;
    onCargaArchivo: (evento: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Encabezado superior de la aplicación: título, card de Malla y card de Excel cargado.
 */
function AppHeader({ nombreArchivo, nombreArchivoTalleres, nombreArchivoElectivos, cargandoArchivo, onCargaArchivo }: AppHeaderProps) {
    const { nombre, slug } = useCarrera();
    const hayArchivo = Boolean(nombreArchivo);

    return (
        <div className="mb-3 md:mb-6">
            {/* Header principal */}
            <div className="bg-surface rounded-2xl shadow-md p-3 md:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Izquierda: Título y descripción */}
                    <div className="flex items-center gap-3 shrink-0">
                        <Link
                            href="/"
                            title="Volver al inicio"
                            className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-xl bg-surface-secondary hover:bg-overlay text-foreground transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <div>
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-1">
                                {nombre}
                            </h1>
                            <p className="text-sm md:text-base text-muted">
                                Arrastra o selecciona los cursos desde el panel hacia la tabla de horarios.
                            </p>
                        </div>
                    </div>

                    {/* Centro (Desktop XL): Card de Malla Curricular */}
                    {hayArchivo && (
                        <div className="hidden xl:flex flex-1 justify-center mx-2">
                            <Link
                                href={`/${slug}/malla`}
                                className="group bg-surface-secondary/80 hover:bg-emerald-500/10 border border-overlay/80 hover:border-emerald-500/50 rounded-2xl px-4 py-2.5 flex flex-col text-left items-start justify-center transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 w-fit"
                                title="Ver Malla Curricular"
                            >
                                <span className="text-sm md:text-base font-bold text-foreground group-hover:text-emerald-500 transition-colors whitespace-nowrap">
                                    Malla Curricular
                                </span>
                                <span className="text-xs md:text-sm text-muted mt-1">
                                    Marca tus cursos aprobados para organizar tu horario más fácilmente.
                                </span>
                            </Link>
                        </div>
                    )}

                    {/* Derecha (Desktop XL): Card de Excel Activo */}
                    {hayArchivo && (
                        <div className="hidden xl:flex shrink-0">
                            <ExcelUploader
                                nombreArchivo={nombreArchivo}
                                nombreArchivoTalleres={nombreArchivoTalleres}
                                nombreArchivoElectivos={nombreArchivoElectivos}
                                cargandoArchivo={cargandoArchivo}
                                onCargaArchivo={onCargaArchivo}
                                variant="desktop"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Laptop Mediana / Tablet / Mobile (debajo del header principal): Card de Malla Curricular y Card de Excel */}
            {hayArchivo && (
                <div className="block xl:hidden space-y-3 mt-3">
                    {/* Card 1: Malla Curricular */}
                    <Link
                        href={`/${slug}/malla`}
                        className="group bg-emerald-500/10 border border-emerald-500/50 hover:bg-emerald-500/20 rounded-2xl shadow-md p-4 flex items-center justify-between transition-all w-full"
                        title="Ver Malla Curricular"
                    >
                        <div className="flex flex-col text-left">
                            <span className="text-base md:text-lg font-bold text-emerald-500 transition-colors">
                                Malla Curricular
                            </span>
                            <span className="text-sm md:text-base text-muted mt-1">
                                Marca tus cursos aprobados para organizar tu horario más fácilmente.
                            </span>
                        </div>
                        <div className="shrink-0 ml-3 inline-flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-500 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>

                    {/* Card 2: Excel Cargado y opción para cargar nuevo Excel */}
                    <ExcelUploader
                        nombreArchivo={nombreArchivo}
                        nombreArchivoTalleres={nombreArchivoTalleres}
                        nombreArchivoElectivos={nombreArchivoElectivos}
                        cargandoArchivo={cargandoArchivo}
                        onCargaArchivo={onCargaArchivo}
                        variant="mobile"
                    />
                </div>
            )}
        </div>
    );
}

export default AppHeader;
