import { getCarrera, getSlugs } from "@/data";
import { notFound } from "next/navigation";
import MallaApp from "@/components/malla/MallaApp";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
    return getSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const carrera = getCarrera(slug);
    if (!carrera) return { title: "Malla no encontrada" };
    return {
        title: `Malla Curricular - ${carrera.nombre}`,
        description: `Malla curricular interactiva y prerrequisitos para ${carrera.nombre}`,
    };
}

export default async function MallaPage({ params }: PageProps) {
    const { slug } = await params;
    const carrera = getCarrera(slug);
    if (!carrera) notFound();
    return <MallaApp carrera={carrera} />;
}
