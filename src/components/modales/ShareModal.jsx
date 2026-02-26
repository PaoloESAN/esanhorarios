import { Modal, ModalContent, ModalBody, ModalHeader, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Share2, Copy, Download } from 'lucide-react';

export default function ShareModal({ isOpen, onClose, dataUrl, onCopy, onDownload, filename = 'mi-horario.png' }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" placement="center">
            <ModalContent>
                <ModalHeader className="flex gap-1 items-center">
                    <div className="bg-primary-100 rounded-full p-2 mr-3">
                        <Share2 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <span className="text-foreground">Compartir horario</span>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-4">
                        <div className="text-sm text-foreground-600">Previsualización ({filename})</div>
                        <div className="w-full max-h-[60vh] overflow-auto bg-content2 border border-divider rounded-lg p-2 flex justify-center">
                            {dataUrl ? (
                                <img src={dataUrl} alt="Previsualización del horario" className="max-w-full h-auto rounded-md shadow" />
                            ) : (
                                <div className="text-foreground-500 text-sm">Generando imagen…</div>
                            )}
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center">
                        <Button className="w-full sm:w-auto" variant="flat" color="default" onPress={onClose}>Cerrar</Button>
                        <div className="flex w-full sm:w-auto gap-2 sm:ml-auto">
                            <Button
                                className="w-full sm:w-auto"
                                color="secondary"
                                onPress={onCopy}
                                isDisabled={!dataUrl}
                                startContent={<Copy size={18} />}
                            >
                                Copiar imagen
                            </Button>
                            <Button
                                className="w-full sm:w-auto"
                                color="primary"
                                onPress={onDownload}
                                isDisabled={!dataUrl}
                                startContent={<Download size={18} />}
                            >
                                Descargar
                            </Button>
                        </div>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
