import { Modal, Button } from "@heroui/react";
import { Check } from 'lucide-react';

export default function SuccessModal({ isOpen, onClose, mensaje }) {
    return (
        <Modal>
            <Modal.Trigger className="sr-only">
                <span />
            </Modal.Trigger>
            <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose?.()}>
                <Modal.Container size="md" placement="center">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header className="flex gap-1 items-center">
                            <div className="bg-success-100 rounded-full p-2 mr-3">
                                <Check className="w-5 h-5 md:w-6 md:h-6 text-success" />
                            </div>
                            <Modal.Heading className="text-foreground">¡Éxito!</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            <p className="text-sm md:text-base text-foreground-600">
                                {mensaje}
                            </p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onPress={onClose}>
                                Aceptar
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
