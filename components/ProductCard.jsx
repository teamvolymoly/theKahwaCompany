"use client";

import Link from "next/link";
import { apiFetch } from "@/utils/api";

export default function ProductCard({ product }) {
  const slugOrId = product.slug || product.id;
  const rating = Number.isFinite(product.rating) ? product.rating : 4;
  const fullStars = Math.max(0, Math.min(5, Math.round(rating)));
  const handleAddToCart = async () => {
    try {
      await apiFetch("/cart", {
        method: "POST",
        body: JSON.stringify({
          variant_id: product.variants?.[0]?.id || 1,
          quantity: 1,
        }),
      });
      alert("Added to cart!");
    } catch (e) {
      alert("Please login first");
    }
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden pb-6 rounded-sm bg-[#fafafa] ">
      <div className="flex flex-1 flex-col p-6 pb-4 text-center">
        <Link
          href={`/product/${slugOrId}`}
          className="relative block overflow-hidden rounded-sm"
        >
          <div className="flex h-auto w-[70%] mx-auto items-center justify-center">
            <img
              src={
                product.images?.[0]?.image_url ||
                product.image ||
                "/products/W1.png"
              }
              alt={product.name}
              className="h-full w-full w-auto object-contain object-center transition duration-300 group-hover:scale-[1.04]"
            />
          </div>
        </Link>

        <div className="mt-4 flex items-center justify-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <svg
              key={`${product.id}-star-${index}`}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={index < fullStars ? "currentColor" : "none"}
              className={`h-4 w-4 ${index < fullStars ? "text-[#1c2230]" : "text-[#1c2230]/30"}`}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3.5l2.66 5.39 5.94.86-4.3 4.19 1.02 5.93L12 17.77l-5.32 2.8 1.02-5.93-4.3-4.19 5.94-.86L12 3.5z"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </svg>
          ))}
        </div>

        <h3
          className="mt-3 text-lg font-normal uppercase tracking-[0.05em] text-[#1c2230] "
          style={{ fontFamily: "var(--font-basker)" }}
        >
          {product.name}
        </h3>

        <div className="mt-4 flex items-center justify-center gap-3 text-sm text-[#1c2230]">
          <span className="font-semibold">
            ₹{product.variants?.[0]?.price || product.price}
          </span>
          {product.oldPrice && (
            <span className="text-[#1c2230]/40 line-through">
              ₹{product.oldPrice}
            </span>
          )}
          {product.badge && (
            <span className=" bg-[#FFF1C3] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#A78000]">
              {product.badge}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full bg-gradient-to-r from-[#7a8177] to-[#6a716a] py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:from-[#5f665e] hover:to-[#525a53]"
      >
        Add To Cart
      </button>
    </article>
  );
}
