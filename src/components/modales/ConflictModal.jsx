import { Modal, ModalContent, ModalBody, ModalHeader, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { TriangleAlert } from 'lucide-react';

export default function ConflictModal({ isOpen, onClose, conflictoInfo }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" placement="center">
            <ModalContent>
                <ModalHeader className="flex gap-1 items-center">
                    <div className="bg-danger-100 rounded-full p-2 mr-3">
                        <TriangleAlert className="w-5 h-5 md:w-6 md:h-6 text-danger" />
                    </div>
                    <span className="text-foreground">Conflicto de Horarios</span>
                </ModalHeader>
                <ModalBody>
                    <div className="mb-4">
                        <p className="text-sm md:text-base text-foreground-600 mb-2">
                            No se puede agregar <span className="font-semibold text-primary">{conflictoInfo.cursoNuevo}</span>
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
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onPress={onClose}>
                        Entendido
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
