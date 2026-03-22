import { Modal, Button } from "@heroui/react";
import { TriangleAlert } from 'lucide-react';

export default function ConflictModal({ isOpen, onClose, conflictoInfo }) {
    return (
        <Modal>
            <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose?.()}>
                <Modal.Container size="md" placement="center">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header className="flex gap-1 items-center">
                            <div className="bg-danger-100 rounded-full p-2 mr-3">
                                <TriangleAlert className="w-5 h-5 md:w-6 md:h-6 text-danger" />
                            </div>
                            <Modal.Heading className="text-foreground">Conflicto de Horarios</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="mb-4">
                                <p className="text-sm md:text-base text-foreground-600 mb-2">
                                    No se puede agregar <span className="font-semibold text-accent">{conflictoInfo.cursoNuevo}</span>
                                    {' '}porque tiene conflicto de horarios con:
                                </p>
                                <p className="text-sm md:text-base font-semibold text-danger">
                                    {conflictoInfo.cursoExistente}
                                </p>
                            </div>

                            {conflictoInfo.detallesConflicto && (
                                <div className="mb-4 p-3 bg-danger-50 rounded-lg border border-danger-200">
                                    <p className="text-xs md:text-sm font-medium text-danger-800 mb-2">Horarios en conflicto:</p>
                                    {conflictoInfo.detallesConflicto.map((conflicto, index) => (
                                        <div key={index} className="text-xs md:text-sm text-danger-700">
                                            • {conflicto.dia} {conflicto.horario}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onPress={onClose}>
                                Entendido
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
