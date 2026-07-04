"use client";

import Image from "next/image";

export default function ShopNowButton({
  label = "SHOP NOW",
  className = "",
  onClick,
  type = "button",
}) {
  return (
    <div className="inline-flex flex-col items-center gap-2 sm:gap-6">
      <Image
        src="/icons/Group_13.png"
        alt=""
        width={92}
        height={18}
        aria-hidden="true"
        className="pointer-events-none h-auto w-10 opacity-85 shop-drag-cue sm:w-[45px]"
      />

      <style jsx>{`
        :global(.shop-drag-cue) {
          animation: shop-drag-cue 1.45s ease-in-out infinite;
        }

        @keyframes shop-drag-cue {
          0%,
          100% {
            transform: translateX(-8px);
          }
          50% {
            transform: translateX(8px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(.shop-drag-cue) {
            animation: none;
          }
        }
      `}</style>

      <button
        type={type}
        onClick={onClick}
        className={`relative inline-flex min-w-[200px] items-center justify-center rounded-[5px] border-2 border-[#4e5a50] bg-white/10 px-7 py-1.5 text-center text-[#4e5a50] shadow-[0_8px_24px_rgba(78,90,80,0.08)] backdrop-blur-[1px] transition duration-200 hover:bg-[#4e5a50] hover:text-[#fbfaf5] hover:shadow-[0_10px_28px_rgba(78,90,80,0.16)] sm:min-w-[230px] sm:px-9 sm:py-2 ${className}`}
        style={{ fontFamily: "var(--font-basker)" }}
      >
        <span className="text-[22px] font-normal uppercase leading-none tracking-[0.02em] sm:text-[24px]">
          {label}
        </span>
      </button>
    </div>
  );
}
