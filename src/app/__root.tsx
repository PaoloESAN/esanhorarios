import {
    Link,
    Outlet,
    createRootRoute,
    HeadContent,
    Scripts,
} from "@tanstack/react-router"
// @ts-ignore
import appCss from "./globals.css?url"
import { Providers } from "./providers"

export const Route = createRootRoute({
    head: () => ({
        meta: [
            { charSet: "utf-8" },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            { title: "Horarios" }
        ],
        links: [
            {
                rel: 'stylesheet',
                href: appCss,
            },
        ],
    }),
    component: RootLayout,
    notFoundComponent: () => (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-background text-foreground text-center">
            <h2 className="text-3xl font-bold mb-2">404 - Página no encontrada</h2>
            <p className="text-muted mb-6">La página que buscas no existe o ha sido movida.</p>
            <Link to="/" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors">
                Volver al inicio
            </Link>
        </div>
    ),
})

function RootLayout() {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <HeadContent />
            </head>
            <body className="antialiased">
                <Providers>
                    <Outlet />
                </Providers>
                <Scripts />
            </body>
        </html>
    )
}