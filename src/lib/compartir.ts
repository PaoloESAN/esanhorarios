export interface GenerarImagenParams {
  tema: "dark" | "light";
  signal?: AbortSignal;
  isDark?: boolean;
}

export interface CompartirHorarioParams {
  tema: "dark" | "light";
  filename?: string;
}

const toPngBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> =>
  new Promise((resolve) => canvas.toBlob(resolve, "image/png"));

const aplanarConFondo = (
  source: HTMLCanvasElement,
  fondo: string,
): HTMLCanvasElement => {
  const out = document.createElement("canvas");
  out.width = source.width;
  out.height = source.height;

  const ctx = out.getContext("2d");
  if (!ctx) return source;

  ctx.fillStyle = fondo;
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(source, 0, 0);

  return out;
};

const esperarRecursos = async (elemento: HTMLElement): Promise<void> => {
  const fontSet = (
    document as Document & { fonts?: { ready?: Promise<unknown> } }
  ).fonts;
  if (fontSet?.ready) {
    try {
      await fontSet.ready;
    } catch {
      // no-op
    }
  }

  const imagenes = Array.from(elemento.querySelectorAll("img"));
  if (imagenes.length === 0) return;

  await Promise.allSettled(
    imagenes.map(async (img) => {
      if (img.complete && img.naturalWidth > 0) return;
      if (typeof img.decode === "function") {
        await img.decode();
        return;
      }
      await new Promise<void>((resolve) => {
        const cleanup = () => {
          img.removeEventListener("load", cleanup);
          img.removeEventListener("error", cleanup);
          resolve();
        };
        img.addEventListener("load", cleanup, { once: true });
        img.addEventListener("error", cleanup, { once: true });
      });
    }),
  );
};

const esMobile = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 767px)").matches;

const calcularEscalaOptima = (width: number, height: number): number => {
  // En móvil priorizamos estabilidad/memoria.
  if (esMobile()) return 1;

  const dpr = window.devicePixelRatio || 1;
  const megapixeles = (width * height) / 1_000_000;

  // Reducimos agresivamente en capturas grandes para mantener fluidez
  if (megapixeles >= 2) return Math.min(dpr, 1);
  if (megapixeles >= 1.2) return Math.min(dpr, 1.25);
  return Math.min(dpr, 1.5);
};

const obtenerPaletaCaptura = (tema: "dark" | "light") => {
  if (tema === "dark") {
    return {
      rootBg: "#18181b",
      border: "#3f3f46",
      text: "#e4e4e7",
    };
  }

  return {
    rootBg: "#ffffff",
    border: "#d4d4d8",
    text: "#18181b",
  };
};

const MOBILE_STYLE_PROPS = [
  "display",
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "width",
  "height",
  "min-width",
  "min-height",
  "max-width",
  "max-height",
  "overflow",
  "box-sizing",
  "padding",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "margin",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "border",
  "border-top",
  "border-right",
  "border-bottom",
  "border-left",
  "border-color",
  "border-radius",
  "background",
  "background-color",
  "opacity",
  "color",
  "font",
  "font-size",
  "font-weight",
  "line-height",
  "letter-spacing",
  "text-align",
  "text-transform",
  "white-space",
  "word-break",
  "transform",
] as const;

const copiarEstilosClave = (from: HTMLElement, to: HTMLElement) => {
  const computed = window.getComputedStyle(from);
  for (const prop of MOBILE_STYLE_PROPS) {
    to.style.setProperty(prop, computed.getPropertyValue(prop));
  }
};

const crearClonMovilConEstilosInline = (
  elemento: HTMLElement,
  width: number,
): HTMLElement => {
  const clon = elemento.cloneNode(true) as HTMLElement;

  const sourceNodes = [
    elemento,
    ...Array.from(elemento.querySelectorAll("*")),
  ] as HTMLElement[];
  const targetNodes = [
    clon,
    ...Array.from(clon.querySelectorAll("*")),
  ] as HTMLElement[];

  for (let i = 0; i < sourceNodes.length; i++) {
    const s = sourceNodes[i];
    const t = targetNodes[i];
    if (!s || !t) continue;
    copiarEstilosClave(s, t);
  }

  Object.assign(clon.style, {
    position: "fixed",
    top: "0",
    left: "-100000px",
    width: `${width}px`,
    minWidth: `${width}px`,
    overflow: "visible",
    pointerEvents: "none",
    zIndex: "-1",
  });

  document.body.appendChild(clon);
  return clon;
};

