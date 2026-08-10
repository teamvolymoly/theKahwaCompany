export const normalizeProductImages = (product = {}) => {
  const source = Array.isArray(product.images)
    ? product.images
    : product.images && typeof product.images === "object"
      ? Object.values(product.images)
      : [];

  return source
    .filter(Boolean)
    .map((image, index) =>
      typeof image === "string"
        ? { id: `${product.id || "product"}-${index}`, image_url: image }
        : image,
    )
    .filter((image) => image?.image_url);
};

export const normalizeProductListItem = (product = {}) => {
  const parsedRating = Number(product.rating);
  const parsedRatingCount = Number(
    product.rating_count ?? product.review_count ?? product.total_reviews ?? 0,
  );

  return {
    ...product,
    image: product.image ?? product.img,
    images: normalizeProductImages(product),
    rating: Number.isFinite(parsedRating) ? parsedRating : 0,
    rating_count: Number.isFinite(parsedRatingCount) ? parsedRatingCount : 0,
    oldPrice: product.compare_price ?? product.oldPrice,
  };
};

export const extractProductItems = (payload) => {
  const resolved = payload?.data ?? payload;
  if (Array.isArray(resolved)) return resolved;
  if (Array.isArray(resolved?.items)) return resolved.items;
  if (Array.isArray(resolved?.products)) return resolved.products;
  return [];
};
