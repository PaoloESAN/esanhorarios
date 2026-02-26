import { Modal, ModalContent, ModalBody, ModalHeader, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { X } from 'lucide-react';

export default function ErrorModal({ isOpen, onClose, mensaje }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" placement="center">
            <ModalContent>
                <ModalHeader className="flex gap-1 items-center">
                    <div className="bg-danger-100 rounded-full p-2 mr-3">
                        <X className="w-5 h-5 md:w-6 md:h-6 text-danger" />
                    </div>
                    <span className="text-foreground">Error</span>
                </ModalHeader>
                <ModalBody>
                    <p className="text-sm md:text-base text-foreground-600">
                        {mensaje}
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onPress={onClose}>
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