export const generarImagenHorario = async ({
  tema,
  signal,
  isDark,
}: GenerarImagenParams): Promise<Blob | null> => {
  try {
    const { default: html2canvas } = await import("html2canvas-pro");

    const elemento = document.getElementById("tabla-horario");
    if (!elemento) {
      console.error("No se encontró el elemento del horario");
      return null;
    }

    await esperarRecursos(elemento as HTMLElement);

    const tablaInternaOriginal = elemento.querySelector(
      "table",
    ) as HTMLElement | null;
    const width = Math.max(
      1,
      Math.ceil(
        Math.max(
          tablaInternaOriginal?.scrollWidth ?? 0,
          tablaInternaOriginal?.getBoundingClientRect().width ?? 0,
          elemento.scrollWidth,
          elemento.getBoundingClientRect().width,
        ),
      ),
    );

    const height = Math.max(
      1,
      Math.ceil(
        Math.max(
          tablaInternaOriginal?.scrollHeight ?? 0,
          tablaInternaOriginal?.getBoundingClientRect().height ?? 0,
          elemento.scrollHeight,
          elemento.getBoundingClientRect().height,
        ),
      ),
    );
    const scale = calcularEscalaOptima(width, height);
    const paleta = obtenerPaletaCaptura(tema);

    const usarInlineMobile = esMobile();
    let objetivo = elemento as HTMLElement;

    if (usarInlineMobile) {
      objetivo = crearClonMovilConEstilosInline(elemento as HTMLElement, width);
    }

    try {
      const canvas = await html2canvas(objetivo, {
        backgroundColor: tema === "dark" ? "#18181b" : "#ffffff",
        scale,
        useCORS: true,
        logging: false,
        width,
        height,
        windowWidth: width,
        windowHeight: Math.max(window.innerHeight, height),
        imageTimeout: 10000,
        signal,
        foreignObjectRendering: false,
        onclone: (documentClone) => {
          const docEl = documentClone.documentElement;
          const shouldUseDark =
            typeof isDark === "boolean" ? isDark : tema === "dark";

          if (shouldUseDark) {
            docEl.classList.add("dark");
            docEl.setAttribute("data-theme", "dark");
          } else {
            docEl.classList.remove("dark");
            docEl.setAttribute("data-theme", "light");
          }

          const style = documentClone.createElement("style");
          style.textContent = `
            *{animation:none !important;transition:none !important;}
            .block.md\\:hidden{display:none !important;}
            .hidden.md\\:block{display:block !important;}
            #tabla-horario .text-xs{font-size:0.875rem !important;line-height:1.25rem !important;}
            #tabla-horario{background:${paleta.rootBg} !important;color:${paleta.text} !important;}
            #tabla-horario > table{border-collapse:collapse !important;}
            #tabla-horario > table > thead > tr > th,
            #tabla-horario > table > tbody > tr > td{border-color:${paleta.border} !important;}
          `;
          documentClone.head.appendChild(style);

          const tabla = documentClone.getElementById("tabla-horario");
          if (tabla) {
            (tabla as HTMLElement).style.overflow = "visible";
            (tabla as HTMLElement).style.width = `${width}px`;
            (tabla as HTMLElement).style.minWidth = `${width}px`;

            const tablaInterna = tabla.querySelector("table");
            if (tablaInterna) {
              tablaInterna.classList.remove(
                "min-w-[640px]",
                "md:min-w-[900px]",
              );
              (tablaInterna as HTMLElement).style.width = `${width}px`;
              (tablaInterna as HTMLElement).style.minWidth = `${width}px`;
            }
          }
        },
      });

      const canvasPlano = aplanarConFondo(
        canvas,
        tema === "dark" ? "#18181b" : "#ffffff",
      );

      return await toPngBlob(canvasPlano);
    } finally {
      if (usarInlineMobile && objetivo.parentNode) {
        objetivo.parentNode.removeChild(objetivo);
      }
    }
  } catch (error) {
    console.error("Error al generar la imagen:", error);
    return null;
  }
};

export const compartirHorario = async ({
  tema,
  filename = "mi-horario.png",
}: CompartirHorarioParams): Promise<void> => {
  const blob = await generarImagenHorario({ tema });
  if (!blob) return;

  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = objectUrl;
  link.click();

  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
};
