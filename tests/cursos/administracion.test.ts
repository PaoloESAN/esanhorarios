import { describe } from 'vitest';
import { generarTestCarrera } from '../utils/testGenerator';
import { adm_finanzas } from '../../src/data/adm_finanzas';
import { adm_marketing } from '../../src/data/adm_marketing';
import { adm_negocios } from '../../src/data/adm_negocios';
import { administracion } from '../../src/data/administracion';
import { comunicacion_mkt } from '../../src/data/comunicacion_mkt';

describe('FACULTAD DE ADMINISTRACIÓN', () => {
    generarTestCarrera(adm_finanzas);
    generarTestCarrera(adm_marketing);
    generarTestCarrera(adm_negocios);
    generarTestCarrera(administracion);
    generarTestCarrera(comunicacion_mkt);
});
