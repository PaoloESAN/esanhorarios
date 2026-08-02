import { Metadata } from 'next';
import InternacionalApp from './InternacionalApp';

export const metadata: Metadata = {
    title: 'Electivos Internacionales - Horarios ESAN',
    description: 'Generador y planificador de horarios para Electivos Internacionales de ESAN.',
};

export default function InternacionalPage() {
    return <InternacionalApp />;
}
