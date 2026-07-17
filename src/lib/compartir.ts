export interface GenerarImagenParams {
  tema: string;
}

export interface CompartirHorarioParams {
  tema: string;
  filename?: string;
}

export const generarImagenHorario = async ({
  tema,
}: GenerarImagenParams): Promise<Blob | null> => {
  try {
    const { default: html2canvas } = await import("html2canvas-pro");

    const elemento = document.getElementById("tabla-horario");
    if (!elemento) {
      console.error("No se encontró el elemento del horario");
      return null;
    }

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const deviceMemory =
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;

    const baseWidth = Math.max(elemento.scrollWidth, 900);
    const exportWidth = Math.min(baseWidth, 1200);
    const scale = isMobile ? (deviceMemory <= 4 ? 1 : 1.25) : 2;

    const canvas = await html2canvas(elemento, {
      backgroundColor: tema === "dark" ? "#18181b" : "#ffffff",
      scale,
      useCORS: true,
      logging: false,
      windowWidth: exportWidth,
      width: exportWidth,
      scrollX: 0,
      scrollY: 0,
      imageSmoothing: true,
      imageSmoothingQuality: isMobile ? "medium" : "high",
      onclone: (documentClone) => {
        const tabla = documentClone.getElementById("tabla-horario");
        if (!tabla) return;

        tabla.style.overflow = "visible";
        tabla.style.width = `${exportWidth}px`;
        tabla.style.minWidth = `${exportWidth}px`;

        const tablaInterna = tabla.querySelector("table") as HTMLElement | null;
        if (tablaInterna) {
          tablaInterna.style.width = `${exportWidth}px`;
          tablaInterna.style.minWidth = `${exportWidth}px`;
        }

        const spansMobile = tabla.querySelectorAll(
          ".block.md\\:hidden",
        ) as NodeListOf<HTMLElement>;
        const spansDesktop = tabla.querySelectorAll(
          ".hidden.md\\:block",
        ) as NodeListOf<HTMLElement>;
        const textosSize = tabla.querySelectorAll(
          ".text-xs",
        ) as NodeListOf<HTMLElement>;

        spansMobile.forEach((el) => {
          el.style.display = "none";
        });
        spansDesktop.forEach((el) => {
          el.style.display = "block";
        });
        textosSize.forEach((el) => {
          el.style.fontSize = "0.875rem";
          el.style.lineHeight = "1.25rem";
        });
      },
    });

    const pngBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });

    return pngBlob;
  } catch (error) {
    console.error("Error al generar la imagen:", error);
    return null;
  }
};

export const compartirHorario = async ({
  tema,
  filename = "mi-horario.png",
}: CompartirHorarioParams): Promise<void> => {
  const imageBlob = await generarImagenHorario({ tema });
  if (!imageBlob) return;

  const objectUrl = URL.createObjectURL(imageBlob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = objectUrl;
  link.click();

  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
};
