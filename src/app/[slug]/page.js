import { getCarrera, getSlugs } from "@/data";
import { notFound } from "next/navigation";
import HorarioApp from "./HorarioApp";

export function generateStaticParams() {
    return getSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const carrera = getCarrera(slug);
    if (!carrera) return { title: "No encontrado" };
    return {
        title: `Horarios - ${carrera.nombre}`,
        description: `Creador de horarios para ${carrera.nombre}`,
    };
}

export default async function CarreraPage({ params }) {
    const { slug } = await params;
    const carrera = getCarrera(slug);
    if (!carrera) notFound();
    return <HorarioApp carrera={carrera} />;
}
