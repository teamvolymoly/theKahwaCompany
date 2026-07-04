"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const DISPLAY_DELAY = 1450;
const EXIT_DELAY = 500;

export default function SiteLoader() {
  const [status, setStatus] = useState("visible");

  useEffect(() => {
    const exitTimer = window.setTimeout(
      () => setStatus("exiting"),
      DISPLAY_DELAY,
    );

    const hiddenTimer = window.setTimeout(
      () => setStatus("hidden"),
      DISPLAY_DELAY + EXIT_DELAY,
    );

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hiddenTimer);
    };
  }, []);

  if (status === "hidden") return null;

  const isExiting = status === "exiting";

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#fbfaf5] transition-all duration-500 ${
        isExiting
          ? "pointer-events-none opacity-0 scale-105"
          : "opacity-100 scale-100"
      }`}
    >
      <div className="flex flex-col items-center">
        <Image
          src="/Logo_Animation_gif.gif"
          alt="The Kahwa Co. loading"
          width={180}
          height={180}
          priority
          unoptimized
          className="object-contain"
        />

        {/* Progress Line */}
        <div className="mt-6 h-[2px] w-36 overflow-hidden rounded-full bg-[#d8d8d8]">
          <div className="h-full w-1/2 bg-gradient-to-r from-[#6a716a] via-[#ffbf00] to-[#4e5a50] loader-progress" />
        </div>
      </div>

      <style jsx>{`
        .loader-progress {
          animation: loader-slide 1.15s ease-in-out infinite;
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
          .loader-progress {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
