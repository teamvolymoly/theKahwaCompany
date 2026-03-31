"use client";

import Link from "next/link";
import { apiFetch } from "@/utils/api";

export default function ProductCard({ product }) {
  const slugOrId = product.slug || product.id;
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
    <article className="group rounded-sm  bg-white p-5 transition hover:-translate-y-1 ">
      <Link
        href={`/product/${slugOrId}`}
        className="relative block overflow-hidden rounded-sm bg-[#f7f7f7] p-4"
      >
        {product.badge && (
          <span className="absolute left-0 top-0 rounded-md bg-[#FFBF00] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-black">
            {product.badge}
          </span>
        )}
        <div className="flex h-44 items-center justify-center">
          <img
            src={
              product.images?.[0]?.image_url ||
              product.image ||
              "/products/W1.png"
            }
            alt={product.name}
            className="h-40 w-auto object-contain transition duration-300 group-hover:scale-[1.04]"
          />
        </div>
      </Link>
      <div className="mt-4">
        <Link href={`/product/${slugOrId}`} className="inline-block">
          <h3 className="text-base font-semibold text-black line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 text-sm text-black/60 line-clamp-2">
          {product.short_description}
        </p>
        <div className="mt-3 flex items-center gap-3 text-sm text-black/70">
          <span className="font-semibold text-black">
            Rs.{product.variants?.[0]?.price || product.price}
          </span>
          {product.oldPrice && (
            <span className="line-through text-black/40">
              Rs.{product.oldPrice}
            </span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          className="mt-5 w-full rounded-full border border-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-black hover:text-white"
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}
