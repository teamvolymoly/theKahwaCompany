"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/utils/api";
import { dummyProducts, dummyReviews } from "@/utils/dummyData";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const load = async () => {
      const fallback =
        dummyProducts.find((p) => p.slug === slug || String(p.id) === slug) ||
        dummyProducts[0];
      try {
        const prod = await apiFetch(`/products/${slug}`);
        const resolved = prod || fallback;
        setProduct(resolved);

        const imgs = await apiFetch(`/products/${resolved.id}/images`);
        const imageList =
          Array.isArray(imgs) && imgs.length ? imgs : resolved.images || [];
        setImages(imageList);
        setActiveImage(0);

        const vars = await apiFetch(`/products/${resolved.id}/variants`);
        const variantList =
          Array.isArray(vars) && vars.length ? vars : resolved.variants || [];
        setVariants(variantList);
        setSelectedVariant(variantList[0] ?? null);

        const revs = await apiFetch(`/products/${resolved.id}/reviews`);
        setReviews(Array.isArray(revs) && revs.length ? revs : dummyReviews);
      } catch (err) {
        setProduct(fallback);
        setImages(fallback.images || []);
        setActiveImage(0);
        setVariants(fallback.variants || []);
        setSelectedVariant((fallback.variants || [])[0] ?? null);
        setReviews(dummyReviews);
      }
    };
    if (slug) load();
  }, [slug]);

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    return total / reviews.length;
  }, [reviews]);

  const fullStars = Math.max(0, Math.min(5, Math.round(avgRating)));

  const addToCart = async () => {
    if (!selectedVariant) return;
    const safeQty = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
    await apiFetch("/cart", {
      method: "POST",
      body: JSON.stringify({
        variant_id: selectedVariant.id,
        quantity: safeQty,
      }),
    });
    alert("Added to cart!");
  };

  const mainImage =
    images[activeImage]?.image_url || images[0]?.image_url || "";

  if (!product) {
    return (
      <div className="min-h-screen bg-white text-black">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-black/60">
            Brewing your selection
          </p>
          <p
            className="mt-6 text-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="bg-white text-black mt-22">
        <section className="border-b border-black/10">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <p className="text-xs uppercase tracking-[0.4em] text-black/50">
              Teapoz collection
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-black/50">
              <span>Home</span>
              <span>/</span>
              <span>Shop</span>
              <span>/</span>
              <span className="text-black">{product.name}</span>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-32 -top-24 h-80 w-80 rounded-full bg-black/5 blur-3xl" />
          <div className="pointer-events-none absolute -left-40 bottom-10 h-72 w-72 rounded-full bg-black/5 blur-3xl" />

          <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16 grid gap-10 lg:grid-cols-[110px_1.1fr_1fr]">
            <div className="order-2 flex gap-3 lg:order-1 lg:flex-col">
              {images.map((img, i) => (
                <button
                  key={img.id ?? i}
                  onClick={() => setActiveImage(i)}
                  className={`h-20 w-20 overflow-hidden rounded-2xl border bg-white transition ${
                    activeImage === i
                      ? "border-black shadow-sm"
                      : "border-black/10"
                  }`}
                  aria-label={`Show image ${i + 1}`}
                >
                  <img
                    src={img.image_url}
                    alt={`${product.name} thumbnail ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="order-1 lg:order-2">
              <div className="rounded-sm border border-black/10 bg-white p-6 shadow-[0_22px_60px_rgba(0,0,0,0.08)]">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="h-[420px] w-full object-contain"
                  />
                ) : (
                  <div className="flex h-[420px] items-center justify-center text-sm text-black/50">
                    No image available
                  </div>
                )}
              </div>
              {/* <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-black/50">
                <span className="rounded-full border border-black/10 bg-white px-4 py-2 text-[#FFBF00]">
                  Small batch
                </span>
                <span className="rounded-full border border-black/10 bg-white px-4 py-2 text-[#FFBF00]">
                  Organic leaves
                </span>
                <span className="rounded-full border border-black/10 bg-white px-4 py-2 text-[#FFBF00]">
                  Hand picked
                </span>
              </div> */}
            </div>

            <div className="order-3">
              <div className="w-fit px-4 py-1 mt-4 text-sm bg-[#FFF1C3] text-yellow-600 uppercase tracking-[0.05em] rounded-sm">
                {product.tag_line || "A delightful blend to brighten your day."}
              </div>
              <h1
                className="text-4xl leading-tight lg:text-5xl uppercase tracking-[0.02em] mt-3 text-[#1c2230]"
                style={{ fontFamily: "var(--font-basker)" }}
              >
                {product.name}
              </h1>
              <p className="mt-3 text-sm text-black uppercase tracking-[0.05em] ">
                {product.short_description}
              </p>

              <div className="mt-3 flex gap-3 border-b border-black/10 pb-8 text-black/60">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <svg
                      key={`avg-star-${index}`}
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
                <span className="text-sm text-black/50">
                  (
                  {reviews.length
                    ? `${reviews.length} reviews`
                    : "No reviews yet"}
                  )
                </span>
              </div>

              <div className="mt-7 flex items-end gap-4">
                <div
                  className="text-4xl font-semibold text-[#1c2230]"
                  // style={{ fontFamily: "var(--font-basker)" }}
                >
                  ₹{selectedVariant?.price ?? "--"}
                </div>
                {selectedVariant?.variant_name && (
                  <div className="text-xs uppercase tracking-[0.08em] bg-gray-100 px-4 py-2 rounded-full text-black/60 shadow-sm">
                    {" "}
                    {selectedVariant.variant_name}
                  </div>
                )}
              </div>

              <div className="mt-8 ">
                <p className="text-sm uppercase tracking-[0.08em] text-black/70">
                  Net Quantity
                </p>
                <div className="flex flex-wrap gap-3 mt-3">
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`rounded-sm border border-black/10 px-6 py-3 text-sm cursor-pointer transition ${
                        selectedVariant?.id === v.id
                          ? "bg-gradient-to-r from-[#5f665e] to-[#525a53] text-white"
                          : "border-black/10 bg-white text-black hover:border-black/50"
                      }`}
                    >
                      {v.variant_name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
                <p className="text-sm uppercase tracking-[0.08em] text-black/70">
                  Quantity
                </p>
                <div className="flex items-center gap-3 rounded-sm border border-black/10 bg-white px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="text-lg cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={quantity}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, "");
                      const next = parseInt(digitsOnly || "1", 10);
                      setQuantity(Number.isFinite(next) && next > 0 ? next : 1);
                    }}
                    className="w-14 bg-transparent border-x border-black/10 text-center text-sm outline-none "
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="text-lg cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                {/* <button
                  type="button"
                  className="rounded-sm border border-black/10 bg-white px-6 py-4 text-xs uppercase tracking-[0.3em] text-black transition hover:border-black"
                >
                  Save for later
                </button> */}
                <button
                  onClick={addToCart}
                  className="w-full rounded-sm whitespace-nowrap bg-gradient-to-r from-[#7a8177] to-[#6a716a] px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:from-[#5f665e] hover:to-[#525a53] cursor-pointer"
                >
                  Add to cart
                </button>
              </div>

              {/* <div className="mt-10 grid gap-3 text-sm text-black/60">
                <div className="flex items-center justify-between border-b border-black/10 pb-3">
                  <span>Origin</span>
                  <span>Highland gardens</span>
                </div>
                <div className="flex items-center justify-between border-b border-black/10 pb-3">
                  <span>Steep time</span>
                  <span>3-4 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Serving size</span>
                  <span>2g per cup</span>
                </div>
              </div> */}
            </div>
          </div>
        </section>

        <section className="border-t border-black/10 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2
                className="text-2xl lg:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Tasting notes
              </h2>
              <p className="mt-4 text-base leading-relaxed text-black/60">
                {product.description}
              </p>
              <div className="mt-8 rounded-3xl border border-black/10 bg-black/5 p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-black/50">
                  Best paired with
                </p>
                <p
                  className="mt-4 text-lg"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Citrus, honey biscuits, and slow mornings.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-6">
              <h3
                className="text-xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Customer reviews
              </h3>
              <div className="mt-6 space-y-5">
                {reviews.length === 0 && (
                  <p className="text-sm text-black/50">
                    Share your first sip and review this tea.
                  </p>
                )}
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-black/10 bg-black/5 p-4"
                  >
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-black/50">
                      <span>Customer</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <svg
                            key={`review-${r.id}-star-${index}`}
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill={
                              index < (r.rating || 0) ? "currentColor" : "none"
                            }
                            className={`h-3 w-3 ${index < (r.rating || 0) ? "text-[#1c2230]" : "text-[#1c2230]/30"}`}
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
                    </div>
                    <p className="mt-3 text-sm text-black/60">{r.review}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
