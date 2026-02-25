'use client'
import { useEffect } from 'react'
import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function Providers({ children }) {
    useEffect(() => {
        // Suprimir warnings de hydration causados por React Aria IDs (cosmético, no afecta funcionalidad)
        const originalError = console.error;
        console.error = (...args) => {
            if (typeof args[0] === 'string' && args[0].includes('A tree hydrated but some attributes')) return;
            originalError.apply(console, args);
        };
        return () => { console.error = originalError; };
    }, []);

    return (
        <HeroUIProvider>
            <NextThemesProvider defaultTheme="system" attribute="class" enableSystem>
                {children}
            </NextThemesProvider>
        </HeroUIProvider>
    )
}