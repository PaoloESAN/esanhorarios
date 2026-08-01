import { useRef, ChangeEvent } from 'react';
import { Modal, Button } from '@heroui/react';
import { FileText, CloudUpload, Trash2, FolderKanban } from 'lucide-react';

export interface ModalGestionExcelsProps {
    isOpen: boolean;
    onClose: () => void;
    nombreArchivo: string;
    nombreArchivoTalleres?: string;
    nombreArchivoElectivos?: string;
    cargandoArchivo?: boolean;
    cargandoTalleres?: boolean;
    cargandoElectivos?: boolean;
    onEliminarBase: () => void;
    onEliminarTalleres: () => void;
    onEliminarElectivos: () => void;
    onCargaArchivo: (evento: ChangeEvent<HTMLInputElement>) => void;
    onCargaTalleres: (evento: ChangeEvent<HTMLInputElement>) => void;
    onCargaElectivos: (evento: ChangeEvent<HTMLInputElement>) => void;
}

export default function ModalGestionExcels({
    isOpen,
    onClose,
    nombreArchivo,
    nombreArchivoTalleres = '',
    nombreArchivoElectivos = '',
    cargandoArchivo = false,
    cargandoTalleres = false,
    cargandoElectivos = false,
    onEliminarBase,
    onEliminarTalleres,
    onEliminarElectivos,
    onCargaArchivo,
    onCargaTalleres,
    onCargaElectivos,
}: ModalGestionExcelsProps) {
    const inputBaseRef = useRef<HTMLInputElement>(null);
    const inputTalleresRef = useRef<HTMLInputElement>(null);
    const inputElectivosRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = (ref: React.RefObject<HTMLInputElement | null>, cargando?: boolean) => {
        if (!ref.current || cargando) return;
        ref.current.value = '';
        ref.current.click();
    };

    return (
        <Modal>
            <Modal.Trigger className="sr-only">
                <span />
            </Modal.Trigger>
            <Modal.Backdrop isOpen={isOpen} onOpenChange={(open: boolean) => !open && onClose?.()}>
                <Modal.Container size="lg" placement="center">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header className="flex gap-2 items-center">
                            <div className="bg-accent-soft rounded-full p-2 text-accent">
                                <FolderKanban className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div>
                                <Modal.Heading className="text-foreground text-lg md:text-xl font-bold">
                                    Gestión de Archivos Excel
                                </Modal.Heading>
                                <p className="text-xs text-muted">
                                    Administra o elimina individualmente los horarios cargados.
                                </p>
                            </div>
                        </Modal.Header>
                        <Modal.Body className="space-y-4 py-3">
                            {/* Hidden inputs para cada tipo de Excel */}
                            <input
                                ref={inputBaseRef}
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={onCargaArchivo}
                                className="hidden"
                                disabled={cargandoArchivo}
                            />
                            <input
                                ref={inputTalleresRef}
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={onCargaTalleres}
                                className="hidden"
                                disabled={cargandoTalleres}
                            />
                            <input
                                ref={inputElectivosRef}
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={onCargaElectivos}
                                className="hidden"
                                disabled={cargandoElectivos}
                            />

                            {/* ITEM 1: Excel Base */}
                            <div className="p-3.5 md:p-4 rounded-xl border border-divider bg-surface-secondary/60 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="p-2 rounded-lg bg-accent-soft text-accent shrink-0">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-xs font-semibold text-muted uppercase tracking-wider">
                                            Excel Base de Cursos
                                        </div>
                                        {nombreArchivo ? (
                                            <div className="text-sm font-medium text-foreground truncate mt-0.5" title={nombreArchivo}>
                                                {nombreArchivo}
                                            </div>
                                        ) : (
                                            <div className="text-xs text-foreground-400 italic mt-0.5">
                                                No se ha cargado un Excel base
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Button
                                        variant="tertiary"
                                        size="sm"
                                        isPending={cargandoArchivo}
                                        onPress={() => handleUploadClick(inputBaseRef, cargandoArchivo)}
                                    >
                                        <CloudUpload size={16} />
                                        <span className="hidden sm:inline">{nombreArchivo ? 'Reemplazar' : 'Subir'}</span>
                                    </Button>
                                    {nombreArchivo && (
                                        <Button
                                            variant="tertiary"
                                            size="sm"
                                            isIconOnly
                                            className="text-danger hover:bg-danger-50 dark:hover:bg-danger-950/40"
                                            onPress={onEliminarBase}
                                            {...{ title: "Borrar Excel Base" } as any}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* ITEM 2: Excel Talleres */}
                            <div className="p-3.5 md:p-4 rounded-xl border border-divider bg-surface-secondary/60 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="p-2 rounded-lg bg-warning-50 text-warning-500 shrink-0">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-xs font-semibold text-warning-600 uppercase tracking-wider">
                                            Excel de Talleres
                                        </div>
                                        {nombreArchivoTalleres ? (
                                            <div className="text-sm font-medium text-warning-700 dark:text-warning-300 truncate mt-0.5" title={nombreArchivoTalleres}>
                                                {nombreArchivoTalleres}
                                            </div>
                                        ) : (
                                            <div className="text-xs text-foreground-400 italic mt-0.5">
                                                No se ha cargado Excel de talleres
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Button
                                        variant="tertiary"
                                        size="sm"
                                        isPending={cargandoTalleres}
                                        onPress={() => handleUploadClick(inputTalleresRef, cargandoTalleres)}
                                    >
                                        <CloudUpload size={16} />
                                        <span className="hidden sm:inline">{nombreArchivoTalleres ? 'Reemplazar' : 'Subir'}</span>
                                    </Button>
                                    {nombreArchivoTalleres && (
                                        <Button
                                            variant="tertiary"
                                            size="sm"
                                            isIconOnly
                                            className="text-danger hover:bg-danger-50 dark:hover:bg-danger-950/40"
                                            onPress={onEliminarTalleres}
                                            {...{ title: "Borrar Excel de Talleres" } as any}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* ITEM 3: Excel Electivos */}
                            <div className="p-3.5 md:p-4 rounded-xl border border-divider bg-surface-secondary/60 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-500 shrink-0">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                                            Excel de Electivos
                                        </div>
                                        {nombreArchivoElectivos ? (
                                            <div className="text-sm font-medium text-purple-700 dark:text-purple-300 truncate mt-0.5" title={nombreArchivoElectivos}>
                                                {nombreArchivoElectivos}
                                            </div>
                                        ) : (
                                            <div className="text-xs text-foreground-400 italic mt-0.5">
                                                No se ha cargado Excel de electivos
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Button
                                        variant="tertiary"
                                        size="sm"
                                        isPending={cargandoElectivos}
                                        onPress={() => handleUploadClick(inputElectivosRef, cargandoElectivos)}
                                    >
                                        <CloudUpload size={16} />
                                        <span className="hidden sm:inline">{nombreArchivoElectivos ? 'Reemplazar' : 'Subir'}</span>
                                    </Button>
                                    {nombreArchivoElectivos && (
                                        <Button
                                            variant="tertiary"
                                            size="sm"
                                            isIconOnly
                                            className="text-danger hover:bg-danger-50 dark:hover:bg-danger-950/40"
                                            onPress={onEliminarElectivos}
                                            {...{ title: "Borrar Excel de Electivos" } as any}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onPress={onClose}>
                                Cerrar
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
