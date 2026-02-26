import { Modal, ModalContent, ModalBody, ModalHeader, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { CircleCheck } from 'lucide-react';

export default function MatriculaModal({ isOpen, onClose, imagenMatricula, textosMatricula }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" placement="center">
            <ModalContent>
                <ModalHeader className="flex gap-1 items-center">
                    <div className="bg-primary-100 rounded-full p-2 mr-3">
                        <CircleCheck className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <span className="text-foreground">Información de Matrícula</span>
                </ModalHeader>
                <ModalBody>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-full text-center">
                            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4">
                                {textosMatricula[imagenMatricula]}
                            </h3>
                        </div>

                        <div className="w-full flex justify-center">
                            <img
                                src={`/increible${imagenMatricula}.png`}
                                alt={`Información de matrícula ${imagenMatricula}`}
                                className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                                onError={(e) => {
                                    e.target.src = `/increible${imagenMatricula}.jpg`;
                                    e.target.onerror = () => {
                                        e.target.src = '/increible1.png';
                                    };
                                }}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onPress={onClose}>
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
