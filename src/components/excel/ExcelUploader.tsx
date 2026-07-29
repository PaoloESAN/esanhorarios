import { useRef, ChangeEvent } from 'react';
import { Button } from '@heroui/react';
import { CloudUpload, FileText } from 'lucide-react';

export interface ExcelUploaderProps {
    nombreArchivo: string;
    nombreArchivoTalleres?: string;
    cargandoArchivo: boolean;
    onCargaArchivo: (evento: ChangeEvent<HTMLInputElement>) => void;
}

function ExcelUploader({ nombreArchivo, nombreArchivoTalleres, cargandoArchivo, onCargaArchivo }: ExcelUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleOpenFilePicker = () => {
        if (!inputRef.current || cargandoArchivo) return;
        inputRef.current.value = '';
        inputRef.current.click();
    };

    return (
        <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto justify-end">
            {nombreArchivo && (
                <div className="flex items-center bg-surface-secondary px-2 md:px-3 py-1 md:py-2 rounded-lg border border-divider">
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
                variant="primary"
                size="sm"
                className="cursor-pointer"
                isPending={cargandoArchivo}
                onPress={handleOpenFilePicker}
            >
                {!cargandoArchivo && <CloudUpload size={18} />}
                <span className="hidden sm:inline">{cargandoArchivo ? 'Cargando...' : 'Cargar Excel'}</span>
                <span className="sm:hidden">Excel</span>
            </Button>
            <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls"
                multiple
                onChange={onCargaArchivo}
                className="hidden"
                disabled={cargandoArchivo}
            />
        </div>
    );
}

export default ExcelUploader;
