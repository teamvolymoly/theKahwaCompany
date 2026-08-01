"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/utils/api";

export default function ProductCard({ product, variant = "default" }) {
  const router = useRouter();
  const isHomepage = variant === "homepage";
  const slugOrId = product.slug || product.id;
  const rating = Number.isFinite(product.rating) ? product.rating : 4;
  const fullStars = Math.max(0, Math.min(5, Math.round(rating)));
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
        if (Number.isFinite(itemVariantId) && Number.isFinite(targetVariantId)) {
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
      className={`group flex h-full min-w-0 flex-col overflow-hidden rounded-sm ${
        isHomepage
          ? "rounded-lg bg-[#f7f9f3]"
          : "bg-[#fafafa] pb-6"
      }`}
    >
      <div
        className={`flex flex-1 flex-col text-center ${
          isHomepage ? "p-3 pb-4 sm:p-5 sm:pb-5" : "p-6 pb-4"
        }`}
      >
        <Link
          href={`/product/${slugOrId}`}
          className="relative block overflow-hidden rounded-sm"
        >
          <div
            className={`relative mx-auto flex items-center justify-center ${
              isHomepage
                ? "h-[190px] w-full sm:h-[240px] lg:h-[270px]"
                : "h-auto w-[70%]"
            }`}
          >
            <img
              src={primaryImage}
              alt={product.name}
              className={`w-auto object-contain object-center transition duration-300 group-hover:opacity-0 ${
                isHomepage ? "max-h-full" : "h-full"
              }`}
            />
            <img
              src={secondaryImage}
              alt={`${product.name} alternate`}
              className={`absolute inset-0 mx-auto w-auto object-contain object-center opacity-0 transition duration-300 group-hover:opacity-100 ${
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
            <svg
              key={`${product.id}-star-${index}`}
              viewBox="0 0 24 24"
              fill={index < fullStars ? "currentColor" : "none"}
              className={`${isHomepage ? "h-[18px] w-[18px]" : "h-4 w-4"} ${
                index < fullStars
                  ? isHomepage
                    ? "text-[#e2ae00]"
                    : "text-[#1c2230]"
                  : "text-[#1c2230]/30"
              }`}
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
          {isHomepage ? (
            <span className="ml-1 text-xs text-[#777d70]">
              ({product.review_count || 16})
            </span>
          ) : null}
        </div>

        <h3
          className={`font-normal uppercase tracking-[0.04em] text-[#1c2230] ${
            isHomepage
              ? "mt-2 text-sm sm:text-lg lg:text-xl"
              : "mt-3 text-lg"
          }`}
          style={{ fontFamily: "var(--font-basker)" }}
        >
          {product.name}
        </h3>

        <div
          className={`flex flex-wrap items-center justify-center text-[#1c2230] ${
            isHomepage
              ? "mt-3 gap-2 text-xs sm:text-sm"
              : "mt-4 gap-3 text-sm"
          }`}
        >
          <span className="font-semibold">
            {"\u20B9"} {product.variants?.[0]?.price || product.price}
          </span>
          {product.oldPrice ? (
            <span className="text-[#1c2230]/40 line-through">
              {"\u20B9"} {product.oldPrice}
            </span>
          ) : null}
          {product.badge ? (
            <span
              className={`bg-[#fff1c3] font-semibold text-[#a78000] ${
                isHomepage
                  ? "px-2 py-0.5 text-[10px] sm:text-xs"
                  : "px-2 py-0.5 text-[10px] uppercase tracking-[0.08em]"
              }`}
            >
              {product.badge}
            </span>
          ) : null}
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className={`w-full cursor-pointer font-medium uppercase text-white transition ${
          isHomepage
            ? "bg-[#4e6039] py-3 text-sm tracking-[0.02em] hover:bg-[#40502f] sm:py-3.5 sm:text-base"
            : "bg-gradient-to-r from-[#7a8177] to-[#6a716a] py-3 text-xs tracking-[0.12em] hover:from-[#5f665e] hover:to-[#525a53]"
        }`}
        style={isHomepage ? { fontFamily: "var(--font-basker)" } : undefined}
      >
        Add To Cart
      </button>
    </article>
  );
}
