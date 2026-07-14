import { useEffect, ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/next';

export function Providers({ children }: { children: ReactNode }) {
    useEffect(() => {
        const originalError = console.error;
        const originalWarn = console.warn;
        console.error = (...args: any[]) => {
            const msg = typeof args[0] === 'string' ? args[0] : '';
            if (msg.includes('A tree hydrated but some attributes') ||
                msg.includes('did not match') ||
                msg.includes('aria-') ||
                msg.includes('Hydration')) return;
            originalError.apply(console, args);
        };
        console.warn = (...args: any[]) => {
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
        <NextThemesProvider defaultTheme="system" attribute="class" enableSystem>
            {children}
            <Analytics />
        </NextThemesProvider>
    );
}
