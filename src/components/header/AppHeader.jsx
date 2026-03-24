import Link from 'next/link';
import { useCarrera } from '@/app/[slug]/CarreraContext';
import ExcelUploader from '@/components/excel/ExcelUploader';

/**
 * Encabezado superior de la aplicación: título, zona de carga de Excel y toggle de tema.
 */
function AppHeader({ nombreArchivo, nombreArchivoTalleres, cargandoArchivo, onCargaArchivo }) {
    const { nombre } = useCarrera();

    return (
        <div className="bg-surface rounded-lg shadow-md p-3 md:p-6 mb-3 md:mb-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div className="flex items-center gap-3">
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

                <div className="flex flex-wrap gap-2 md:gap-3 items-center justify-end">
                    <ExcelUploader
                        nombreArchivo={nombreArchivo}
                        nombreArchivoTalleres={nombreArchivoTalleres}
                        cargandoArchivo={cargandoArchivo}
                        onCargaArchivo={onCargaArchivo}
                    />
                </div>
            </div>
        </div >
    );
}

export default AppHeader;
