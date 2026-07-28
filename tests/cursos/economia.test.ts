import { describe } from 'vitest';
import { generarTestCarrera } from '../utils/testGenerator';
import { contabilidad } from '../../src/data/contabilidad';
import { economia } from '../../src/data/economia';
import { economia_finanzas } from '../../src/data/economia_finanzas';
import { economia_pura } from '../../src/data/economia_pura';

describe('FACULTAD DE ECONOMÍA', () => {
    generarTestCarrera(contabilidad);
    generarTestCarrera(economia);
    generarTestCarrera(economia_finanzas);
    generarTestCarrera(economia_pura);
});
