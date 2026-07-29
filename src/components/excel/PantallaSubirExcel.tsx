import { useRef, useState, ChangeEvent, DragEvent } from 'react';
import { Button } from '@heroui/react';
import { FileText, CloudUpload } from 'lucide-react';

export interface PantallaSubirExcelProps {
    cargandoArchivo: boolean;
    onCargaArchivo: (evento: ChangeEvent<HTMLInputElement>) => void;
    onCargaArchivosDirectos?: (archivos: File[]) => void;
}

function PantallaSubirExcel({ cargandoArchivo, onCargaArchivo, onCargaArchivosDirectos }: PantallaSubirExcelProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleOpenFilePicker = () => {
        if (!inputRef.current || cargandoArchivo) return;
        inputRef.current.value = '';
        inputRef.current.click();
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const archivos = Array.from(e.dataTransfer.files);
            onCargaArchivosDirectos?.(archivos);
        }
    };

    return (
        <div
            onClick={handleOpenFilePicker}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full bg-surface rounded-2xl shadow-md p-4 md:p-6 flex flex-col items-center justify-center text-center overflow-hidden h-auto lg:min-h-[360px] border-2 transition-all cursor-pointer ${
                isDragging
                    ? 'border-accent bg-accent-soft/40 scale-[1.01]'
                    : 'border-accent hover:border-accent hover:bg-surface-secondary/40'
            }`}
        >
            <div className={`rounded-full p-4 mb-4 transition-all ${isDragging ? 'bg-accent text-surface scale-110' : 'bg-accent-soft text-accent'}`}>
                <FileText className="w-8 h-8 md:w-12 md:h-12" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                {isDragging ? '¡Suelta tus archivos aquí!' : '¡Bienvenido!'}
            </h3>
            <p className="text-sm md:text-base text-muted mb-6 max-w-xs">
                {isDragging
                    ? 'Procesaremos automáticamente el horario y talleres'
                    : 'Carga los archivos Excel con los horarios. Puedes seleccionar o arrastrar el de cursos y el de talleres a la vez.'}
            </p>
            <Button
                variant="primary"
                size="md"
                className="cursor-pointer mb-4"
                isPending={cargandoArchivo}
                onPress={handleOpenFilePicker}
            >
                {!cargandoArchivo && <CloudUpload className="w-5 h-5" />}
                {cargandoArchivo ? 'Cargando Excel...' : 'Cargar Archivos Excel'}
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

export default PantallaSubirExcel;
