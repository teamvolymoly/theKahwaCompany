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
    <article className="group rounded-sm  bg-white p-5 transition hover:-translate-y-1 flex flex-col justify-between">
      <Link
        href={`/product/${slugOrId}`}
        className="relative block overflow-hidden rounded-sm"
      >
        {product.badge && (
          <span className="absolute left-0 top-0 rounded-md bg-[#FFBF00] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-black">
            {product.badge}
          </span>
        )}
        <div className="flex h-70 items-center justify-center">
          <img
            src={
              product.images?.[0]?.image_url ||
              product.image ||
              "/products/W1.png"
            }
            alt={product.name}
            className="h-full w-auto object-contain object-center transition duration-300 group-hover:scale-[1.04]"
          />
        </div>
        <h3 className="text-base font-semibold text-black line-clamp-2">
          {product.name}
        </h3>
      </Link>
      <div className="mt-4 relative">
        {/* <Link href={`/product/${slugOrId}`} className="inline-block">
          <h3 className="text-base font-semibold text-black line-clamp-2">
            {product.name}
          </h3>
        </Link> */}
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
          className="absolute bottom-2 right-4 rounded-full px-1 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-black transition bg-[#5A6F61]/20 hover:bg-[#5A6F61] hover:text-white"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-auto text-black transition hover:text-white"
          >
            <path
              d="M23.2143 17.2368V12.8158C23.2143 10.9845 21.7752 9.5 20 9.5C18.2248 9.5 16.7857 10.9845 16.7857 12.8158V17.2368M14.1071 13.9211H25.8929C26.7805 13.9211 27.5 14.6633 27.5 15.5789V28.8421C27.5 29.7577 26.7805 30.5 25.8929 30.5H14.1071C13.2195 30.5 12.5 29.7577 12.5 28.8421V15.5789C12.5 14.6633 13.2195 13.9211 14.1071 13.9211Z"
              stroke="currentColor"
              strokeWidth="1.58333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </article>
  );
}
