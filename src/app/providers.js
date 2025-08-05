'use client'
import { useEffect, useState } from 'react'
import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function Providers({ children }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <HeroUIProvider>
                {children}
            </HeroUIProvider>
        )
    }

    return (
        <HeroUIProvider>
            <NextThemesProvider defaultTheme="system" attribute="class" enableSystem>
                {children}
            </NextThemesProvider>
        </HeroUIProvider>
    )
}