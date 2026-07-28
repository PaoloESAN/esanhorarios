import { describe } from 'vitest';
import { generarTestCarrera } from '../utils/testGenerator';
import { ambiental } from '../../src/data/ambiental';
import { ciencia_datos } from '../../src/data/ciencia_datos';
import { industrial } from '../../src/data/industrial';
import { software } from '../../src/data/software';
import { ti } from '../../src/data/ti';

describe('INGENIERÍA', () => {
    generarTestCarrera(ambiental);
    generarTestCarrera(ciencia_datos);
    generarTestCarrera(industrial);
    generarTestCarrera(software);
    generarTestCarrera(ti);
});
