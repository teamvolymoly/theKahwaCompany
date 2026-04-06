"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/utils/api";
import { dummyProducts, dummyReviews } from "@/utils/dummyData";
import ProductCard from "@/components/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const ingredientsRef = useRef(null);
  const galleryRef = useRef(null);
  const brewingHotRef = useRef(null);
  const brewingColdRef = useRef(null);
  const [previewIndex, setPreviewIndex] = useState(null);

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

  const getWeightMeta = (variant) => {
    if (!variant) return null;
    const gramsFromData = Number(variant.weight_g);
    if (Number.isFinite(gramsFromData) && gramsFromData > 0) {
      const label =
        gramsFromData >= 1000 && gramsFromData % 1000 === 0
          ? `${gramsFromData / 1000}kg`
          : `${gramsFromData}g`;
      const cups = Math.round(gramsFromData * 0.5);
      return { label, cups };
    }
    const name = variant.variant_name || "";
    const match = name.match(/(\d+(?:\.\d+)?)\s*(kg|g)\b/i);
    if (!match) return null;
    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    const grams = unit === "kg" ? Math.round(value * 1000) : Math.round(value);
    if (!grams) return null;
    const label =
      grams >= 1000 && grams % 1000 === 0 ? `${grams / 1000}kg` : `${grams}g`;
    const cups = Math.round(grams * 0.5);
    return { label, cups };
  };

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

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = encodeURIComponent(product?.name || "Check this product");

  const handleShare = (platform) => {
    if (!shareUrl) return;
    const encodedUrl = encodeURIComponent(shareUrl);
    let url = "";
    if (platform === "facebook") {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    } else if (platform === "twitter") {
      url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`;
    } else if (platform === "whatsapp") {
      url = `https://wa.me/?text=${shareText}%20${encodedUrl}`;
    } else if (platform === "copy") {
      navigator.clipboard?.writeText(shareUrl);
      return;
    }
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const mainImage =
    images[activeImage]?.image_url || images[0]?.image_url || "";
  const galleryImages =
    images.length > 0
      ? images
      : [
          { id: "g1", image_url: "/products/packets/11.png" },
          { id: "g2", image_url: "/products/packets/12.png" },
          { id: "g3", image_url: "/products/packets/13.png" },
          { id: "g4", image_url: "/products/packets/14.png" },
          { id: "g5", image_url: "/products/packets/15.png" },
          { id: "g6", image_url: "/products/packets/16.png" },
          { id: "g7", image_url: "/products/packets/17.png" },
          { id: "g8", image_url: "/products/packets/18.png" },
        ];
  const isPreviewOpen = previewIndex !== null;
  const currentPreview =
    previewIndex !== null ? galleryImages[previewIndex] : null;

  const handlePrevPreview = () => {
    if (previewIndex === null) return;
    setPreviewIndex(
      (previewIndex - 1 + galleryImages.length) % galleryImages.length,
    );
  };

  const handleNextPreview = () => {
    if (previewIndex === null) return;
    setPreviewIndex((previewIndex + 1) % galleryImages.length);
  };

  const brewingHot = [
    {
      title: "Measure",
      description: "1 tsp / 2g",
      image: "/products/packets/11.png",
    },
    {
      title: "Water",
      description: "200ml",
      image: "/products/packets/12.png",
    },
    {
      title: "Temperature",
      description: "85°–95°C",
      image: "/products/packets/13.png",
    },
    {
      title: "Steep",
      description: "3–5 mins",
      image: "/products/packets/14.png",
    },
  ];
  const brewingCold = [
    {
      title: "Brew",
      description: "Brew as above and let it cool",
      image: "/products/packets/15.png",
    },
    {
      title: "Cover",
      description: "Cover with a lid while brewing",
      image: "/products/packets/16.png",
    },
    {
      title: "Ice",
      description: "Pour over ice",
      image: "/products/packets/17.png",
    },
    {
      title: "Finish",
      description: "Mint + lemon for a color shift",
      image: "/products/packets/18.png",
    },
  ];

  const ingredientsBase = [
    {
      name: "Chamomile Flower",
      image:
        "/products/Ingredient/Chamomile_FLower_8047e7b1-6c54-41fe-acbd-18bfb030db44.avif",
    },
    {
      name: "Green Tea",
      image:
        "/products/Ingredient/Green_Tea_388daaf2-1c37-4633-87dd-56c85e28b05c.avif",
    },
    {
      name: "Lemongrass",
      image:
        "/products/Ingredient/Lemongrass_9ef65a92-6a72-4453-9f4b-43502c336528.avif",
    },
    {
      name: "Orange Peel",
      image:
        "/products/Ingredient/Orange_Peel_a61b1d6a-6890-43fd-bef5-86528a0bd763.avif",
    },
    {
      name: "Peppermint",
      image:
        "/products/Ingredient/Peppermint_952ac752-d54d-4f23-8f76-d659cd96c75c.avif",
    },
    {
      name: "Spearmint",
      image:
        "/products/Ingredient/Spearmint_3cecd63e-bcdd-4904-a59e-bf260f503075.avif",
    },
  ];
  const ingredients = Array.from({ length: 10 }).map((_, index) => {
    const item = ingredientsBase[index % ingredientsBase.length];
    return { ...item, id: `ing-${index}-${item.name}` };
  });

  const discoverMore = dummyProducts
    .filter((p) => p.id !== product?.id)
    .slice(0, 4);

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
        {isPreviewOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={() => setPreviewIndex(null)}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg text-white"
              aria-label="Close preview"
            >
              ×
            </button>
            <div className="relative max-h-[80vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white p-6">
              <button
                type="button"
                onClick={handlePrevPreview}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-black/10 bg-white/90 px-4 py-3 text-2xl text-black/70 hover:text-black"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={handleNextPreview}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-black/10 bg-white/90 px-4 py-3 text-2xl text-black/70 hover:text-black"
                aria-label="Next image"
              >
                ›
              </button>
              <img
                src={currentPreview?.image_url || galleryImages[0]?.image_url}
                alt={`${product.name} preview`}
                className="h-[70vh] w-full object-contain"
              />
              <div className="mt-4 flex flex-col items-center gap-3">
                <div className="text-xs uppercase tracking-[0.3em] text-black/40">
                  {previewIndex !== null
                    ? `Image ${previewIndex + 1} of ${galleryImages.length}`
                    : ""}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {galleryImages.map((_, index) => (
                    <button
                      key={`dot-${index}`}
                      type="button"
                      onClick={() => setPreviewIndex(index)}
                      className={`h-2.5 w-2.5 rounded-full border transition ${
                        index === previewIndex
                          ? "border-black bg-black"
                          : "border-black/30 bg-transparent"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        <section className="">
          <div className="container mx-auto px-4 lg:px-8 mx-auto  pt-6">
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
          <div className="container mx-auto px-4 lg:px-8 mx-auto pt-8  pb-12 lg:pb-16 grid gap-10 lg:grid-cols-[110px_1.1fr_1fr]">
            <div className="order-2 flex gap-3 overflow-x-auto pb-2 lg:order-1 lg:flex-col lg:overflow-visible lg:pb-0">
              {images.map((img, i) => (
                <button
                  key={img.id ?? i}
                  onClick={() => setActiveImage(i)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border bg-white transition ${
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
                    className="h-[280px] sm:h-[360px] lg:h-[420px] w-full object-contain"
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

              <div className="mt-7 flex flex-wrap items-end gap-4">
                <div
                  className="text-4xl font-semibold text-[#1c2230]"
                  // style={{ fontFamily: "var(--font-basker)" }}
                >
                  ₹{selectedVariant?.price ?? "--"}
                </div>
                {product.oldPrice && (
                  <div className="text-lg text-[#1c2230]/40 line-through">
                    ₹{product.oldPrice}
                  </div>
                )}
              </div>

              <div className="mt-8 ">
                <p className="text-sm uppercase tracking-[0.08em] text-black/70">
                  Net Quantity
                </p>
                {/* {selectedVariant?.variant_name && (
                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-black/50">
                    {selectedVariant.variant_name}
                  </p>
                )} */}
                <div className="flex flex-wrap gap-3 mt-3">
                  {variants.map((v) =>
                    (() => {
                      const weightMeta = getWeightMeta(v);
                      const primaryLabel = weightMeta?.label || v.variant_name;
                      const secondaryLabel = weightMeta
                        ? `${weightMeta.cups} cups`
                        : null;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`rounded-sm border border-black/10 px-6 py-3 text-sm cursor-pointer transition ${
                            selectedVariant?.id === v.id
                              ? "bg-gradient-to-r from-[#5f665e] to-[#525a53] text-white"
                              : "border-black/10 bg-white text-black hover:border-black/50"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-sm font-semibold">
                              {primaryLabel}
                            </span>
                            {secondaryLabel && (
                              <span className="text-[11px] uppercase font-semibold tracking-[0.1em] ">
                                {secondaryLabel}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })(),
                  )}
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
                  className="sm:w-auto md:w-full rounded-sm whitespace-nowrap bg-gradient-to-r from-[#7a8177] to-[#6a716a] px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:from-[#5f665e] hover:to-[#525a53] cursor-pointer"
                >
                  Add to cart
                </button>
              </div>

              {/* <div className="mt-6 flex flex-wrap items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-black/60">
                <span className="text-black/70">Share:</span>
                <button
                  type="button"
                  onClick={() => handleShare("facebook")}
                  className="inline-flex items-center gap-2 rounded-sm border border-black/10 px-2.5 py-2 text-black/70 transition hover:border-black/40"
                  aria-label="Share on Facebook"
                >
                  <img
                    src="/products/packets/11.png"
                    alt="Facebook"
                    width="16"
                    height="16"
                    className="h-4 w-4 object-contain"
                  />
                  Facebook
                </button>
                <button
                  type="button"
                  onClick={() => handleShare("twitter")}
                  className="inline-flex items-center gap-2 rounded-sm border border-black/10 px-2.5 py-2 text-black/70 transition hover:border-black/40"
                  aria-label="Share on X"
                >
                  <img
                    src="/products/packets/12.png"
                    alt="X"
                    width="16"
                    height="16"
                    className="h-4 w-4 object-contain"
                  />
                  X
                </button>
                <button
                  type="button"
                  onClick={() => handleShare("whatsapp")}
                  className="inline-flex items-center gap-2 rounded-sm border border-black/10 px-2.5 py-2 text-black/70 transition hover:border-black/40"
                  aria-label="Share on WhatsApp"
                >
                  <img
                    src="/products/packets/13.png"
                    alt="WhatsApp"
                    width="16"
                    height="16"
                    className="h-4 w-4 object-contain"
                  />
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => handleShare("copy")}
                  className="inline-flex items-center gap-2 rounded-sm border border-black/10 px-2.5 py-2 text-black/70 transition hover:border-black/40"
                  aria-label="Copy link"
                >
                  <img
                    src="/products/packets/14.png"
                    alt="Copy link"
                    width="16"
                    height="16"
                    className="h-4 w-4 object-contain"
                  />
                  Copy link
                </button>
              </div> */}

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

        <section className=" container mx-auto px-4 lg:px-8 border-t border-black/10 bg-white">
          <div className=" py-14">
            <div>
              <h2
                className="text-2xl lg:text-3xl font-semibold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Product Description
              </h2>
              <p className="mt-4 text-base leading-relaxed text-black/80">
                {product.description}
              </p>
            </div>

            <div className="space-y-4 mt-6">
              {/* <h3 className="text-lg uppercase tracking-[0.2em] text-black/50">
                Gallery
              </h3> */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2 md:hidden">
                  <button
                    type="button"
                    onClick={() =>
                      galleryRef.current?.scrollBy({
                        left: -220,
                        behavior: "smooth",
                      })
                    }
                    className="h-10 w-10 rounded-sm border border-black/10 text-black/60"
                    aria-label="Scroll gallery left"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      galleryRef.current?.scrollBy({
                        left: 220,
                        behavior: "smooth",
                      })
                    }
                    className="h-10 w-10 rounded-sm border border-black/10 text-black/60"
                    aria-label="Scroll gallery right"
                  >
                    ›
                  </button>
                </div>
              </div>
              <div
                ref={galleryRef}
                className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory"
              >
                {galleryImages.map((img, index) => (
                  <button
                    type="button"
                    key={img.id ?? index}
                    onClick={() => setPreviewIndex(index)}
                    className="min-w-[160px] h-60 snap-start rounded-sm border border-black/10 bg-white transition hover:border-black/40 cursor-pointer"
                    aria-label={`Open image ${index + 1}`}
                  >
                    <img
                      src={img.image_url}
                      alt={`${product.name} gallery ${index + 1}`}
                      className="h-full w-full object-cover "
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 mt-10">
              <h3 className="text-2xl lg:text-3xl font-semibold">
                Brewing Rituals
              </h3>
              <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
                <div className="w-full text-black">
                  <h4 className="text-lg font-semibold">Hot Brew</h4>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3 text-base text-black">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                        <img
                          src="/products/br/Place_1_Bag_in_a_Cup.svg"
                          alt="Place 1 bag in a cup"
                          className="h-10 w-10 object-contain"
                        />
                      </span>
                      1 Tsp / 2 g
                    </div>
                    <div className="flex items-center gap-3 text-base text-black">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                        <img
                          src="/products/br/Pour_7fl._oz_200_ml_Freshly_Boiled_Water_over_the_Leaves-40_1.svg"
                          alt="Pour 200 ml water"
                          className="h-10 w-10 object-contain"
                        />
                      </span>
                      200ml
                    </div>
                    <div className="flex items-center gap-3 text-base text-black">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                        <img
                          src="/products/br/Water_Temperature_-_158_F-176_F_-_70_C-80_C_7fd68249-bd73-4395-9d89-ea7dcb877f83.svg"
                          alt="Water temperature"
                          className="h-10 w-10 object-contain"
                        />
                      </span>
                      85° - 95°C
                    </div>
                    <div className="flex items-center gap-3 text-base text-black">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                        <img
                          src="/products/br/Brew_for_2-3_mins_4c4d18ef-6046-4708-9813-79f87a88239e.svg"
                          alt="Brew time"
                          className="h-10 w-10 object-contain"
                        />
                      </span>
                      3 - 5 Mins
                    </div>
                  </div>
                </div>
                <div className="w-full text-black">
                  <h4 className="text-lg font-semibold">Iced Brew</h4>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <div className="flex items-center gap-3 text-base text-black">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                        <img
                          src="/products/br/Refrigerate_for_3-4_hours._Add_ice_cubes_sweetener.svg"
                          alt="Refrigerate and add ice"
                          className="h-10 w-10 object-contain"
                        />
                      </span>
                      Refrigerate & add ice
                    </div>
                    <div className="flex items-center gap-3 text-base text-black">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                        <img
                          src="/products/br/To_be_served_without_milk.svg"
                          alt="Serve without milk"
                          className="h-10 w-10 object-contain"
                        />
                      </span>
                      Serve without milk
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl lg:text-3xl font-semibold">
                  Ingredients
                </h3>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => ingredientsRef.current?.slidePrev()}
                  className="h-10 w-fit rounded-sm border border-black/10 text-black/60"
                  aria-label="Scroll ingredients left"
                >
                  <ChevronLeftIcon />
                </button>
                <Swiper
                  modules={[Navigation]}
                  slidesPerView={1.2}
                  spaceBetween={16}
                  navigation={false}
                  pagination={{ clickable: true }}
                  scrollbar={{ draggable: true }}
                  loop={true}
                  onSwiper={(swiper) => {
                    ingredientsRef.current = swiper;
                  }}
                  breakpoints={{
                    480: { slidesPerView: 2.2, spaceBetween: 10 },
                    768: { slidesPerView: 3.2, spaceBetween: 10 },
                    1024: { slidesPerView: 4.2, spaceBetween: 10 },
                    1280: { slidesPerView: 4.2, spaceBetween: 10 },
                    1536: { slidesPerView: 5.2, spaceBetween: 10 },
                  }}
                  className="pb-6"
                >
                  {ingredients.map((item) => (
                    <SwiperSlide key={item.id}>
                      <div className="w-full mr-0">
                        <div className="w-full aspect-square p-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-contain rounded-sm"
                          />
                        </div>
                        <p className=" ms-4 text-sm uppercase tracking-[0.08em] text-black">
                          {item.name}
                        </p>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <button
                  type="button"
                  onClick={() => ingredientsRef.current?.slideNext()}
                  className="h-10 w-fit rounded-sm border border-black/10 text-black/60"
                  aria-label="Scroll ingredients right"
                >
                  <ChevronRightIcon />
                </button>
              </div>
            </div>

            <div className="space-y-6 mt-10">
              <div className="flex items-center justify-between">
                <h3
                  className="text-2xl lg:text-3xl font-semibold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Discover More
                </h3>
                <button
                  type="button"
                  className="text-xs uppercase tracking-[0.08em] text-black/60"
                >
                  View all
                </button>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {discoverMore.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className=" bg-white border-t border-black/10 container mx-auto px-4 lg:px-8">
          <div className=" py-14 ">
            <div className="rounded-3xl border border-black/10 bg-white p-6 ">
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
