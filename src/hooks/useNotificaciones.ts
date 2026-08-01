"use client";

export interface ResultadoNotificacion {
    success: boolean;
    message: string;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function useNotificaciones() {
    const suscribir = async (): Promise<ResultadoNotificacion> => {
        const apiUrl = process.env.NEXT_PUBLIC_NOTIFICACIONES_URL?.replace(/\/+$/, "");

        if (!apiUrl) {
            return { success: false, message: "El servidor de notificaciones no está configurado (NEXT_PUBLIC_NOTIFICACIONES_URL)." };
        }
        if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
            return { success: false, message: "Tu navegador no soporta notificaciones push." };
        }

        try {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                return { success: false, message: "Permiso de notificaciones denegado. Actívalo desde la configuración del navegador." };
            }

            const registration = await navigator.serviceWorker.register("/sw.js");

            let subscription = await registration.pushManager.getSubscription();
            if (!subscription) {
                const keyRes = await fetch(`${apiUrl}/vapid-public-key`);
                if (!keyRes.ok) {
                    return { success: false, message: "No se pudo obtener la clave pública del servidor de notificaciones." };
                }
                const { publicKey } = await keyRes.json();
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicKey),
                });
            }

            const res = await fetch(`${apiUrl}/subscribe`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(subscription.toJSON()),
            });
            const result = await res.json();

            return result?.success
                ? { success: true, message: result.message || "Te avisaremos cuando haya novedades." }
                : { success: false, message: result?.message || "No se pudo completar la suscripción." };
        } catch (error) {
            console.error("Error al suscribirse a notificaciones:", error);
            return { success: false, message: "Ocurrió un error al intentar suscribirte." };
        }
    };

    return { suscribir };
}
