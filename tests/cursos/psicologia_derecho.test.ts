import { describe } from 'vitest';
import { generarTestCarrera } from '../utils/testGenerator';
import { derecho } from '../../src/data/derecho';
import { derecho_corporativo } from '../../src/data/derecho_corporativo';
import { psicologia } from '../../src/data/psicologia';

describe('FACULTAD DE PSICOLOGÍA Y DERECHO', () => {
    generarTestCarrera(derecho);
    generarTestCarrera(derecho_corporativo);
    generarTestCarrera(psicologia);
});
