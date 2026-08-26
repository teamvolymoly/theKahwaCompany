"use client";

import Image from "next/image";

export default function ShopNowButton({
  label = "Shop Now",
  className = "",
  onClick,
  type = "button",
}) {
  return (
    <div className="inline-flex flex-col items-center gap-5 sm:gap-8">
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
        className={`relative inline-flex min-w-[200px] items-center justify-center rounded-[5px] border-1 border-[#4e5a50] bg-white/10 px-7 py-2 text-center text-[#4e5a50] transition duration-200 hover:border-[#6B7F42] hover:bg-[#6B7F42] hover:text-white sm:min-w-[250px] sm:px-9 sm:py-2.5 ${className}`}
        style={{ fontFamily: "'Inter'" }}
      >
        <span className="text-[22px] font-normal leading-none tracking-[0.02em]">
          {label}
        </span>
      </button>
    </div>
  );
}
