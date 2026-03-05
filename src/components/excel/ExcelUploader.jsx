import { Button } from '@heroui/button';
import { CloudUpload, FileText } from 'lucide-react';

function ExcelUploader({ nombreArchivo, nombreArchivoTalleres, cargandoArchivo, onCargaArchivo }) {
    return (
        <>
            {nombreArchivo && (
                <div className="flex items-center bg-content2 px-2 md:px-3 py-1 md:py-2 rounded-lg border border-divider">
                    <FileText className="w-3 h-3 md:w-4 md:h-4 text-foreground-500 mr-1 md:mr-2" />
                    <span className="text-xs md:text-sm text-foreground font-medium truncate max-w-20 md:max-w-none">
                        {nombreArchivo}
                    </span>
                </div>
            )}

            {nombreArchivoTalleres && (
                <div className="flex items-center bg-warning-50 px-2 md:px-3 py-1 md:py-2 rounded-lg border border-warning-200">
                    <FileText className="w-3 h-3 md:w-4 md:h-4 text-warning-500 mr-1 md:mr-2" />
                    <span className="text-xs md:text-sm text-warning-700 font-medium truncate max-w-20 md:max-w-none">
                        {nombreArchivoTalleres}
                    </span>
                </div>
            )}

            <Button
                as="label"
                color="primary"
                size="sm"
                className="cursor-pointer"
                isLoading={cargandoArchivo}
                startContent={!cargandoArchivo && <CloudUpload size={18} />}
            >
                <span className="hidden sm:inline">{cargandoArchivo ? 'Cargando...' : 'Cargar Excel'}</span>
                <span className="sm:hidden">Excel</span>
                <input
                    type="file"
                    accept=".xlsx,.xls"
                    multiple
                    onChange={onCargaArchivo}
                    className="hidden"
                    disabled={cargandoArchivo}
                />
            </Button>
        </>
    );
}

export default ExcelUploader;

