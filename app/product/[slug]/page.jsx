"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/utils/api";
import { extractProductReviews } from "@/utils/reviews";
import ProductCard from "@/components/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  RotateCcwIcon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [previewZoom, setPreviewZoom] = useState(1);
  const ingredientsRef = useRef(null);
  const [reviewPreview, setReviewPreview] = useState(null);

  useEffect(() => {
    const load = async () => {
      const safeSlug = Array.isArray(slug) ? slug[0] : slug;
      setError("");
      try {
        const [prod, reviewRes] = await Promise.all([
          apiFetch(`/products/${encodeURIComponent(safeSlug)}`),
          apiFetch(
            `/products/${encodeURIComponent(safeSlug)}/reviews?page=1&limit=10`,
          ).catch(() => null),
        ]);
        if (!prod || !prod.id) {
          throw new Error("Product not found.");
        }
        const normalized = {
          ...prod,
          tag_line_1: prod.tag_line_1 || prod.tag_line || "",
          tag_line_2: prod.tag_line_2 || prod.short_description || "",
          images: Array.isArray(prod.images) ? prod.images : [],
          ingredients_list: Array.isArray(prod.ingredients_list)
            ? prod.ingredients_list
            : [],
          variants: Array.isArray(prod.variants) ? prod.variants : [],
          reviews: prod.reviews || {},
          oldPrice: prod.compare_price,
        };

        const imageList = normalized.images || [];
        setImages(imageList);
        setActiveImage(0);

        const variantList = normalized.variants || [];
        setVariants(variantList);
        const defaultVariant =
          variantList.find((v) => v.id === normalized.default_variant_id) ||
          variantList.find((v) => v.is_default) ||
          variantList[0] ||
          null;
        setSelectedVariant(defaultVariant);

        const parsedReviews = extractProductReviews(
          reviewRes || normalized.reviews || {},
        );
        const displayReviews = parsedReviews.items;
        const reviewSummary = parsedReviews.summary || {};
        setProduct({
          ...normalized,
          reviews: {
            ...reviewSummary,
            average_rating:
              reviewSummary.average_rating ??
              reviewSummary.rating ??
              (displayReviews.length
                ? displayReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
                  displayReviews.length
                : 0),
            count:
              reviewSummary.total_reviews ??
              reviewSummary.count ??
              displayReviews.length ??
              0,
          },
        });
        setReviews(displayReviews);
      } catch (err) {
        setError(err?.message || "Product not found.");
        setProduct(null);
        setImages([]);
        setActiveImage(0);
        setVariants([]);
        setSelectedVariant(null);
        setReviews([]);
      }
    };
    if (slug) load();
  }, [slug]);

  const avgRating = useMemo(() => {
    if (product?.reviews?.average_rating) return product.reviews.average_rating;
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    return total / reviews.length;
  }, [product, reviews]);

  const fullStars = Math.max(0, Math.min(5, Math.round(avgRating)));
  const ratingStats = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      const score = Math.round(r.rating || 0);
      if (score >= 1 && score <= 5) counts[score - 1] += 1;
    });
    const totalReviews =
      Number.isFinite(product?.reviews?.count) && product.reviews.count >= 0
        ? product.reviews.count
        : reviews.length;
    const total = totalReviews || 1;
    const percents = counts.map((c) => Math.round((c / total) * 100));
    return { counts, percents, totalReviews };
  }, [product, reviews]);

  const getWeightMeta = (variant) => {
    if (!variant) return null;
    const gramsFromData =
      Number(variant.weight_g) ||
      (Number(variant.weight) ? Number(variant.weight) : null);
    if (Number.isFinite(gramsFromData) && gramsFromData > 0) {
      const label =
        gramsFromData >= 1000 && gramsFromData % 1000 === 0
          ? `${gramsFromData / 1000}kg`
          : `${gramsFromData}g`;
      const cups = Math.round(gramsFromData * 0.5);
      return { label, cups };
    }
    const weightText = String(variant.weight || "");
    const weightMatch = weightText.match(/(\d+(?:\.\d+)?)\s*(kg|g)\b/i);
    if (weightMatch) {
      const value = parseFloat(weightMatch[1]);
      const unit = weightMatch[2].toLowerCase();
      const grams =
        unit === "kg" ? Math.round(value * 1000) : Math.round(value);
      if (grams > 0) {
        const label =
          grams >= 1000 && grams % 1000 === 0
            ? `${grams / 1000}kg`
            : `${grams}g`;
        const cups = Math.round(grams * 0.5);
        return { label, cups };
      }
    }
    const name = String(variant.variant_name || variant.name || "");
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
    try {
      const cart = await apiFetch("/cart");
      const cartItems = Array.isArray(cart?.items) ? cart.items : [];
      const targetVariantId = Number(selectedVariant?.id);
      const alreadyInCart = cartItems.some((item) => {
        const itemVariantId = Number(item?.variant_id || item?.variant?.id);
        if (
          Number.isFinite(itemVariantId) &&
          Number.isFinite(targetVariantId)
        ) {
          return itemVariantId === targetVariantId;
        }
        return (
          item.product_name === product?.name &&
          (item.variant_name || item?.variant?.variant_name || "") ===
            (selectedVariant?.variant_name || selectedVariant?.name || "")
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
          variant_id: selectedVariant.id,
          quantity: safeQty,
        }),
      });
      const current = Number(localStorage.getItem("cart_count")) || 0;
      localStorage.setItem("cart_count", String(current + safeQty));
      window.dispatchEvent(new Event("cartchange"));
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: { message: "Added to cart.", type: "success" },
        }),
      );
    } catch (err) {
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: { message: "Please login first.", type: "error" },
        }),
      );
    }
  };

  const mainImage =
    images[activeImage]?.image_url || images[0]?.image_url || "";
  const previewImage =
    previewIndex !== null ? images[previewIndex]?.image_url : "";
  const isPreviewOpen = previewIndex !== null && Boolean(previewImage);
  const reviewImages = reviewPreview?.images || [];

  const openPreview = (index = activeImage) => {
    if (!images.length) return;
    const safeIndex = Math.max(0, Math.min(index, images.length - 1));
    setPreviewIndex(safeIndex);
    setPreviewZoom(1);
  };

  const closePreview = () => {
    setPreviewIndex(null);
    setPreviewZoom(1);
  };

  const showPreviewImage = (index) => {
    if (!images.length) return;
    const nextIndex = (index + images.length) % images.length;
    setPreviewIndex(nextIndex);
    setActiveImage(nextIndex);
    setPreviewZoom(1);
  };

  const handlePrevPreview = () => {
    if (previewIndex === null) return;
    showPreviewImage(previewIndex - 1);
  };

  const handleNextPreview = () => {
    if (previewIndex === null) return;
    showPreviewImage(previewIndex + 1);
  };

  const zoomPreview = (step) => {
    setPreviewZoom((current) => {
      const next = Math.round((current + step) * 100) / 100;
      return Math.max(1, Math.min(3, next));
    });
  };

  const handleOpenReviewPreview = (images, index) => {
    if (!images?.length) return;
    setReviewPreview({ images, index });
  };

  const handlePrevReviewPreview = () => {
    if (!reviewImages.length) return;
    setReviewPreview((prev) => {
      if (!prev) return prev;
      const nextIndex =
        (prev.index - 1 + prev.images.length) % prev.images.length;
      return { ...prev, index: nextIndex };
    });
  };

  const handleNextReviewPreview = () => {
    if (!reviewImages.length) return;
    setReviewPreview((prev) => {
      if (!prev) return prev;
      const nextIndex = (prev.index + 1) % prev.images.length;
      return { ...prev, index: nextIndex };
    });
  };

  const productBrewingRituals = selectedVariant?.brewing_rituals?.length
    ? selectedVariant.brewing_rituals
    : product?.brewing_rituals || [];
  const findRitualGroup = (matcher) =>
    productBrewingRituals.find((group) => {
      const key = String(group?.key || "").toLowerCase();
      const title = String(group?.title || "").toLowerCase();
      return matcher(key, title);
    });
  const hotGroup = findRitualGroup(
    (key, title) => key.includes("hot") || title.includes("hot"),
  );
  const icedGroup = findRitualGroup(
    (key, title) =>
      key.includes("iced") ||
      key.includes("cold") ||
      title.includes("iced") ||
      title.includes("cold"),
  );
  const hotRitualItems = hotGroup?.items || [];
  const icedRitualItems = icedGroup?.items || [];
  const hasRituals = productBrewingRituals.length > 0;

  const ingredients =
    product?.ingredients_list?.length > 0
      ? product.ingredients_list.map((item, index) => ({
          id: `ing-${index}-${item.name || "ingredient"}`,
          name: item.name || "Ingredient",
          image: item.image_url || "",
        }))
      : [];
  const useIngredientSwiper = ingredients.length > 1;

  const discoverMore = (
    product?.related_products ||
    product?.recommended_products ||
    []
  ).slice(0, 4);

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
            {error || "Loading product details..."}
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} image preview`}
          >
            <button
              type="button"
              onClick={closePreview}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Close preview"
            >
              <XIcon className="h-5 w-5" />
            </button>

            <div className="relative flex h-[82vh] w-full max-w-6xl flex-col overflow-hidden rounded-sm bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-black/10 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-black">
                    {product.name}
                  </p>
                  <p className="text-xs text-black/50">
                    Image {(previewIndex ?? 0) + 1} of {images.length}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => zoomPreview(-0.25)}
                    disabled={previewZoom <= 1}
                    className="flex h-10 w-10 items-center justify-center rounded-sm border border-black/10 text-black/70 transition hover:border-black/30 disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Zoom out"
                  >
                    <ZoomOutIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewZoom(1)}
                    disabled={previewZoom === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-sm border border-black/10 text-black/70 transition hover:border-black/30 disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Reset zoom"
                  >
                    <RotateCcwIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => zoomPreview(0.25)}
                    disabled={previewZoom >= 3}
                    className="flex h-10 w-10 items-center justify-center rounded-sm border border-black/10 text-black/70 transition hover:border-black/30 disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Zoom in"
                  >
                    <ZoomInIcon className="h-4 w-4" />
                  </button>
                  <span className="hidden w-14 text-right text-xs text-black/50 sm:block">
                    {Math.round(previewZoom * 100)}%
                  </span>
                </div>
              </div>

              <div className="relative min-h-0 flex-1 overflow-auto bg-gray-50">
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevPreview}
                      className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/90 text-black shadow-sm transition hover:border-black/30"
                      aria-label="Previous image"
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextPreview}
                      className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/90 text-black shadow-sm transition hover:border-black/30"
                      aria-label="Next image"
                    >
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </>
                )}

                <div className="flex min-h-full items-center justify-center p-6">
                  <img
                    src={previewImage}
                    alt={`${product.name} preview`}
                    className="max-h-[68vh] max-w-full object-contain transition-transform duration-200"
                    style={{
                      transform: `scale(${previewZoom})`,
                      transformOrigin: "center",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {reviewPreview && reviewImages.length > 0 && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Customer review image preview"
          >
            <button
              type="button"
              onClick={() => setReviewPreview(null)}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Close review image preview"
            >
              <XIcon className="h-5 w-5" />
            </button>

            <div className="relative flex h-[82vh] w-full max-w-5xl items-center justify-center overflow-hidden rounded-sm bg-white p-4">
              {reviewImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevReviewPreview}
                    className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/90 text-black shadow-sm transition hover:border-black/30"
                    aria-label="Previous review image"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextReviewPreview}
                    className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/90 text-black shadow-sm transition hover:border-black/30"
                    aria-label="Next review image"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </>
              )}

              <img
                src={reviewImages[reviewPreview.index]}
                alt={`Customer review image ${reviewPreview.index + 1}`}
                className="max-h-full max-w-full object-contain"
              />
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

        <section className="relative overflow-hidden mx-auto px-4 lg:px-8">
          <div className="container pt-4 pb-12 lg:pb-16 grid gap-8 lg:gap-10  grid-cols-1 lg:grid-cols-7">
            <div className="order-1 lg:order-2 lg:col-span-3">
              <div className="py-4 sm:py-6">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={product.name}
                    onClick={() => openPreview(activeImage)}
                    className="h-[260px] w-full rounded-sm object-contain sm:h-[360px] lg:h-[420px] lg:object-cover cursor-pointer"
                  />
                ) : (
                  <div className="flex h-[260px] sm:h-[360px] lg:h-[420px] items-center justify-center text-sm text-black/50">
                    No image available
                  </div>
                )}
              </div>
              <div className="order-2 flex gap-3 overflow-x-auto pb-2 lg:order-1 lg:justify-between lg:overflow-visible lg:pb-0">
                {images.map((img, i) => (
                  <button
                    key={img.id ?? i}
                    onClick={() => setActiveImage(i)}
                    className={`h-22 w-22 sm:h-22 sm:w-22 shrink-0 overflow-hidden rounded-sm border bg-white transition cursor-pointer ${
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
            </div>

            <div className="order-3 lg:col-span-4">
              {(product.tag_line_1 || product.tag_line) && (
                <div className="w-fit px-4 py-1 mt-4 text-sm bg-[#FFF1C3] text-yellow-600 uppercase tracking-[0.05em] rounded-sm">
                  {product.tag_line_1 || product.tag_line}
                </div>
              )}
              <h1
                className="text-4xl leading-tight lg:text-5xl uppercase tracking-[0.02em] mt-3 text-[#1c2230]"
                style={{ fontFamily: "var(--font-basker)" }}
              >
                {product.name}
              </h1>
              {(product.tag_line_2 || product.short_description) && (
                <p className="mt-3 text-sm text-black uppercase tracking-[0.05em] ">
                  {product.tag_line_2 || product.short_description}
                </p>
              )}

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
                  {selectedVariant?.formatted_price ||
                  selectedVariant?.price ? (
                    <>
                      ₹{" "}
                      {selectedVariant?.formatted_price ??
                        selectedVariant?.price}
                    </>
                  ) : (
                    ""
                  )}
                </div>
                {(selectedVariant?.formatted_discount_price ??
                  selectedVariant?.discount_price) && (
                  <div className="text-lg text-[#1c2230]/40 line-through">
                    ₹{" "}
                    {selectedVariant?.formatted_discount_price ??
                      selectedVariant?.discount_price}
                  </div>
                )}
              </div>

              {variants.length > 0 && (
                <div className="mt-8 ">
                  <p className="text-sm uppercase tracking-[0.08em] text-black/70">
                    Net Quantity
                  </p>

                  <div className="flex flex-wrap gap-3 mt-3">
                    {variants.map((v) =>
                      (() => {
                        const weightMeta = getWeightMeta(v);
                        const primaryLabel =
                          weightMeta?.label || v.variant_name;
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
              )}

              <div className="mt-6 flex w-full flex-col gap-4">
                <div className="flex w-full items-center justify-between gap-4 sm:justify-start">
                  <p className="text-sm uppercase tracking-[0.08em] text-black/70">
                    Quantity
                  </p>
                  <div className="flex shrink-0 items-center gap-3 rounded-sm border border-black/10 bg-white px-4 py-3">
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
                        setQuantity(
                          Number.isFinite(next) && next > 0 ? next : 1,
                        );
                      }}
                      className="w-10 bg-transparent border-x border-black/10 text-center text-sm outline-none sm:w-14"
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
                </div>
                {selectedVariant && (
                  <button
                    onClick={addToCart}
                    className="w-full rounded-sm whitespace-nowrap bg-gradient-to-r from-[#7a8177] to-[#6a716a] px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:from-[#5f665e] hover:to-[#525a53] cursor-pointer sm:w-fit md:w-full"
                  >
                    Add to cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className=" container mx-auto px-4 lg:px-8 border-t border-black/10 bg-white">
          <div className=" py-14">
            {product.description && (
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
            )}

            {hasRituals && (
              <div className="space-y-6 mt-10 lg:mt-14">
                <h3 className="text-2xl lg:text-3xl font-semibold">
                  Brewing Rituals
                </h3>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
                  {hotRitualItems.length > 0 && (
                    <div className="w-full rounded-sm bg-gray-50 p-5 text-black">
                      <h4 className="text-lg font-semibold">
                        {hotGroup?.title || "Hot Brew"}
                      </h4>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        {hotRitualItems.map((item, index) => (
                          <div
                            key={`hot-ritual-${index}`}
                            className="flex min-w-0 items-center gap-3 text-sm sm:text-base text-black"
                          >
                            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white">
                              <img
                                src={item.image_url || item.image}
                                alt={
                                  item.text || item.description || "Hot ritual"
                                }
                                className="h-10 w-10 object-contain"
                              />
                            </span>
                            <span className="min-w-0 flex-1 whitespace-normal break-words leading-relaxed">
                              {item.text || item.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {icedRitualItems.length > 0 && (
                    <div className="w-full rounded-sm bg-gray-50 p-5 text-black">
                      <h4 className="text-lg font-semibold">
                        {icedGroup?.title || "Iced Brew"}
                      </h4>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        {icedRitualItems.map((item, index) => (
                          <div
                            key={`iced-ritual-${index}`}
                            className="flex min-w-0 items-center gap-3 text-sm sm:text-base text-black"
                          >
                            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white">
                              <img
                                src={item.image_url || item.image}
                                alt={
                                  item.text || item.description || "Iced ritual"
                                }
                                className="h-10 w-10 object-contain"
                              />
                            </span>
                            <span className="min-w-0 flex-1 whitespace-normal break-words leading-relaxed">
                              {item.text || item.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {ingredients.length > 0 && (
              <div className="space-y-4 mt-10 lg:mt-14">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl lg:text-3xl font-semibold">
                    Ingredients
                  </h3>
                </div>

                <div className="hidden grid-cols-2 gap-5 sm:grid-cols-3 lg:grid xl:grid-cols-4">
                  {ingredients.map((item) => (
                    <div key={`desktop-${item.id}`} className="rounded-sm">
                      <div className="flex aspect-square items-center justify-center ">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-contain rounded-sm"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-black/40">
                            No image
                          </div>
                        )}
                      </div>
                      <p className="mt-4 text-sm font-medium uppercase tracking-[0.08em] text-black">
                        {item.name}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2 lg:hidden">
                  <button
                    type="button"
                    onClick={() => ingredientsRef.current?.slidePrev()}
                    className="h-10 w-fit text-black/60 cursor-pointer"
                    aria-label="Scroll ingredients left"
                    disabled={!useIngredientSwiper}
                  >
                    <ChevronLeftIcon />
                  </button>
                  {useIngredientSwiper ? (
                    <Swiper
                      modules={[Navigation]}
                      slidesPerView={1.2}
                      spaceBetween={16}
                      navigation={false}
                      pagination={{ clickable: true }}
                      scrollbar={{ draggable: true }}
                      loop={ingredients.length > 4}
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
                      className="min-w-0 flex-1 pb-6"
                    >
                      {ingredients.map((item) => (
                        <SwiperSlide key={item.id}>
                          <div className="w-full mr-0">
                            <div className="w-full aspect-square">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-contain rounded-sm"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-black/40">
                                  No image
                                </div>
                              )}
                            </div>
                            <p className="mt-3 text-sm uppercase tracking-[0.08em] text-black">
                              {item.name}
                            </p>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <div className="flex flex-1 flex-wrap gap-4 pb-6">
                      {ingredients.map((item) => (
                        <div key={item.id} className="w-[160px]">
                          <div className="w-full aspect-square p-4">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-contain rounded-sm"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center rounded-sm border border-black/10 bg-white text-xs text-black/40">
                                No image
                              </div>
                            )}
                          </div>
                          <p className="ms-4 text-sm uppercase tracking-[0.08em] text-black">
                            {item.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => ingredientsRef.current?.slideNext()}
                    className="h-10 w-fit text-black/60 cursor-pointer"
                    aria-label="Scroll ingredients right"
                    disabled={!useIngredientSwiper}
                  >
                    <ChevronRightIcon />
                  </button>
                </div>
              </div>
            )}

            {product?.faqs?.length > 0 && (
              <div className="mt-12">
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl lg:text-3xl font-semibold">FAQs</h3>
                  <p className="text-sm text-black/60">
                    Answers to the most common questions about this tea.
                  </p>
                </div>
                <div className="mt-6 divide-y divide-black/10 rounded-sm border border-black/10 bg-white">
                  {product.faqs.map((faq, index) => (
                    <details key={`faq-${index}`} className="group p-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-black transition">
                        <span>{faq.question}</span>
                        <span className="text-black/40 transition group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="mt-3 text-sm text-black/70">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {discoverMore.length > 0 && (
              <div className="space-y-6 mt-10">
                <div className="flex items-center justify-between">
                  <h3
                    className="text-2xl lg:text-3xl font-semibold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Discover More
                  </h3>
                  <Link
                    href="/shop"
                    className="text-xs uppercase tracking-[0.08em] text-black/60"
                  >
                    View all
                  </Link>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {discoverMore.map((item) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className=" bg-white border-t border-black/10 container mx-auto px-4 lg:px-8">
          <div className=" py-14 ">
            <div className="rounded-3xl">
              <h3
                className="text-2xl lg:text-3xl font-semibold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Customer reviews
              </h3>

              <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
                <div className="rounded-sm h-fit border border-black/10 bg-white p-5">
                  <div className="text-4xl font-semibold text-[#1c2230]">
                    {avgRating.toFixed(1)}
                    <span className="text-base text-black/50"> / 5</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <svg
                        key={`avg-breakdown-${index}`}
                        width="18"
                        height="18"
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
                  <p className="mt-2 text-sm text-black/60">
                    {ratingStats.totalReviews} global ratings
                  </p>

                  <div className="mt-6 space-y-3">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const index = star - 1;
                      const percent = ratingStats.percents[index] ?? 0;
                      const count = ratingStats.counts[index] ?? 0;
                      return (
                        <div
                          key={`rating-${star}`}
                          className="grid grid-cols-[30px_1fr_40px] items-center gap-3 text-xs text-black/60"
                        >
                          <span>{star}★</span>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-black/10">
                            <div
                              className="h-full rounded-full bg-[#1c2230]"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>

                  <Link
                    href="/user/orders"
                    className="mt-6 inline-flex w-full justify-center rounded-sm border border-black/20 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-black/80 transition hover:border-black/40"
                  >
                    Review delivered orders
                  </Link>
                </div>

                <div className="space-y-5">
                  {reviews.length === 0 && (
                    <p className="text-sm text-black/50">
                      Share your first sip and review this tea.
                    </p>
                  )}
                  {reviews.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-sm border border-black/10 bg-white p-5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-sm font-semibold text-black/60">
                          {(r.name || "Customer").slice(0, 1)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-black">
                            {r.name || "Customer"}
                          </p>
                          <p className="text-xs text-black/60">
                            {r.location ? `Reviewed in ${r.location}` : ""}
                            {r.date ? ` on ${r.date}` : ""}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <svg
                              key={`review-${r.id}-star-${index}`}
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill={
                                index < (r.rating || 0)
                                  ? "currentColor"
                                  : "none"
                              }
                              className={`h-4 w-4 ${index < (r.rating || 0) ? "text-[#1c2230]" : "text-[#1c2230]/30"}`}
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
                        {r.title && (
                          <span className="text-sm font-semibold text-black">
                            {r.title}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-black/70">
                        {r.flavor && <span>Flavour Name: {r.flavor}</span>}
                        {r.variant && <span>| Size: {r.variant}</span>}
                      </div>

                      <p className="mt-3 text-sm text-black/90">{r.review}</p>

                      {Array.isArray(r.images) && r.images.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-3">
                          {r.images.map((img, index) => (
                            <button
                              key={`${r.id}-img-${index}`}
                              type="button"
                              onClick={() =>
                                handleOpenReviewPreview(r.images, index)
                              }
                              className="h-20 w-20 overflow-hidden rounded-sm border border-black/10 bg-white cursor-pointer"
                              aria-label={`Open review image ${index + 1}`}
                            >
                              <img
                                src={img}
                                alt={`Customer review ${index + 1}`}
                                className="h-full w-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
