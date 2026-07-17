import { useState, useEffect, useRef } from "react";
import { generarImagenHorario } from "@/lib/compartir";

export interface UseCompartirParams {
  horarioActivo: number;
  onAbrirModal?: () => void;
  setMensajeModal?: (msg: string) => void;
  onExito?: () => void;
  onError?: () => void;
}

const preloadHtml2Canvas = () => import("html2canvas-pro");

/**
 * Gestiona la generación, copia y descarga de la imagen del horario.
 */
export function useCompartir({
  horarioActivo,
  onAbrirModal,
  setMensajeModal,
  onExito,
  onError,
}: UseCompartirParams) {
  const [shareDataUrl, setShareDataUrl] = useState<string | null>(null);
  const [shareBlob, setShareBlob] = useState<Blob | null>(null);
  const [shareFilename, setShareFilename] = useState<string>("mi-horario.png");

  const abortControllerRef = useRef<AbortController | null>(null);
  const previewObjectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    preloadHtml2Canvas();
  }, []);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
      }
    };
  }, []);

  const limpiarPreview = () => {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }
    setShareDataUrl(null);
    setShareBlob(null);
  };

  const esperarRender = async () => {
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => resolve()),
    );
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => resolve()),
    );

    // En móvil (sobre todo build/prod) damos un pequeño margen adicional
    // para que estilos/variables queden estables antes de capturar.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches
    ) {
      await new Promise<void>((resolve) => setTimeout(resolve, 120));
    }
  };

  const detectarTemaReal = (): "dark" | "light" => {
    if (typeof document === "undefined") return "light";

    const html = document.documentElement;
    const dataTheme = html.getAttribute("data-theme");

    if (html.classList.contains("dark") || dataTheme === "dark") return "dark";
    if (dataTheme === "light") return "light";

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const abrirShareModal = async () => {
    const filename = `horario-${horarioActivo}.png`;
    setShareFilename(filename);

    abortControllerRef.current?.abort();
    limpiarPreview();

    onAbrirModal?.();

    // Dejamos que el modal pinte antes de capturar para evitar “congelón” visual.
    await esperarRender();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const temaActual = detectarTemaReal();
    const blob = await generarImagenHorario({
      tema: temaActual,
      isDark: temaActual === "dark",
      signal: controller.signal,
    });
    if (controller.signal.aborted || !blob) return;

    const previewUrl = URL.createObjectURL(blob);
    previewObjectUrlRef.current = previewUrl;
    setShareBlob(blob);
    setShareDataUrl(previewUrl);
  };

  const copiarImagen = async () => {
    if (!shareBlob) return;
    try {
      const pngBlob =
        shareBlob.type === "image/png"
          ? shareBlob
          : new Blob([await shareBlob.arrayBuffer()], { type: "image/png" });

      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new window.ClipboardItem({ "image/png": pngBlob }),
        ]);
        setMensajeModal?.("Imagen copiada al portapapeles.");
        onExito?.();
      } else {
        setMensajeModal?.(
          "Tu dispositivo no permite copiar la imagen directamente. Mantén presionada la imagen de arriba para copiarla.",
        );
        onError?.();
      }
    } catch (e) {
      console.error("Fallo al copiar la imagen", e);
      setMensajeModal?.(
        "Tu dispositivo no permite copiar la imagen directamente. Mantén presionada la imagen de arriba para copiarla.",
      );
      onError?.();
    }
  };

  const descargarImagen = () => {
    if (!shareBlob) return;

    const objectUrl = URL.createObjectURL(shareBlob);
    const link = document.createElement("a");
    link.download = shareFilename;
    link.href = objectUrl;
    link.click();

    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  };

  return {
    shareDataUrl,
    shareFilename,
    abrirShareModal,
    copiarImagen,
    descargarImagen,
  };
}
