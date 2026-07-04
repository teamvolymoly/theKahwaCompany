"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const DISPLAY_DELAY = 1450;
const EXIT_DELAY = 500;

export default function SiteLoader() {
  const [status, setStatus] = useState("visible");

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setStatus("exiting"), DISPLAY_DELAY);
    const hiddenTimer = window.setTimeout(
      () => setStatus("hidden"),
      DISPLAY_DELAY + EXIT_DELAY,
    );

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hiddenTimer);
    };
  }, []);

  if (status === "hidden") return null;

  const isExiting = status === "exiting";

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#fbfaf5] transition-all duration-500 ${
        isExiting
          ? "pointer-events-none scale-[1.03] opacity-0 blur-sm"
          : "scale-100 opacity-100 blur-0"
      }`}
      aria-hidden={isExiting}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,191,0,0.16),transparent_34%),linear-gradient(135deg,rgba(122,129,119,0.12),transparent_42%,rgba(28,34,48,0.06))]" />
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#6a716a]/15 loader-ring sm:h-80 sm:w-80" />
      <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ffbf00]/25 loader-ring loader-ring-delay sm:h-56 sm:w-56" />

      <div className="relative flex flex-col items-center">
        <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-white/70 shadow-[0_20px_70px_rgba(28,34,48,0.12)] ring-1 ring-[#6a716a]/10 backdrop-blur sm:h-44 sm:w-44">
          <div className="absolute inset-3 rounded-full border border-[#ffbf00]/20 loader-orbit" />
          <Image
            src="/Logo_Animation_gif.gif"
            alt="The Kahwa Co. loading"
            width={176}
            height={176}
            priority
            unoptimized
            className="relative h-[82%] w-[82%] object-contain loader-logo"
          />
        </div>

        <div className="mt-7 h-[2px] w-36 overflow-hidden rounded-full bg-[#6a716a]/15">
          <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#6a716a] via-[#ffbf00] to-[#4e5a50] loader-progress" />
        </div>

        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#4e5a50]">
          The Kahwa Co.
        </p>
      </div>

      <style jsx>{`
        .loader-logo {
          animation: loader-breathe 1.4s ease-in-out infinite;
        }

        .loader-ring {
          animation: loader-expand 1.8s ease-in-out infinite;
        }

        .loader-ring-delay {
          animation-delay: 0.35s;
        }

        .loader-orbit {
          animation: loader-spin 2.4s linear infinite;
          border-top-color: rgba(78, 90, 80, 0.55);
        }

        .loader-progress {
          animation: loader-slide 1.15s ease-in-out infinite;
        }

        @keyframes loader-breathe {
          0%,
          100% {
            transform: scale(0.96);
          }
          50% {
            transform: scale(1.04);
          }
        }

        @keyframes loader-expand {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.72);
          }
          45% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.08);
          }
        }

        @keyframes loader-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes loader-slide {
          0% {
            transform: translateX(-110%);
          }
          100% {
            transform: translateX(230%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .loader-logo,
          .loader-ring,
          .loader-orbit,
          .loader-progress {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
