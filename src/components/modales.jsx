import { Modal, ModalContent, ModalBody, ModalHeader, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";

export const ConflictModal = ({ isOpen, onClose, conflictoInfo }) => (
    <Modal isOpen={isOpen} onClose={onClose} size="md" placement="center">
        <ModalContent>
            <ModalHeader className="flex gap-1 items-center">
                <div className="bg-red-100 rounded-full p-2 mr-3">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.862-.833-2.632 0L4.182 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                Conflicto de Horarios
            </ModalHeader>
            <ModalBody>
                <div className="mb-4">
                    <p className="text-sm md:text-base text-gray-700 mb-2">
                        No se puede agregar <span className="font-semibold text-blue-600">{conflictoInfo.cursoNuevo}</span>
                        {' '}porque tiene conflicto de horarios con:
                    </p>
                    <p className="text-sm md:text-base font-semibold text-red-600">
                        {conflictoInfo.cursoExistente}
                    </p>
                </div>

                {conflictoInfo.detallesConflicto && (
                    <div className="mb-4 p-3 bg-red-50 rounded-lg">
                        <p className="text-xs md:text-sm font-medium text-red-800 mb-2">Horarios en conflicto:</p>
                        {conflictoInfo.detallesConflicto.map((conflicto, index) => (
                            <div key={index} className="text-xs md:text-sm text-red-700">
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

export const SuccessModal = ({ isOpen, onClose, mensaje }) => (
    <Modal isOpen={isOpen} onClose={onClose} size="md" placement="center">
        <ModalContent>
            <ModalHeader className="flex gap-1 items-center">
                <div className="bg-green-100 rounded-full p-2 mr-3">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                ¡Éxito!
            </ModalHeader>
            <ModalBody>
                <p className="text-sm md:text-base text-gray-700">
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

export const ErrorModal = ({ isOpen, onClose, mensaje }) => (
    <Modal isOpen={isOpen} onClose={onClose} size="md" placement="center">
        <ModalContent>
            <ModalHeader className="flex gap-1 items-center">
                <div className="bg-red-100 rounded-full p-2 mr-3">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                Error
            </ModalHeader>
            <ModalBody>
                <p className="text-sm md:text-base text-gray-700">
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

export const MatriculaModal = ({ isOpen, onClose, imagenMatricula, textosMatricula }) => (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" placement="center">
        <ModalContent>
            <ModalHeader className="flex gap-1 items-center">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                Información de Matrícula
            </ModalHeader>
            <ModalBody>
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-full text-center">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
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
