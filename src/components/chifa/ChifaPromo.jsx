"use client";

import { useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { TriangleAlert, Skull } from 'lucide-react';
import { useConfigHorario } from "@/hooks/useConfigHorario";

/**
 * Componente promocional de Chifa la Unión.
 * Flujo: Botón → Modal "¿Estás seguro?" → Modal "¿De verdad seguro?" → Pantalla de selección.
 * El usuario elige entre Chi Jau Kay y Ti Pa Kay y eso cambia el fondo de la tabla.
 */
export default function ChifaPromo() {
    const { actualizarConfig } = useConfigHorario();

    // Etapas del flujo
    const [paso, setPaso] = useState(0);
    // 0 = nada abierto
    // 1 = primer modal "¿Estás seguro?"
    // 2 = segundo modal "¿De verdad estás seguro?"
    // 3 = pantalla de selección

    const iniciarFlujo = () => setPaso(1);
    const cerrar = () => setPaso(0);

    const aceptarPrimero = () => setPaso(2);
    const aceptarSegundo = () => setPaso(3);

    const seleccionar = (tipo) => {
        // tipo: 'chijaukay' o 'tipakay'
        if (tipo === "chijaukay") {
            actualizarConfig({
                fondoChiJauKay: true,
                fondoTiPaKay: false,
                chijaukayDesbloqueado: true,
            });
        } else {
            actualizarConfig({
                fondoTiPaKay: true,
                fondoChiJauKay: false,
                tipakayDesbloqueado: true,
            });
        }
        setPaso(0);
    };

    return (
        <>
            {/* Botón principal */}
            <div className="flex justify-center mt-4 mb-2">
                <Button
                    id="btn-chifa-promo"
                    color="warning"
                    variant="shadow"
                    size="lg"
                    className="font-bold text-white hover:scale-105 transition-transform shadow-lg"
                    onPress={iniciarFlujo}
                >
                    ???
                </Button>
            </div>

            {/* ═══ MODAL 1 — ¿Estás seguro? ═══ */}
            <Modal isOpen={paso === 1} onClose={cerrar} size="md" placement="center">
                <ModalContent>
                    <ModalHeader className="flex gap-1 items-center">
                        <div className="bg-warning-100 rounded-full p-2 mr-3">
                            <TriangleAlert className="w-5 h-5 md:w-6 md:h-6 text-warning" />
                        </div>
                        <span className="text-foreground">¿Estás seguro?</span>
                    </ModalHeader>
                    <ModalBody>
                        <p className="text-sm md:text-base text-foreground-600">
                            Estás a punto de descubrir algo increíble... ¿Deseas continuar?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={cerrar}>
                            No, mejor no
                        </Button>
                        <Button color="warning" onPress={aceptarPrimero}>
                            Sí, continuar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* ═══ MODAL 2 — ¿De verdad estás seguro? ═══ */}
            <Modal isOpen={paso === 2} onClose={cerrar} size="md" placement="center">
                <ModalContent>
                    <ModalHeader className="flex gap-1 items-center">
                        <div className="bg-danger-100 rounded-full p-2 mr-3">
                            <Skull className="w-5 h-5 md:w-6 md:h-6 text-danger" />
                        </div>
                        <span className="text-foreground">¿DE VERDAD estás seguro?</span>
                    </ModalHeader>
                    <ModalBody>
                        <p className="text-sm md:text-base text-foreground-600">
                            No hay vuelta atrás... ¿Realmente estás seguro de lo que estás haciendo?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={cerrar}>
                            Mejor me arrepiento
                        </Button>
                        <Button color="danger" onPress={aceptarSegundo}>
                            ¡SÍ, ESTOY SEGURO!
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* ═══ MODAL 3 — Pantalla de selección de chaufa ═══ */}
            <Modal
                isOpen={paso === 3}
                onClose={cerrar}
                placement="center"
                backdrop="blur"
                size="5xl"
                classNames={{
                    base: "border-2 border-amber-400/50 bg-gradient-to-b from-gray-900 to-gray-950",
                    closeButton: "text-white hover:bg-white/10",
                }}
                isDismissable={false}
            >
                <ModalContent>
                    <ModalBody className="p-0 overflow-hidden">
                        {/* Título */}
                        <div className="text-center pt-6 pb-4 px-4">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 drop-shadow-lg">
                                Chifa la Union te regala un chaufa
                            </h2>
                            <p className="text-amber-300/80 text-base md:text-lg mt-2 font-medium">
                                Elige tu favorito
                            </p>
                        </div>

                        {/* Contenedor de las dos opciones */}
                        <div className="flex flex-col md:flex-row w-full min-h-[350px] md:min-h-[450px]">
                            {/* ── Chi Jau Kay (izquierda) ── */}
                            <button
                                id="btn-chijaukay"
                                className="group relative flex-1 cursor-pointer overflow-hidden transition-all duration-300 hover:flex-[1.15] border-r border-amber-400/20"
                                onClick={() => seleccionar("chijaukay")}
                            >
                                <img
                                    src="/chaufachijaukay.jpg"
                                    alt="Chaufa Chi Jau Kay"
                                    className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
                                <div className="relative z-10 flex flex-col items-center justify-end h-full pb-8 px-4">
                                    <span className="text-xl md:text-2xl font-extrabold text-white drop-shadow-lg tracking-wide group-hover:scale-110 transition-transform duration-300">
                                        Chi Jau Kay
                                    </span>
                                </div>
                            </button>

                            {/* ── Ti Pa Kay (derecha) ── */}
                            <button
                                id="btn-tipakay"
                                className="group relative flex-1 cursor-pointer overflow-hidden transition-all duration-300 hover:flex-[1.15]"
                                onClick={() => seleccionar("tipakay")}
                            >
                                <img
                                    src="/chaufatipakay.jpg"
                                    alt="Chaufa Ti Pa Kay"
                                    className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
                                <div className="relative z-10 flex flex-col items-center justify-end h-full pb-8 px-4">
                                    <span className="text-xl md:text-2xl font-extrabold text-white drop-shadow-lg tracking-wide group-hover:scale-110 transition-transform duration-300">
                                        Ti Pa Kay
                                    </span>
                                </div>
                            </button>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
