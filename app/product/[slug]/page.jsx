"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Thumbs } from "swiper/modules";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Truck,
  UserRound,
  X,
} from "lucide-react";

import ProductCard from "@/components/ProductCard";
import { apiFetch } from "@/utils/api";
import {
  extractProductItems,
  normalizeProductImages,
  normalizeProductListItem,
} from "@/utils/products";
import { extractProductReviews } from "@/utils/reviews";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

const stripMarkup = (value = "") =>
  String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const weightMeta = (variant) => {
  const source = `${variant?.weight || ""} ${
    variant?.variant_name || variant?.name || ""
  }`;
  const directWeight = Number(variant?.weight_g);
  let grams =
    Number.isFinite(directWeight) && directWeight > 0 ? directWeight : null;

  if (!grams) {
    const match = source.match(/(\d+(?:\.\d+)?)\s*(kg|g)\b/i);
    if (match) {
      grams = Number(match[1]) * (match[2].toLowerCase() === "kg" ? 1000 : 1);
    }
  }

  if (!grams)
    return {
      label: variant?.variant_name || variant?.name || "Option",
      cups: null,
    };

  return {
    label:
      grams >= 1000 && grams % 1000 === 0 ? `${grams / 1000}kg` : `${grams}g`,
    cups: Math.round(grams * 0.5),
  };
};

