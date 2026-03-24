"use client";

import React, { useEffect, useState } from "react";
import { Modal, Button, Input, TextField, Label, ColorArea, ColorField, ColorSlider, parseColor } from "@heroui/react";

function safeParseColor(value, fallback = "#fde68a") {
    try {
        return parseColor(value || fallback);
    } catch {
        return parseColor(fallback);
    }
}

function asHexColor(value, fallback = "#fde68a") {
    if (!value) return asHexColor(fallback, "#fde68a");
    if (typeof value === "string") {
        try {
            return parseColor(value).toString("hex");
        } catch {
            return asHexColor(fallback, "#fde68a");
        }
    }
    try {
        return value.toString("hex");
    } catch {
        return asHexColor(fallback, "#fde68a");
    }
}

function asCssColor(value, fallback = "#fde68a") {
    try {
        return value.toString("css");
    } catch {
        return fallback;
    }
}

function NoteColorPicker({ color, onChange, textColorChoice, onTextColorChange, previewText }) {

    return (
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex flex-col gap-3">
                <ColorArea
                    colorSpace="hsb"
                    xChannel="saturation"
                    yChannel="brightness"
                    value={color}
                    onChange={onChange}
                    className="h-[200px] w-full max-w-[220px] rounded sm:w-[200px] sm:shrink-0"
                >
                    <ColorArea.Thumb />
                </ColorArea>
                <ColorSlider
                    channel="hue"
                    colorSpace="hsb"
                    className="w-full max-w-[220px]"
                    value={color}
                    onChange={onChange}
                >
                    <ColorSlider.Track>
                        <ColorSlider.Thumb />
                    </ColorSlider.Track>
                </ColorSlider>

            </div>
            <div className="flex min-w-0 w-full flex-col gap-2 sm:w-[180px] sm:shrink-0">
                <ColorField
                    name="color"
                    value={color}
                    onChange={onChange}
                >
                    <ColorField.Group className="w-full rounded border border-divider bg-surface-secondary px-2 py-1">
                        <ColorField.Input className="w-full min-w-0 text-sm outline-none" />
                    </ColorField.Group>
                </ColorField>
                <div
                    className="h-12 rounded border border-divider flex items-center justify-center text-xs font-medium px-2 text-center w-full overflow-hidden break-words"
                    style={{ backgroundColor: asCssColor(color), color: textColorChoice || "#111827" }}
                    title={previewText || ""}
                >
                    {previewText}
                </div>
                <div className="mt-2 space-y-2">
                    <label className="text-xs text-foreground-500">Texto:</label>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className={`w-8 h-8 rounded border ${textColorChoice === "#000000" ? "ring-2 ring-accent" : "border-divider"} bg-black`}
                            title="Texto negro"
                            onClick={() => onTextColorChange?.("#000000")}
                        />
                        <button
                            type="button"
                            className={`w-8 h-8 rounded border ${textColorChoice === "#ffffff" ? "ring-2 ring-accent" : "border-divider"} bg-white`}
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
    const [color, setColor] = useState(() => safeParseColor(colorDefault || "#fde68a"));
    const [textColor, setTextColor] = useState(textColorDefault || "#111827");

    useEffect(() => {
        if (isOpen) {
            setTexto(textoDefault || "");
            setColor(safeParseColor(colorDefault || "#fde68a"));
            setTextColor(textColorDefault || "#111827");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, instanceKey]);

    const handleSave = () => {
        onSave?.({
            texto: (texto || "").trim(),
            color: asHexColor(color, colorDefault || "#fde68a"),
            textColor,
        });
    };

    return (
        <Modal key={`modal-${instanceKey || "nota"}`}>
            <Modal.Trigger className="sr-only">
                <span />
            </Modal.Trigger>
            <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose?.()}>
                <Modal.Container size="md" placement="center">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header className="flex gap-2 items-center">
                            <Modal.Heading>Texto para la celda</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body className="overflow-visible">
                            <div className="space-y-3 px-1 pt-1">
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
