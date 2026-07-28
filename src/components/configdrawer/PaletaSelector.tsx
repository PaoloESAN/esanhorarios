"use client";

import { Select, Label, ListBox } from '@heroui/react';
import { PALETAS_NOMBRES, PALETA_PREVIEW_COLORS } from '@/constants';
import { ColorCelda } from '@/lib/colores';

const PALETAS = Object.entries(PALETAS_NOMBRES).map(([key, nombre]) => ({ key, nombre }));

export interface PaletaSelectorProps {
    paletaSeleccionada: string;
    coloresActuales: ColorCelda[];
    onChange: (nuevaPaleta: string) => void;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

function PaletaSelector({ paletaSeleccionada, coloresActuales, onChange, size = 'sm', className = '' }: PaletaSelectorProps) {

    const handleChange = (selected: any) => {
        if (selected && selected !== paletaSeleccionada) onChange(selected);
    };

    return (
        <Select
            placeholder="Selecciona paleta"
            value={paletaSeleccionada}
            onChange={handleChange}
            aria-label="Selecciona paleta de colores"
            className={className}
            variant='secondary'
        >
            <Select.Trigger className={`border border-divider shadow-sm ${size === 'sm' ? 'min-h-9' : ''}`}>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Select.Value className="truncate" />
                </div>
                <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
                <ListBox className="max-h-60">
                    {PALETAS.map(({ key, nombre }) => {
                        const colors = PALETA_PREVIEW_COLORS[key] ?? [];
                        return (
                            <ListBox.Item key={key} id={key} textValue={nombre}>
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                        {colors.map((bg, i) => (
                                            <div key={i} className={`w-3 h-3 rounded-full ${bg}`} />
                                        ))}
                                    </div>
                                    <span>{nombre}</span>
                                </div>
                                <ListBox.ItemIndicator />
                            </ListBox.Item>
                        );
                    })}
                </ListBox>
            </Select.Popover>
        </Select>
    );
}

export default PaletaSelector;
