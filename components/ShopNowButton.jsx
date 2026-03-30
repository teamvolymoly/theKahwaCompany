"use client";

import React from "react";

export default function ShopNowButton({
  label = "Shop now",
  className = "",
  onClick,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`relative inline-flex min-w-[220px] items-center justify-center overflow-hidden rounded-sm px-10 py-3 text-center uppercase tracking-[0.35em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] ${className}`}
      style={{
        background:
          "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(170,180,175,0.95) 28%, rgba(140,155,150,0.95) 50%, rgba(170,180,175,0.95) 72%, rgba(255,255,255,0) 100%)",
      }}
    >
      <span
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 22%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.35) 78%, rgba(255,255,255,0) 100%)",
        }}
      />
      <span className="relative text-sm font-semibold">{label}</span>
    </button>
  );
}
