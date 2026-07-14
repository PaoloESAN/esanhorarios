import { createFileRoute, notFound } from '@tanstack/react-router'
import { getCarrera } from "@/data"
import HorarioApp from "@/components/carrera/HorarioApp"

export const Route = createFileRoute('/$slug')({
  loader: ({ params }) => {
    const carrera = getCarrera(params.slug)
    if (!carrera) {
      throw notFound()
    }
    return { carrera }
  },
  component: CarreraPageRoute,
})

function CarreraPageRoute() {
  const { carrera } = Route.useLoaderData()
  return <HorarioApp carrera={carrera} />
}
