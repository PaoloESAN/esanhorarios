import Link from 'next/link';
import { useCarrera } from '@/app/[slug]/CarreraContext';
import ExcelUploader from '@/components/excel/ExcelUploader';
import { ChangeEvent } from 'react';

export interface AppHeaderProps {
    nombreArchivo: string;
    nombreArchivoTalleres?: string;
    cargandoArchivo: boolean;
    onCargaArchivo: (evento: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Encabezado superior de la aplicación: título, zona de carga de Excel y toggle de tema.
 */
function AppHeader({ nombreArchivo, nombreArchivoTalleres, cargandoArchivo, onCargaArchivo }: AppHeaderProps) {
    const { nombre, slug } = useCarrera();

    return (
        <div className="bg-surface rounded-2xl shadow-md p-3 md:p-6 mb-3 md:mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Izquierda: Título y descripción */}
                <div className="flex items-center gap-3 shrink-0">
                    <Link
                        href="/"
                        title="Volver al inicio"
                        className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-md bg-surface-secondary hover:bg-overlay text-foreground transition-colors"
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

                {/* Centro: Card de Malla Curricular centrada (ajustada al contenido) */}
                <div className="flex-1 flex justify-center mx-auto lg:mx-0">
                    <Link
                        href={`/${slug}/malla`}
                        className="group bg-surface-secondary/80 hover:bg-emerald-500/10 border border-overlay/80 hover:border-emerald-500/50 rounded-2xl px-4 py-2.5 flex flex-col text-left items-start justify-center transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 w-fit max-w-full"
                        title="Ver Malla Curricular"
                    >
                        <span className="text-xs font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                            Malla Curricular
                        </span>
                        <span className="text-[11px] text-muted leading-tight mt-0.5">
                            Marca tus cursos aprobados para organizar tu horario más fácilmente.
                        </span>
                    </Link>
                </div>

                {/* Derecha: Botón de Cargar Excel */}
                <div className="shrink-0 flex items-center justify-end">
                    <ExcelUploader
                        nombreArchivo={nombreArchivo}
                        nombreArchivoTalleres={nombreArchivoTalleres}
                        cargandoArchivo={cargandoArchivo}
                        onCargaArchivo={onCargaArchivo}
                    />
                </div>
            </div>
        </div>
    );
}

export default AppHeader;
