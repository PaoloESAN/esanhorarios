import { test, expect } from '@playwright/test';

test.describe('Pruebas E2E de Rendimiento - Compartir Horario', () => {
    test('medir el tiempo desde el clic en Compartir Horario hasta el renderizado de la imagen en pantalla', async ({ page }) => {
        // Navegar a la página principal del proyecto
        await page.goto('/ti');

        // Asegurar que el elemento #tabla-horario esté listo en la página
        await page.waitForSelector('#tabla-horario');

        // Registrar tiempo inicial justo antes de hacer clic
        const inicio = performance.now();

        // Hacer clic en el botón de Compartir Horario
        const botonCompartir = page.getByRole('button', { name: /Compartir Horario/i }).first();
        await botonCompartir.click();

        // Esperar a que la imagen de la vista previa aparezca generada dentro del modal
        const imagenVistaPrevia = page.locator('img[alt="Previsualización del horario"]');
        await imagenVistaPrevia.waitFor({ state: 'visible' });

        // Registrar tiempo final y calcular duración
        const fin = performance.now();
        const duracionMs = fin - inicio;

        const reporteBenchmark = 
            `\n==================================================\n` +
            `[BENCHMARK PLAYWRIGHT - COMPARTIR HORARIO EN NAVEGADOR]\n` +
            `Tiempo real en Chrome desde clic hasta renderizado de la imagen: ${duracionMs.toFixed(2)} ms\n` +
            `==================================================\n\n`;

        process.stdout.write(reporteBenchmark);

        // Verificaciones
        await expect(imagenVistaPrevia).toBeVisible();
        const srcAttr = await imagenVistaPrevia.getAttribute('src');
        expect(srcAttr).toBeTruthy();
        expect(srcAttr?.startsWith('blob:')).toBe(true);
    });
});
