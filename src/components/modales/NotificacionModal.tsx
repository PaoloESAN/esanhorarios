import { Modal, Button, Spinner } from "@heroui/react";
import { BellRing } from 'lucide-react';

export interface NotificacionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void;
    cargando?: boolean;
}

export default function NotificacionModal({ isOpen, onClose, onContinue, cargando = false }: NotificacionModalProps) {
    return (
        <Modal>
            <Modal.Trigger className="sr-only">
                <span />
            </Modal.Trigger>
            <Modal.Backdrop isOpen={isOpen} onOpenChange={(open: boolean) => !open && onClose?.()} isDismissable={false} isKeyboardDismissDisabled>
                <Modal.Container size="md" placement="center">
                    <Modal.Dialog>
                        <Modal.Header className="flex gap-1 items-center">
                            <div className="bg-primary-100 rounded-full p-2 mr-3">
                                <BellRing className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                            </div>
                            <Modal.Heading className="text-foreground">Notifícame</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            <p className="text-sm md:text-base text-foreground-600">
                                Se te notificará cuando se suba el excel de electivos y el de horarios.
                            </p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger-soft" onPress={onClose} isDisabled={cargando}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onPress={onContinue} isDisabled={cargando} isPending={cargando}>
                                {({ isPending }) => (isPending ? <Spinner color="current" size="sm" /> : 'Continuar')}
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
