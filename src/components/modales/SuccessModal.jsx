import { Modal, ModalContent, ModalBody, ModalHeader, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { IconCheck } from '@/constants/icons';

export default function SuccessModal({ isOpen, onClose, mensaje }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" placement="center">
            <ModalContent>
                <ModalHeader className="flex gap-1 items-center">
                    <div className="bg-success-100 rounded-full p-2 mr-3">
                        <IconCheck className="w-5 h-5 md:w-6 md:h-6 text-success" />
                    </div>
                    <span className="text-foreground">¡Éxito!</span>
                </ModalHeader>
                <ModalBody>
                    <p className="text-sm md:text-base text-foreground-600">
                        {mensaje}
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onPress={onClose}>
                        Aceptar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
