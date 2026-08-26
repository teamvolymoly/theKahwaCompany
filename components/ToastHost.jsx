"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X, XCircle } from "lucide-react";

const TOAST_STYLES = {
  default: { accent: "#303941", Icon: Info },
  info: { accent: "#4a83f3", Icon: Info },
  success: { accent: "#08c978", Icon: CheckCircle2 },
  error: { accent: "#f14b55", Icon: XCircle },
  warning: { accent: "#f4b400", Icon: AlertCircle },
};

export default function ToastHost() {
  const [toasts, setToasts] = useState([]);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    const handleToast = (event) => {
      const detail = event.detail || {};
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const toast = {
        id,
        message: detail.message || "Done",
        type: detail.type || "success",
        duration: Number.isFinite(detail.duration) ? detail.duration : 3000,
      };
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        dismissToast(id);
      }, toast.duration);
    };

    window.addEventListener("toast", handleToast);
    return () => window.removeEventListener("toast", handleToast);
  }, []);

  return (
    <div
      className="pointer-events-none fixed right-3 top-20 z-[60] flex w-[min(360px,calc(100vw-1.5rem))] flex-col gap-2 sm:right-5 sm:top-24"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => {
        const { accent, Icon } = TOAST_STYLES[toast.type] || TOAST_STYLES.default;

        return (
          <div
            key={toast.id}
            className="pointer-events-auto relative flex min-h-11 items-center gap-2 overflow-hidden rounded-md bg-white py-2 pl-3 pr-2 shadow-[0_5px_16px_rgba(22,32,39,0.16)]"
          >
            <span
              className="absolute inset-y-0 left-0 w-1"
              style={{ backgroundColor: accent }}
              aria-hidden="true"
            />
            <Icon
              className="h-4 w-4 shrink-0"
              style={{ color: accent }}
              aria-hidden="true"
            />
            <p className="min-w-0 flex-1 truncate text-base font-medium text-[#333b40]">
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="ml-0.5 grid h-5 w-5 shrink-0 place-items-center rounded text-[#96a0a5] hover:bg-black/5 hover:text-[#4d575d]"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
