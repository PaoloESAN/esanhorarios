"use client";

import React, { useEffect, useState, memo } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { HexColorPicker, HexColorInput } from "react-colorful";

const NoteColorPicker = memo(function NoteColorPicker({ initialColor, onChange, textColorChoice, onTextColorChange, previewText }) {
    const [color, setColor] = useState(initialColor || "#fde68a");

    useEffect(() => {
        setColor(initialColor || "#fde68a");
    }, [initialColor]);

    const handleChange = (c) => {
        setColor(c);
        onChange?.(c);
    };

    return (
        <div className="flex items-start gap-4">
            <HexColorPicker color={color} onChange={handleChange} />
            <div className="flex flex-col gap-2 w-[180px] shrink-0">
                <HexColorInput
                    color={color}
                    onChange={handleChange}
                    prefixed
                    className="w-full text-sm rounded border border-divider bg-content1 p-2 outline-none focus:border-primary"
                />
                <div
                    className="h-12 rounded border border-divider flex items-center justify-center text-xs font-medium px-2 text-center w-full overflow-hidden break-words"
                    style={{ backgroundColor: color, color: textColorChoice || "#111827" }}
                    title={previewText || ""}
                >
                    {previewText}
                </div>
                <div className="mt-2 space-y-2">
                    <label className="text-xs text-foreground-500">Texto:</label>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className={`w-8 h-8 rounded border ${textColorChoice === "#000000" ? "ring-2 ring-primary" : "border-divider"} bg-black`}
                            title="Texto negro"
                            onClick={() => onTextColorChange?.("#000000")}
                        />
                        <button
                            type="button"
                            className={`w-8 h-8 rounded border ${textColorChoice === "#ffffff" ? "ring-2 ring-primary" : "border-divider"} bg-white`}
                            title="Texto blanco"
                            onClick={() => onTextColorChange?.("#ffffff")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

function ModalNota({
    isOpen,
    onClose,
    onSave,
    instanceKey,
    textoDefault = "",
    colorDefault = "#fde68a",
    textColorDefault = "#111827",
}) {
    const [texto, setTexto] = useState(textoDefault || "");
    const [color, setColor] = useState(colorDefault || "#fde68a");
    const [textColor, setTextColor] = useState(textColorDefault || "#111827");

    // Reinicia el estado al abrir o al cambiar de celda
    useEffect(() => {
        if (isOpen) {
            setTexto(textoDefault || "");
            setColor(colorDefault || "#fde68a");
            setTextColor(textColorDefault || "#111827");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, instanceKey]);

    const handleSave = () => {
        onSave?.({ texto: (texto || "").trim(), color, textColor });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" placement="center" key={`modal-${instanceKey || "nota"}`}>
            <ModalContent>
                <ModalHeader className="flex gap-2 items-center">Texto para la celda</ModalHeader>
                <ModalBody>
                    <div className="space-y-3">
                        <div>
                            <Input
                                key={`input-${instanceKey || "nota"}`}
                                label="Texto"
                                type="text"
                                value={texto}
                                onValueChange={(val) => setTexto(val)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-foreground-500">Color de fondo</label>
                            <NoteColorPicker
                                initialColor={color}
                                onChange={setColor}
                                textColorChoice={textColor}
                                onTextColorChange={setTextColor}
                                previewText={texto}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onClick={onClose}>Cancelar</Button>
                    <Button color="primary" onClick={handleSave} isDisabled={!isOpen}>Guardar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default memo(ModalNota);
