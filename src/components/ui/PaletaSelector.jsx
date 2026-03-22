"use client";

import { Select, SelectItem } from '@heroui/react';
import { PALETAS_NOMBRES, PALETA_PREVIEW_COLORS } from '@/constants';

const PALETAS = Object.entries(PALETAS_NOMBRES).map(([key, nombre]) => ({ key, nombre }));

function PaletaSelector({ paletaSeleccionada, coloresActuales, onChange, size = 'sm', className = '' }) {
    const preview = PALETA_PREVIEW_COLORS[paletaSeleccionada] ?? PALETA_PREVIEW_COLORS.default;

    const handleChange = (keys) => {
        const selected = Array.from(keys)[0];
        if (selected && selected !== paletaSeleccionada) onChange(selected);
    };

    return (
        <Select
            placeholder="Selecciona paleta"
            selectedKeys={[paletaSeleccionada]}
            onSelectionChange={handleChange}
            aria-label="Selecciona paleta de colores"
            size={size}
            variant="bordered"
            className={className}
            classNames={{
                trigger: 'border border-divider shadow-sm',
                listboxWrapper: 'max-h-60',
            }}
            disallowEmptySelection
            renderValue={() => (
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        {(coloresActuales?.slice(0, 3) ?? []).map((c, i) => (
                            <div key={i} className={`w-3 h-3 rounded-full ${c.bg}`} />
                        ))}
                    </div>
                    <span className="text-sm">{PALETAS_NOMBRES[paletaSeleccionada] ?? 'Selecciona paleta'}</span>
                </div>
            )}
        >
            {PALETAS.map(({ key, nombre }) => {
                const colors = PALETA_PREVIEW_COLORS[key];
                return (
                    <SelectItem key={key} value={key} textValue={key}>
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                {colors.map((bg, i) => (
                                    <div key={i} className={`w-3 h-3 rounded-full ${bg}`} />
                                ))}
                            </div>
                            <span>{nombre}</span>
                        </div>
                    </SelectItem>
                );
            })}
        </Select>
    );
}

export default PaletaSelector;