function Stars({ value = 0, size = 17 }) {
  const rounded = Math.max(0, Math.min(5, Math.round(Number(value) || 0)));

  return (
    <span
      className="flex items-center gap-[2px]"
      aria-label={`${Number(value || 0).toFixed(1)} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <img
          key={index}
          src={
            index < rounded ? "/icons/starfill.svg" : "/icons/Starborder.svg"
          }
          alt=""
          width={size}
          height={size}
          className="shrink-0"
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function ProductTabs({ product, selectedVariant }) {
  const [activeTab, setActiveTab] = useState("description");
  const rituals = selectedVariant?.brewing_rituals?.length
    ? selectedVariant.brewing_rituals
    : product.brewing_rituals || [];
  const ingredients = product.ingredients;

  const tabs = [
    { id: "description", label: "Description" },
    { id: "information", label: "Additional information" },
    { id: "rituals", label: "Brewing Rituals" },
    { id: "ingredients", label: "Ingredients" },
  ];

  return (
    <section className=" bg-white">
      <div className="site-container py-8 lg:py-10">
        <div className="product-tabs__list flex gap-8 overflow-x-auto sm:justify-between">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative shrink-0 pb-3 text-base font-semibold sm:text-[28px] ${
                activeTab === tab.id ? "text-[#3f532b]" : "text-[#999c96]"
              }`}
            >
              {tab.label}
              {activeTab === tab.id ? (
                <span className="absolute inset-x-0 bottom-0 z-10 h-0.5 bg-[#52653b]" />
              ) : null}
            </button>
          ))}
        </div>

        <div className="min-h-[92px] pt-6 text-base leading-[1.65] text-[#30342e] sm:text-md">
          {activeTab === "description" ? (
            <p>
              {stripMarkup(product.description) || "Description coming soon."}
            </p>
          ) : null}

          {activeTab === "information" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <p>
                <span className="font-semibold">Product:</span> {product.name}
              </p>
              <p>
                <span className="font-semibold">Selected size:</span>{" "}
                {weightMeta(selectedVariant).label}
              </p>
              {product.category?.name ? (
                <p>
                  <span className="font-semibold">Category:</span>{" "}
                  {product.category.name}
                </p>
              ) : null}
              {product.caffeine || product.caffeine_level ? (
                <p>
                  <span className="font-semibold">Caffeine:</span>{" "}
                  {product.caffeine || product.caffeine_level}
                </p>
              ) : null}
              {product.collection ? (
                <p>
                  <span className="font-semibold">Collection:</span>{" "}
                  {Array.isArray(product.collection)
                    ? product.collection.join(", ")
                    : product.collection}
                </p>
              ) : null}
              {selectedVariant?.sku ? (
                <p>
                  <span className="font-semibold">SKU:</span>{" "}
                  {selectedVariant.sku}
                </p>
              ) : null}
              {selectedVariant?.item_form ? (
                <p>
                  <span className="font-semibold">Item form:</span>{" "}
                  {selectedVariant.item_form}
                </p>
              ) : null}
              {selectedVariant?.product_dimension ? (
                <p>
                  <span className="font-semibold">Dimensions:</span>{" "}
                  {selectedVariant.product_dimension}
                </p>
              ) : null}
            </div>
          ) : null}

          {activeTab === "rituals" ? (
            rituals.length ? (
              <div className="space-y-6">
                {rituals.map((group, groupIndex) => (
                  <div key={`${group.key || "ritual"}-${groupIndex}`}>
                    <h3 className="font-semibold text-[#252923]">
                      {group.title || "Brewing ritual"}
                    </h3>
                    <div className="mt-0.5 space-y-0 leading-[1.35]">
                      {(group.items || []).map((item, index) => (
                        <p key={index}>
                          {item.label && item.value
                            ? `${item.label} : ${item.value}`
                            : item.text ||
                              item.description ||
                              item.value ||
                              item.label}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
                {product.brewing_rituals_note ? (
                  <p className="italic text-[#4f544c]">
                    <span className="uppercase">Note :</span>{" "}
                    {product.brewing_rituals_note}
                  </p>
                ) : null}
              </div>
            ) : (
              <p>Brewing guidance is coming soon.</p>
            )
          ) : null}

          {activeTab === "ingredients" ? (
            ingredients.length ? (
              <div className="flex flex-wrap gap-6">
                <p className="font-medium">{ingredients}</p>
              </div>
            ) : (
              <p>Ingredient details are coming soon.</p>
            )
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Queries({ faqs }) {
  const [openQueryIndex, setOpenQueryIndex] = useState(null);

  if (!faqs?.length) return null;

  return (
    <section className="bg-[#f6f8f2]">
      <div className="site-container py-11 lg:py-14">
        <h2 className="text-[28px] font-semibold text-[#344823]">
          Your Queries
        </h2>
        <div className="mt-7 divide-y divide-[#dfe2da]">
          {faqs.map((faq, index) => (
            <div key={index} className="py-4">
              <button
                type="button"
                aria-controls={`query-answer-${index}`}
                onClick={() =>
                  setOpenQueryIndex((current) =>
                    current === index ? null : index,
                  )
                }
                className="flex w-full items-center justify-between gap-4 text-left text-base text-[#252923]"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition ${
                    openQueryIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openQueryIndex === index ? (
                <p
                  id={`query-answer-${index}`}
                  className="max-w-4xl pt-3 text-base leading-6 text-[#62675e]"
                >
                  {faq.answer}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews({ reviews, average, total, ratingCounts }) {
  const [gallery, setGallery] = useState(null);

  const counts = useMemo(() => {
    const result = [0, 0, 0, 0, 0];

    const hasSummaryCounts =
      ratingCounts &&
      typeof ratingCounts === "object" &&
      [1, 2, 3, 4, 5].some((star) =>
        Object.prototype.hasOwnProperty.call(ratingCounts, `${star}_star`),
      );

    if (hasSummaryCounts) {
      [1, 2, 3, 4, 5].forEach((star) => {
        result[star - 1] = Number(ratingCounts[`${star}_star`] || 0);
      });
      return result;
    }

    reviews.forEach((review) => {
      const rating = Math.max(1, Math.min(5, Math.round(review.rating || 0)));
      result[rating - 1] += 1;
    });
    return result;
  }, [ratingCounts, reviews]);

  useEffect(() => {
    if (!gallery) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setGallery(null);
      if (event.key === "ArrowLeft") {
        setGallery((current) =>
          current
            ? {
                ...current,
                index:
                  (current.index - 1 + current.images.length) %
                  current.images.length,
              }
            : current,
        );
      }
      if (event.key === "ArrowRight") {
        setGallery((current) =>
          current
            ? {
                ...current,
                index: (current.index + 1) % current.images.length,
              }
            : current,
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gallery]);

  const showPreviousImage = () => {
    setGallery((current) =>
      current
        ? {
            ...current,
            index:
              (current.index - 1 + current.images.length) %
              current.images.length,
          }
        : current,
    );
  };

  const showNextImage = () => {
    setGallery((current) =>
      current
        ? {
            ...current,
            index: (current.index + 1) % current.images.length,
          }
        : current,
    );
  };

  return (
    <>
      {gallery
        ? createPortal(
            <div
              className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4 sm:p-8"
              role="dialog"
              aria-modal="true"
              aria-label="Customer review image gallery"
              onClick={() => setGallery(null)}
            >
              <div
                className="relative flex h-full w-full max-w-6xl flex-col items-center justify-center"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setGallery(null)}
                  className="absolute right-0 top-0 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black"
                  aria-label="Close review image gallery"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex h-0 min-h-0 w-full flex-1 items-center justify-center px-12 sm:px-16">
                  <img
                    src={gallery.images[gallery.index]}
                    alt={`Customer review image ${gallery.index + 1}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {gallery.images.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={showPreviousImage}
                      className="absolute left-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black"
                      aria-label="Previous review image"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      type="button"
                      onClick={showNextImage}
                      className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black"
                      aria-label="Next review image"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                ) : null}

                <p className="mt-4 text-base text-white">
                  {gallery.index + 1} / {gallery.images.length}
                </p>

                {gallery.images.length > 1 ? (
                  <div className="mt-3 flex max-w-full gap-2 overflow-x-auto pb-1">
                    {gallery.images.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() =>
                          setGallery((current) =>
                            current ? { ...current, index } : current,
                          )
                        }
                        className={`h-14 w-14 shrink-0 overflow-hidden border-2 ${
                          gallery.index === index
                            ? "border-white"
                            : "border-transparent opacity-60"
                        }`}
                        aria-label={`Show review image ${index + 1}`}
                      >
                        <img
                          src={image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>,
            document.body,
          )
        : null}

      <section className="bg-white">
        <div className="site-container pb-14 lg:pb-20">
          <h2 className="text-[28px] font-semibold text-[#344823]">
            Customer Reviews
          </h2>

          <div className="mt-7 grid items-center gap-8 border-b border-[#dfe2da] pb-8 lg:grid-cols-[260px_1fr_250px]">
            <div className="lg:border-r lg:border-[#e1e3dd] lg:pr-8">
              <Stars value={average} size={18} />
              <p className="mt-3 text-lg">
                {Number(average || 0).toFixed(2)} out of 5
              </p>
              <p className="text-base text-[#62675e]">
                Based on {total} reviews
              </p>
            </div>

            <div className="space-y-1 lg:px-8">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = counts[star - 1];
                const percent = total ? Math.round((count / total) * 100) : 0;
                return (
                  <div
                    key={star}
                    className="grid grid-cols-[92px_1fr_34px] items-center gap-3 text-md"
                  >
                    <Stars value={star} size={14} />
                    <div className="h-3 bg-[#dedfda]">
                      <div
                        className="h-full bg-[#91a079]"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span>{count}</span>
                  </div>
                );
              })}
            </div>

            <Link
              href="/user/orders"
              className="flex h-11 items-center justify-center border border-[#788863] px-6 text-md text-[#52633d] transition hover:bg-[#f1f4ec]"
            >
              Write a review
            </Link>
          </div>

          <div className="border-b border-[#e1e3dd] py-4 text-md text-[#4a5540]">
            Most Recent <ChevronDown className="ml-1 inline h-5 w-5" />
          </div>

          {reviews.length ? (
            <div className="divide-y divide-[#e1e3dd]">
              {reviews.map((review) => (
                <article key={review.id} className="py-7 text-base">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center bg-[#f4f5f1]">
                        <UserRound className="h-5 w-5" />
                      </span>
                      <div>
                        <Stars value={review.rating} size={14} />
                        <p className="mt-1 font-medium">
                          {review.name || "Customer"}
                        </p>
                      </div>
                    </div>
                    <time className="text-md text-[#8d9089]">
                      {review.date || ""}
                    </time>
                  </div>
                  {review.title ? (
                    <h3 className="mt-4 font-semibold">{review.title}</h3>
                  ) : null}
                  <p className="mt-2 leading-6 text-[#353934]">
                    {review.review}
                  </p>
                  {review.images?.length ? (
                    <div className="mt-4 flex gap-3">
                      {review.images.map((image, index) => (
                        <button
                          key={`${review.id}-${index}`}
                          type="button"
                          onClick={() =>
                            setGallery({ images: review.images, index })
                          }
                          className="h-20 w-20 overflow-hidden"
                          aria-label={`Open review image ${index + 1} from ${
                            review.name || "Customer"
                          }`}
                        >
                          <img
                            src={image}
                            alt="Customer review"
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <p className="py-8 text-base text-[#73776f]">
              No customer reviews yet. Be the first to review this blend.
            </p>
          )}
        </div>
      </section>
    </>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [gallerySwiper, setGallerySwiper] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    let active = true;
    const safeSlug = Array.isArray(slug) ? slug[0] : slug;

    const load = async () => {
      setError("");
      try {
        const [detail, reviewPayload, catalogPayload] = await Promise.all([
          apiFetch(`/products/${encodeURIComponent(safeSlug)}`),
          apiFetch(
            `/products/${encodeURIComponent(safeSlug)}/reviews?page=1&limit=10`,
          ).catch(() => null),
          apiFetch("/products?page=1&limit=8").catch(() => null),
        ]);
        if (!detail?.id) throw new Error("Product not found.");

        const normalizedImages = normalizeProductImages(detail);
        const normalizedVariants = Array.isArray(detail.variants)
          ? detail.variants
          : [];
        const defaultVariant =
          normalizedVariants.find(
            (variant) => variant.id === detail.default_variant_id,
          ) ||
          normalizedVariants.find((variant) => variant.is_default) ||
          normalizedVariants[0] ||
          null;
        const parsedReviews = extractProductReviews(
          reviewPayload || detail.reviews || {},
        );
        const related = Array.isArray(detail.related_products)
          ? detail.related_products
          : Array.isArray(detail.recommended_products)
            ? detail.recommended_products
            : [];
        const catalog = extractProductItems(catalogPayload);
        const suggested = (
          related.length
            ? related
            : catalog.filter((item) => item.id !== detail.id)
        )
          .slice(0, 4)
          .map(normalizeProductListItem);

        if (!active) return;
        setProduct({ ...detail, images: normalizedImages });
        setImages(normalizedImages);
        setVariants(normalizedVariants);
        setSelectedVariant(defaultVariant);
        setReviews(parsedReviews.items);
        setReviewSummary(parsedReviews.summary || {});
        setRecommendations(suggested);
        setActiveImage(0);
      } catch (loadError) {
        if (active) setError(loadError?.message || "Product not found.");
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [slug]);

  const averageRating =
    Number(
      reviewSummary.average_rating ??
        reviewSummary.rating ??
        product?.rating ??
        0,
    ) || 0;
  const totalReviews =
    Number(
      reviewSummary.total_reviews ??
        reviewSummary.count ??
        product?.rating_count ??
        product?.review_count ??
        reviews.length,
    ) || 0;
  const activeImageUrl = images[activeImage]?.image_url || null;
  const selectedDiscountPrice =
    selectedVariant?.formatted_discount_price ??
    selectedVariant?.discount_price ??
    product?.discount_price;
  const regularPrice =
    selectedVariant?.formatted_price ??
    selectedVariant?.price ??
    product?.price;
  const currentPrice = selectedDiscountPrice ?? regularPrice;
  const comparePrice = selectedDiscountPrice
    ? regularPrice
    : (selectedVariant?.compare_price ?? product?.compare_price);

  const addToCart = async () => {
    if (!selectedVariant) return;
    try {
      const cart = await apiFetch("/cart");
      const targetId = Number(selectedVariant.id);
      const exists = (Array.isArray(cart?.items) ? cart.items : []).some(
        (item) => Number(item.variant_id || item.variant?.id) === targetId,
      );
      if (exists) {
        window.dispatchEvent(
          new CustomEvent("toast", {
            detail: { message: "Product is already in cart.", type: "error" },
          }),
        );
        return;
      }
      await apiFetch("/cart", {
        method: "POST",
        body: JSON.stringify({ variant_id: selectedVariant.id, quantity }),
      });
      const count = Number(localStorage.getItem("cart_count")) || 0;
      localStorage.setItem("cart_count", String(count + quantity));
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

  if (!product) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-white pt-[90px] text-center">
        <div>
          <p className="font-basker text-2xl text-[#3f532b]">
            {error || "Loading product details…"}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white pt-[70px] text-[#252923]">
      {previewOpen && activeImageUrl ? (
        <div
          className="sticky w-screen h-screen inset-0 z-[100] flex items-center justify-center bg-black/85 p-3 sm:p-6 lg:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} image preview`}
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="relative flex h-fit w-fit max-h-[78vh] max-w-[90vw] items-center justify-center overflow-hidden rounded-md bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black sm:right-5 sm:top-5 sm:h-11 sm:w-11"
              aria-label="Close image preview"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={activeImageUrl}
              alt={product.name}
              className="block h-auto max-h-[78vh] w-auto max-w-[90vw] object-contain sm:max-w-[820px]"
            />
          </div>
        </div>
      ) : null}

      <section className="">
        <div className="site-container grid gap-9 py-12 lg:grid-cols-[minmax(0,600px)_minmax(0,1fr)] lg:gap-12 lg:py-[62px]">
          {images.length ? (
            <div className="grid min-w-0 gap-5 md:relative md:block md:aspect-[6/5]">
              <div className="relative aspect-square w-full min-h-0 max-w-full overflow-hidden rounded-md md:absolute md:inset-y-0 md:left-0 md:w-5/6 md:aspect-auto">
                {product.badge ? (
                  <span className="absolute left-4 top-4 z-10 bg-[#fff1bd] px-2 py-1 text-md text-[#b38700]">
                    {product.badge}
                  </span>
                ) : null}
                <Swiper
                  spaceBetween={10}
                  onSwiper={setGallerySwiper}
                  onSlideChange={(swiper) => setActiveImage(swiper.realIndex)}
                  thumbs={{
                    swiper:
                      thumbsSwiper && !thumbsSwiper.destroyed
                        ? thumbsSwiper
                        : null,
                  }}
                  modules={[FreeMode, Thumbs]}
                  className="!absolute !inset-0 !m-0 !h-full !w-full"
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={image.id || image.image_url || index}>
                      <button
                        type="button"
                        onClick={() => setPreviewOpen(true)}
                        className="block h-full w-full cursor-zoom-in"
                        aria-label={`Preview image ${index + 1} of ${product.name}`}
                      >
                        <img
                          src={image.image_url}
                          alt={`${product.name} image ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>
                {images.length > 1 ? (
                  <div className="absolute inset-x-3 bottom-3 z-20 flex items-center justify-between sm:inset-x-4 sm:bottom-4">
                    <button
                      type="button"
                      onClick={() => gallerySwiper?.slidePrev()}
                      disabled={activeImage === 0}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9"
                      aria-label="Previous product image"
                    >
                      <ChevronLeft className="h-6 w-6 text-[#52653b] sm:h-7 sm:w-7" />
                    </button>
                    <button
                      type="button"
                      onClick={() => gallerySwiper?.slideNext()}
                      disabled={activeImage === images.length - 1}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9"
                      aria-label="Next product image"
                    >
                      <ChevronRight className="h-6 w-6 text-[#52653b] sm:h-7 sm:w-7" />
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="relative aspect-[5/1] min-h-0 w-full overflow-hidden md:absolute md:inset-y-0 md:right-0 md:w-1/6 md:translate-x-2 md:aspect-auto">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={0}
                  slidesPerView={5}
                  breakpoints={{
                    768: { direction: "vertical", slidesPerView: 5 },
                  }}
                  freeMode
                  watchSlidesProgress
                  modules={[FreeMode, Thumbs]}
                  className="!absolute !inset-0 !m-0 !h-full !w-full"
                >
                  {images.map((image, index) => (
                    <SwiperSlide
                      key={`thumb-${image.id || image.image_url || index}`}
                      className="h-full overflow-hidden opacity-55 [&.swiper-slide-thumb-active]:opacity-100"
                    >
                      <img
                        src={image.image_url}
                        alt=""
                        className="h-full w-full rounded-sm object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-md border border-[#dfe2da] bg-white p-6 text-center text-base text-[#73776f]">
              Product images are unavailable.
            </div>
          )}

          <div className="lg:pl-4">
            {product.tag_line_1 || product.tag_line ? (
              <p className="inline bg-[#fff1bd] px-1.5 py-1 text-md text-[#b38700] rounded-sm">
                {product.tag_line_1 || product.tag_line}
              </p>
            ) : null}
            <h1 className="mt-4 font-basker text-4xl font-normal uppercase leading-none text-[#3f532b]">
              {product.name}
            </h1>
            {product.tag_line_2 || product.short_description ? (
              <p className="mt-3 text-md font-normal uppercase">
                {product.tag_line_2 || product.short_description}
              </p>
            ) : null}

            <div className="mt-6 flex items-center gap-2 border-b border-[#e0e3dc] pb-5">
              <Stars value={averageRating} />
              <span className="text-md text-[#7b7f77]">({totalReviews})</span>
            </div>
            {product.short_description ? (
              <p className="mt-5 line-clamp-3 text-base leading-[1.45]">
                {stripMarkup(product.short_description)}
              </p>
            ) : null}

            {variants.length ? (
              <div className="mt-6">
                <p className="text-base font-semibold">Net Weight</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {variants.map((variant) => {
                    const meta = weightMeta(variant);
                    const selected = selectedVariant?.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`min-w-[72px] rounded-md px-4 py-3 text-center ${
                          selected
                            ? "bg-[#647744] text-white"
                            : "border border-[#d7dad2] bg-white"
                        }`}
                      >
                        <span className="block text-[20px] text-base font-semibold">
                          {variant.name}
                        </span>
                        {variant.item_form ? (
                          <span className="mt-1 block text-[16px]">
                            {variant.item_form}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="mt-7 flex items-center gap-4 text-2xl">
              <span className="font-semibold">₹ {currentPrice}</span>
              {comparePrice && String(comparePrice) !== String(currentPrice) ? (
                <span className="text-[#73776f] line-through">
                  ₹ {comparePrice}
                </span>
              ) : null}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-base font-semibold">Quantity</p>
              <div className="grid h-8 grid-cols-3 border border-[#dfe2da] bg-white text-md">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="w-8"
                >
                  −
                </button>
                <input
                  aria-label="Quantity"
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(
                      Math.max(
                        1,
                        Number(event.target.value.replace(/\D/g, "")) || 1,
                      ),
                    )
                  }
                  className="w-9 border-x border-[#dfe2da] text-center outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((value) => value + 1)}
                  className="w-8"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={addToCart}
              disabled={!selectedVariant}
              className="mt-5 h-12 w-full bg-[#52653b] font-basker font-thin text-lg uppercase text-white transition hover:bg-[#6B7F42] disabled:opacity-50 cursor-pointer"
            >
              Add to cart
            </button>
            {/* <div className="mt-5 space-y-2 text-md text-[#455337]">
              <p className="flex items-center gap-2">
                <Truck className="h-4 w-4" /> Estimated delivery shown at
                checkout
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Enter your delivery address
                during checkout
              </p>
            </div> */}
          </div>
        </div>
      </section>

      <ProductTabs product={product} selectedVariant={selectedVariant} />
      <Queries faqs={product.faqs} />

      {recommendations.length ? (
        <section className="bg-white">
          <div className="site-container py-12 lg:py-16">
            <div className="flex items-center justify-between">
              <h2 className="font-basker text-[28px] uppercase">
                Discover More
              </h2>
              <div className="flex justify-center items-center gap-2">
                <Link
                  href="/shop"
                  className="text-md text-[#52633d] hover:underline underline-offset-3"
                >
                  View All
                </Link>
                <img
                  src="/icons/VectorRight.svg"
                  alt=""
                  className="h-3.5 w-2 object-contain"
                />
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recommendations.map((item) => (
                <ProductCard key={item.id} product={item} variant="homepage" />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Reviews
        reviews={reviews}
        average={averageRating}
        total={totalReviews}
        ratingCounts={reviewSummary.rating_counts}
      />
    </main>
  );
}
