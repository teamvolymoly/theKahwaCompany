"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/utils/api";

export default function ProductCard({ product, variant = "default" }) {
  const router = useRouter();
  const isHomepage = variant === "homepage";
  const slugOrId = product.slug || product.id;
  const rawRating = Number(product.rating);
  const rating = Number.isFinite(rawRating) ? rawRating : 0;
  const ratingCount = Number(
    product.rating_count ?? product.review_count ?? product.total_reviews ?? 0,
  );
  const fullStars = Math.max(0, Math.min(5, Math.round(rating)));
  const isAvailable = product.in_stock !== false && product.status !== false;
  const hoverFallbacks = [
    "/products/packets/11.png",
    "/products/packets/12.png",
    "/products/packets/13.png",
    "/products/packets/14.png",
    "/products/packets/15.png",
    "/products/packets/16.png",
    "/products/packets/17.png",
    "/products/packets/18.png",
    "/products/packets/19.png",
    "/products/packets/20.png",
  ];
  const primaryImage =
    product.images?.[0]?.image_url || product.image || "/products/W1.png";
  const numericProductId = Number(product.id);
  const secondaryImage =
    product.images?.[1]?.image_url ||
    (Number.isFinite(numericProductId)
      ? hoverFallbacks[numericProductId % hoverFallbacks.length]
      : primaryImage);

  const handleAddToCart = async () => {
    if (!isAvailable) return;
    try {
      const variantId =
        product.variants?.[0]?.id || product.default_variant_id || null;
      if (!variantId) {
        router.push(`/product/${slugOrId}`);
        return;
      }

      const cart = await apiFetch("/cart");
      const cartItems = Array.isArray(cart?.items) ? cart.items : [];
      const targetVariantId = Number(variantId);
      const alreadyInCart = cartItems.some((item) => {
        const itemVariantId = Number(item?.variant_id || item?.variant?.id);
        if (
          Number.isFinite(itemVariantId) &&
          Number.isFinite(targetVariantId)
        ) {
          return itemVariantId === targetVariantId;
        }
        return (
          item.product_name === product.name &&
          (item.variant_name || item?.variant?.variant_name || "") ===
            (product.variants?.[0]?.variant_name || "")
        );
      });

      if (alreadyInCart) {
        window.dispatchEvent(
          new CustomEvent("toast", {
            detail: { message: "Product is already in cart.", type: "error" },
          }),
        );
        return;
      }

      await apiFetch("/cart", {
        method: "POST",
        body: JSON.stringify({
          variant_id: variantId,
          quantity: 1,
        }),
      });
      const current = Number(localStorage.getItem("cart_count")) || 0;
      localStorage.setItem("cart_count", String(current + 1));
      window.dispatchEvent(new Event("cartchange"));
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: { message: "Added to cart.", type: "success" },
        }),
      );
    } catch {
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: { message: "Please login first.", type: "error" },
        }),
      );
    }
  };

  return (
    <article
      className={`group flex h-full min-w-0 flex-col overflow-visible rounded-sm ${
        isHomepage ? "rounded-lg bg-[#f7f9f3]" : "bg-[#fafafa] pb-6"
      }`}
    >
      <div
        className={`flex flex-1 flex-col text-center ${
          isHomepage ? "p-3 pb-4 sm:p-5 sm:pb-5" : "p-6 pb-4"
        }`}
      >
        <Link
          href={`/product/${slugOrId}`}
          className="group/image relative block overflow-hidden rounded-sm"
        >
          <div
            className={`relative mx-auto flex items-center justify-center ${
              isHomepage
                ? "h-[240px] w-full sm:h-[240px] lg:h-[270px]"
                : "h-auto w-[70%]"
            }`}
          >
            <img
              src={primaryImage}
              alt={product.name}
              className={`w-auto object-contain object-center transition duration-300 group-hover/image:opacity-0 ${
                isHomepage ? "max-h-full" : "h-full"
              }`}
            />
            <img
              src={secondaryImage}
              alt={`${product.name} alternate`}
              className={`absolute inset-0 mx-auto w-auto object-contain object-center opacity-0 transition duration-300 group-hover/image:opacity-100 ${
                isHomepage ? "max-h-full" : "h-full"
              }`}
            />
          </div>
        </Link>

        <div
          className={`flex items-center justify-center ${
            isHomepage ? "mt-3 gap-0.5" : "mt-4 gap-1"
          }`}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <img
              key={`${product.id}-star-${index}`}
              src={
                index < fullStars
                  ? "/icons/starfill.svg"
                  : "/icons/Starborder.svg"
              }
              alt=""
              className={`${isHomepage ? "h-[18px] w-[18px]" : "h-4 w-4"} shrink-0`}
            />
          ))}
          {Number.isFinite(ratingCount) ? (
            <span className="ml-1 text-sm text-[#777d70]">({ratingCount})</span>
          ) : null}
        </div>

        <h3
          className={`font-normal uppercase tracking-[0.04em] text-[#1c2230] ${
            isHomepage ? "mt-2 text-xl" : "mt-3 text-xl"
          }`}
          style={{ fontFamily: "var(--font-basker)" }}
        >
          {product.name}
        </h3>

        <div
          className={`flex flex-wrap items-center justify-center text-[#1c2230] ${
            isHomepage ? "mt-3 gap-2 text-base" : "mt-4 gap-3 text-base"
          }`}
        >
          <span className="font-semibold">
            {"\u20B9"} {product.variants?.[0]?.price || product.price}
          </span>
          {product.oldPrice != null &&
          String(product.oldPrice) !==
            String(product.variants?.[0]?.price ?? product.price) ? (
            <span className="text-[#1c2230]/40 line-through">
              {"\u20B9"} {product.oldPrice}
            </span>
          ) : null}
          {product.badge ? (
            <span
              className={`bg-[#fff1c3] font-semibold text-[#a78000] rounded ${
                isHomepage
                  ? "px-2 py-0.5 text-[11px] "
                  : "px-2 py-0.5 text-[11px] uppercase tracking-[0.08em]"
              }`}
            >
              {product.badge}
            </span>
          ) : null}
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={!isAvailable}
        className={`mb-4 w-full py-3 cursor-pointer rounded-none bg-[#52653b] font-basker font-thin uppercase text-white transition hover:bg-[#6B7F42] ${
          isHomepage
            ? "text-md tracking-[0.02em] sm:text-base"
            : "text-md tracking-[0.12em]"
        }`}
      >
        {isAvailable ? "Add To Cart" : "Out of Stock"}
      </button>
    </article>
  );
}
