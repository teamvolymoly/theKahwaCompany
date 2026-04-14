"use client";

import { useEffect, useState } from "react";

export default function ToastHost() {
  const [toasts, setToasts] = useState([]);

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
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, toast.duration);
    };

    window.addEventListener("toast", handleToast);
    return () => window.removeEventListener("toast", handleToast);
  }, []);

  return (
    <div className="fixed right-4 top-6 z-[60] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-sm border px-4 py-3 text-sm shadow-lg transition ${
            toast.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-black/10 bg-white text-black"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
