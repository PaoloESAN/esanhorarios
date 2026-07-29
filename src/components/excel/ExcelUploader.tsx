import { useRef, ChangeEvent } from 'react';
import { Button } from '@heroui/react';
import { CloudUpload, FileText } from 'lucide-react';

export interface ExcelUploaderProps {
    nombreArchivo: string;
    nombreArchivoTalleres?: string;
    cargandoArchivo: boolean;
    onCargaArchivo: (evento: ChangeEvent<HTMLInputElement>) => void;
    variant?: 'desktop' | 'mobile';
}

function ExcelUploader({
    nombreArchivo,
    nombreArchivoTalleres,
    cargandoArchivo,
    onCargaArchivo,
    variant = 'desktop',
}: ExcelUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleOpenFilePicker = () => {
        if (!inputRef.current || cargandoArchivo) return;
        inputRef.current.value = '';
        inputRef.current.click();
    };

    if (!nombreArchivo) return null;

    if (variant === 'mobile') {
        return (
            <div className="bg-surface rounded-2xl shadow-md border border-divider p-3.5 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
                <div className="flex flex-col gap-1.5 min-w-0">
                    <span className="text-xs font-semibold text-muted uppercase tracking-wider">Archivos Excel cargados</span>
                    <div className="flex flex-wrap items-center gap-2">
                        {nombreArchivo && (
                            <div className="flex items-center bg-surface-secondary px-2.5 py-1 rounded-lg border border-divider">
                                <FileText className="w-4 h-4 text-accent mr-1.5 shrink-0" />
                                <span className="text-xs md:text-sm text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
                                    {nombreArchivo}
                                </span>
                            </div>
                        )}
                        {nombreArchivoTalleres && (
                            <div className="flex items-center bg-warning-50 px-2.5 py-1 rounded-lg border border-warning-200">
                                <FileText className="w-4 h-4 text-warning-500 mr-1.5 shrink-0" />
                                <span className="text-xs md:text-sm text-warning-700 font-medium truncate max-w-[200px] sm:max-w-none">
                                    {nombreArchivoTalleres}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <Button
                    variant="primary"
                    size="sm"
                    className="cursor-pointer shrink-0 w-full sm:w-auto mt-1 sm:mt-0"
                    isPending={cargandoArchivo}
                    onPress={handleOpenFilePicker}
                >
                    {!cargandoArchivo && <CloudUpload size={16} />}
                    <span>{cargandoArchivo ? 'Cargando...' : 'Cargar nuevo Excel'}</span>
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

    // Variant: Desktop (card en la esquina superior derecha del header)
    return (
        <div className="bg-surface-secondary/80 border border-overlay/80 rounded-2xl px-4 py-2 flex items-center justify-between gap-3 shadow-sm max-w-md">
            <div className="flex flex-col text-left min-w-0 mr-1">
                <div className="flex items-center gap-1.5 truncate">
                    <FileText className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span className="text-xs font-bold text-foreground truncate">
                        {nombreArchivo}
                    </span>
                </div>
                {nombreArchivoTalleres ? (
                    <span className="text-[11px] text-warning-600 font-medium truncate mt-0.5">
                        Talleres: {nombreArchivoTalleres}
                    </span>
                ) : (
                    <span className="text-[11px] text-muted leading-tight mt-0.5">
                        Excel de horarios activo
                    </span>
                )}
            </div>

            <Button
                variant="primary"
                size="sm"
                className="cursor-pointer shrink-0"
                isPending={cargandoArchivo}
                onPress={handleOpenFilePicker}
            >
                {!cargandoArchivo && <CloudUpload size={16} />}
                <span>{cargandoArchivo ? 'Cargando...' : 'Cargar nuevo Excel'}</span>
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
