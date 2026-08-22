"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { apiFetch } from "@/utils/api";
import {
  extractProductItems,
  normalizeProductListItem,
} from "@/utils/products";

const FALLBACK_IMAGE = "/products/W1.png";

const stripMarkup = (value = "") =>
  String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const productPrice = (product) =>
  product?.variants?.[0]?.price ?? product?.price ?? "—";

const oldPrice = (product) => product?.compare_price ?? product?.oldPrice;

function Rating({ product }) {
  const rawRating = Number(product?.rating);
  const rating = Number.isFinite(rawRating)
    ? Math.max(0, Math.min(5, rawRating))
    : 0;
  const fullStars = Math.max(0, Math.min(5, Math.round(rating)));
  const reviewCount =
    product?.rating_count ?? product?.review_count ?? product?.total_reviews;

  return (
    <div
      className="flex items-center gap-[2px]"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <img
          key={`${product.id}-star-${index}`}
          src={
            index < fullStars ? "/icons/starfill.svg" : "/icons/Starborder.svg"
          }
          alt=""
          className="h-[18px] w-[18px] shrink-0"
          aria-hidden="true"
        />
      ))}
      {reviewCount !== null && reviewCount !== undefined ? (
        <span className="ml-1 text-md text-[#8a8d83]">({reviewCount})</span>
      ) : null}
    </div>
  );
}

function ProductImage({ product, className = "" }) {
  const primary =
    product?.images?.[0]?.image_url || product?.image || FALLBACK_IMAGE;
  const secondary = product?.images?.[1]?.image_url || primary;

  return (
    <div
      className={`group/image relative flex items-center justify-center ${className}`}
    >
      <img
        src={primary}
        alt={product.name}
        className="h-full w-full object-contain transition-opacity duration-300 group-hover/image:opacity-0"
      />
      <img
        src={secondary}
        alt={`${product.name} alternate view`}
        className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-300 group-hover/image:opacity-100"
      />
    </div>
  );
}

function ProductActions({ product, onAdd, compact = false }) {
  const slugOrId = product.slug || product.id;
  const isAvailable = product.in_stock !== false && product.status !== false;

  return (
    <div className={`grid grid-cols-2 gap-3 ${compact ? "mt-3" : "mt-5"}`}>
      <Link
        href={`/product/${slugOrId}`}
        className="flex min-h-10 items-center justify-center border border-[#71805d] px-3 text-center font-basker text-md uppercase text-[#52633d] transition hover:bg-[#e8ecdf]"
      >
        Learn More
      </Link>
      <button
        type="button"
        onClick={() => onAdd(product)}
        disabled={!isAvailable}
        className="min-h-10 cursor-pointer rounded-none bg-[#52653b] px-3 font-basker text-md uppercase text-white transition hover:bg-[#6B7F42] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isAvailable ? "Shop Now" : "Out of Stock"}
      </button>
    </div>
  );
}

function ProductDetails({ product, featured = false, onAdd }) {
  const description = stripMarkup(
    product.short_description || product.description || product.subtitle,
  );
  const previousPrice = oldPrice(product);
  const currentPrice = productPrice(product);

  return (
    <div className="min-w-0">
      <h2
        className={`font-normal uppercase leading-[1.08] text-[#3f532b] ${
          featured ? "text-[36px]" : "text-2xl"
        }`}
        style={{ fontFamily: "var(--font-basker)" }}
      >
        {product.name}
      </h2>
      <div className={featured ? "mt-5" : "mt-4"}>
        <Rating product={product} />
      </div>
      {description ? (
        <p
          className={`mt-5 max-w-[580px] leading-[1.35] text-[#252823] ${
            featured ? "text-base" : "line-clamp-3 text-base"
          }`}
        >
          {description}
        </p>
      ) : null}
      <div
        className={`mt-4 flex items-center gap-2  text-[#20231e] ${
          featured ? "text-[20px]" : "text-[20px]"
        }`}
      >
        <span>₹ {currentPrice}</span>
        {previousPrice && String(previousPrice) !== String(currentPrice) ? (
          <span className="text-[#6f716c] line-through">₹ {previousPrice}</span>
        ) : null}
      </div>
      <ProductActions product={product} onAdd={onAdd} compact={!featured} />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid animate-pulse gap-4 lg:grid-cols-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className={`h-[285px] rounded-lg bg-[#f0f3eb] ${
            index === 0 ? "lg:col-span-2 lg:h-[440px]" : ""
          }`}
        />
      ))}
    </div>
  );
}

