"use client";

import { useEffect, useState } from "react";

type Toast = {
  id: string;
  message: string;
};

export function ToastViewport() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    function onToast(event: Event) {
      const message = String((event as CustomEvent<string>).detail ?? "").trim();
      if (!message) return;
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setToasts((current) => [{ id, message }, ...current].slice(0, 3));
      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, 4500);
    }

    window.addEventListener("aura-toast", onToast);
    return () => window.removeEventListener("aura-toast", onToast);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[80] grid w-[min(92vw,420px)] gap-2" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className="rounded-md border border-ice/25 bg-black/90 p-4 text-sm text-slate-100 shadow-panel backdrop-blur-xl">
          {toast.message}
        </div>
      ))}
    </div>
  );
}
