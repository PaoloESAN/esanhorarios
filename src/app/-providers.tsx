import { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
            < Analytics />
        </>
    );
}
