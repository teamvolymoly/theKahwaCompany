"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const DISPLAY_DELAY = 1900;
const COMPLETE_HOLD = 200;
const EXIT_DELAY = 450;

export default function SiteLoader() {
  const [status, setStatus] = useState("visible");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    let exitTimer;
    let hiddenTimer;

    const animationFrame = window.requestAnimationFrame(() => {
      setStarted(true);

      exitTimer = window.setTimeout(
        () => setStatus("exiting"),
        DISPLAY_DELAY + COMPLETE_HOLD,
      );

      hiddenTimer = window.setTimeout(() => {
        document.body.style.overflow = previousBodyOverflow;
        document.documentElement.style.overflow = previousRootOverflow;
        setStatus("hidden");
      }, DISPLAY_DELAY + COMPLETE_HOLD + EXIT_DELAY);
    });

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(exitTimer);
      clearTimeout(hiddenTimer);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
    };
  }, []);

  if (status === "hidden") return null;

  const isExiting = status === "exiting";

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#f4f6ef] transition-all duration-[450ms] ${
        isExiting
          ? "pointer-events-none opacity-0"
          : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
      aria-label="The Kahwa Co. is loading"
    >
      <div className="flex flex-col items-center">
        <span className="block h-[67px] w-[190px]">
          <Image
            src="/logo/LOGO_TKC-02 copy.svg"
            alt=""
            width={190}
            height={67}
            priority
            unoptimized
            className="h-full w-full object-contain"
            style={{
              filter:
                "brightness(0) saturate(100%) invert(23%) sepia(15%) saturate(1020%) hue-rotate(47deg) brightness(89%) contrast(88%)",
            }}
          />
        </span>

        <div
          className="mt-[18px] h-[3px] w-[188px] overflow-hidden rounded-full bg-[#cdd2c8]"
          aria-hidden="true"
        >
          <div
            className="loader-progress h-full w-full origin-left rounded-full bg-[#445538]"
            style={{
              transform: started ? "scaleX(1)" : "scaleX(0)",
              transition: started
                ? `transform ${DISPLAY_DELAY}ms linear`
                : "none",
            }}
          />
        </div>
      </div>

    </div>
  );
}