export default function ShopClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total_items: 0,
    total_pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const queryString = searchParams.toString();

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const incoming = new URLSearchParams(queryString);
        const params = new URLSearchParams();
        params.set("page", incoming.get("page") || "1");
        params.set("limit", "12");

        ["search", "category", "subcategory", "tag", "collection"].forEach(
          (key) => {
            const value = incoming.get(key);
            if (value) params.set(key, value);
          },
        );

        const data = await apiFetch(`/products?${params.toString()}`);
        const normalized = extractProductItems(data).map(
          normalizeProductListItem,
        );

        if (active) {
          setProducts(normalized);
          setPagination({
            page: Number(data?.pagination?.page) || 1,
            limit: Number(data?.pagination?.limit) || 12,
            total_items: Number(data?.pagination?.total_items) || 0,
            total_pages: Math.max(
              1,
              Number(data?.pagination?.total_pages) || 1,
            ),
          });
        }
      } catch (requestError) {
        if (active) {
          setProducts([]);
          setError(requestError?.message || "Failed to load products.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProducts();
    return () => {
      active = false;
    };
  }, [queryString]);

  const goToPage = (page) => {
    const nextPage = Math.max(1, Math.min(pagination.total_pages, page));
    const params = new URLSearchParams(queryString);
    params.set("page", String(nextPage));
    router.push(`/shop?${params.toString()}`);
  };

  const { featuredProduct, remainingProducts } = useMemo(() => {
    if (!products.length)
      return { featuredProduct: null, remainingProducts: [] };

    const featuredIndex = products.findIndex((product) =>
      /kashmiri/i.test(product.name || ""),
    );
    const resolvedIndex = featuredIndex >= 0 ? featuredIndex : 0;

    return {
      featuredProduct: products[resolvedIndex],
      remainingProducts: products.filter((_, index) => index !== resolvedIndex),
    };
  }, [products]);

  const handleAddToCart = async (product) => {
    const slugOrId = product.slug || product.id;
    const variantId = product.variants?.[0]?.id || product.default_variant_id;

    if (!variantId) {
      router.push(`/product/${slugOrId}`);
      return;
    }

    try {
      const cart = await apiFetch("/cart");
      const targetId = Number(variantId);
      const alreadyInCart = (Array.isArray(cart?.items) ? cart.items : []).some(
        (item) => Number(item?.variant_id || item?.variant?.id) === targetId,
      );

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
        body: JSON.stringify({ variant_id: variantId, quantity: 1 }),
      });
      const count = Number(localStorage.getItem("cart_count")) || 0;
      localStorage.setItem("cart_count", String(count + 1));
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
    <main className="bg-white pt-[70px] text-[#1f251c]">
      <section className="relative flex h-[80svh] min-h-[220px] max-h-[260px] items-center justify-center overflow-hidden">
        <img
          src="/bg/Rectangle 4245.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#f8ead7]/10" />
        <h1
          className="relative z-10 mx-auto max-w-[1100px] px-8 text-center text-[28px] md:text-4xl font-normal uppercase leading-[1.12] text-[#292b27]"
          style={{ fontFamily: "var(--font-basker)" }}
        >
          <span className="sm:block">A Collection of Authentic Kahwa </span>
          <span className="sm:block">Blends Crafted for Every Ritual</span>
        </h1>
      </section>

      <section className="py-14 sm:py-[62px]">
        <div className="site-container">
          {loading ? <LoadingState /> : null}

          {!loading && error ? (
            <div className="py-24 text-center">
              <p className="text-lg text-[#7b332c]">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 border border-[#52653b] px-6 py-2 uppercase text-[#52653b]"
              >
                Try Again
              </button>
            </div>
          ) : null}

          {!loading && !error && !featuredProduct ? (
            <p className="py-24 text-center text-lg text-[#666b60]">
              No products found.
            </p>
          ) : null}

          {!loading && !error && featuredProduct ? (
            <>
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_296px]">
                <article className="relative grid min-h-[439px] items-center overflow-hidden rounded-lg bg-[#f3f6ee] px-6 py-10 sm:grid-cols-[235px_minmax(0,1fr)] sm:px-9 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-12">
                  {featuredProduct.badge ? (
                    <span className="absolute right-4 top-4 bg-[#ffefb9] px-2 py-1 text-md text-[#a97e00]">
                      {featuredProduct.badge}
                    </span>
                  ) : null}
                  <Link
                    href={`/product/${featuredProduct.slug || featuredProduct.id}`}
                  >
                    <ProductImage
                      product={featuredProduct}
                      className="mx-auto h-[285px] w-[190px] sm:h-[340px] sm:w-[220px]"
                    />
                  </Link>
                  <div className="mt-8 sm:mt-0 sm:pl-7 lg:pl-8">
                    <ProductDetails
                      product={featuredProduct}
                      featured
                      onAdd={handleAddToCart}
                    />
                  </div>
                </article>

                <img
                  src="/products/all_products/Rectangle 4343.png"
                  alt="Kashmiri Kahwa presented with saffron and flowers"
                  className="hidden h-[439px] w-full rounded-lg object-cover lg:block"
                />
              </div>

              {remainingProducts.length ? (
                <div className="mt-[58px] grid gap-4 lg:grid-cols-2">
                  {remainingProducts.map((product) => (
                    <article
                      key={product.id}
                      className="grid min-h-[285px] items-center rounded-lg bg-[#f6f7f1] p-5 sm:grid-cols-[160px_minmax(0,1fr)] sm:px-8"
                    >
                      <Link href={`/product/${product.slug || product.id}`}>
                        <ProductImage
                          product={product}
                          className="mx-auto h-[280px] w-[135px]"
                        />
                      </Link>
                      <div className="mt-6 sm:mt-0 sm:pl-5">
                        <ProductDetails
                          product={product}
                          onAdd={handleAddToCart}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}

              {pagination.total_pages > 1 ? (
                <nav
                  className="mt-12 flex items-center justify-center gap-5"
                  aria-label="Products pagination"
                >
                  <button
                    type="button"
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="border border-[#71805d] px-5 py-2 text-[#52633d] transition hover:bg-[#e8ecdf] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-base text-[#52633d]">
                    Page {pagination.page} of {pagination.total_pages}
                  </span>
                  <button
                    type="button"
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={pagination.page >= pagination.total_pages}
                    className="border border-[#71805d] px-5 py-2 text-[#52633d] transition hover:bg-[#e8ecdf] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </nav>
              ) : null}
            </>
          ) : null}
        </div>
      </section>
    </main>
  );
}
