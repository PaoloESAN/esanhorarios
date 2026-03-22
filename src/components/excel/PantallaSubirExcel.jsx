import { useRef } from 'react';
import { Button } from '@heroui/react';
import { FileText, CloudUpload } from 'lucide-react';

function PantallaSubirExcel({ cargandoArchivo, onCargaArchivo }) {
    const inputRef = useRef(null);

    const handleOpenFilePicker = () => {
        if (!inputRef.current || cargandoArchivo) return;
        inputRef.current.value = '';
        inputRef.current.click();
    };

    return (
        <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center">
            <div className="bg-primary-50 rounded-full p-4 mb-4">
                <FileText className="w-8 h-8 md:w-12 md:h-12 text-primary" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">¡Bienvenido!</h3>
            <p className="text-sm md:text-base text-foreground-500 mb-6 max-w-xs">
                Carga los archivos Excel con los horarios. Puedes seleccionar el de cursos y el de talleres a la vez.
            </p>
            <Button
                variant="primary"
                size="md"
                className="cursor-pointer mb-4"
                isPending={cargandoArchivo}
                startContent={!cargandoArchivo && <CloudUpload className="w-5 h-5" />}
                onPress={handleOpenFilePicker}
            >
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

