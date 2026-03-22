"use client";

import React, { useEffect, useState } from "react";
import { Modal, Button, Input, TextField, Label } from "@heroui/react";
import { HexColorPicker, HexColorInput } from "react-colorful";

function NoteColorPicker({ color, onChange, textColorChoice, onTextColorChange, previewText }) {
    return (
        <div className="flex items-start gap-4">
            <HexColorPicker color={color} onChange={onChange} />
            <div className="flex flex-col gap-2 w-[180px] shrink-0">
                <HexColorInput
                    color={color}
                    onChange={onChange}
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
}

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
        <Modal key={`modal-${instanceKey || "nota"}`}>
            <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose?.()}>
                <Modal.Container size="md" placement="center">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header className="flex gap-2 items-center">
                            <Modal.Heading>Texto para la celda</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="space-y-3">
                                <div>
                                    <TextField key={`input-${instanceKey || "nota"}`} name="textoNota" type="text">
                                        <Label>Texto</Label>
                                        <Input
                                            value={texto}
                                            onChange={(event) => setTexto(event.target.value)}
                                            variant="secondary"
                                        />
                                    </TextField>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-foreground-500">Color de fondo</label>
                                    <NoteColorPicker
                                        color={color}
                                        onChange={setColor}
                                        textColorChoice={textColor}
                                        onTextColorChange={setTextColor}
                                        previewText={texto}
                                    />
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="tertiary" onPress={onClose}>Cancelar</Button>
                            <Button variant="primary" onPress={handleSave} isDisabled={!isOpen}>Guardar</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}

export default ModalNota;
