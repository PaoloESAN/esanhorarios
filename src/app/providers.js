'use client'
import { useEffect } from 'react'
import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/next';

export function Providers({ children }) {
    useEffect(() => {
        // Suprimir warnings de hydration causados por React Aria IDs (cosmético, no afecta funcionalidad)
        const originalError = console.error;
        const originalWarn = console.warn;
        console.error = (...args) => {
            const msg = typeof args[0] === 'string' ? args[0] : '';
            if (msg.includes('A tree hydrated but some attributes') ||
                msg.includes('did not match') ||
                msg.includes('aria-') ||
                msg.includes('Hydration')) return;
            originalError.apply(console, args);
        };
        console.warn = (...args) => {
            const msg = typeof args[0] === 'string' ? args[0] : '';
            if (msg.includes('aria-') || msg.includes('Hydration')) return;
            originalWarn.apply(console, args);
        };
        return () => {
            console.error = originalError;
            console.warn = originalWarn;
        };
    }, []);

    return (
        <HeroUIProvider>
            <NextThemesProvider defaultTheme="system" attribute="class" enableSystem>
                {children}
                <Analytics />
            </NextThemesProvider>
        </HeroUIProvider>
    )
}