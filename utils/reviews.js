export const EMPTY_REVIEW_FORM = {
  rating: 5,
  title: "",
  comment: "",
  images: [],
};

export const normalizeReviewImage = (image) => {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.url || image.image_url || image.path || "";
};

export const normalizeProductReview = (review = {}) => ({
  id: review.id,
  name:
    review.name ||
    review.customer_name ||
    review.user_name ||
    review.user?.name ||
    review.customer?.name ||
    "Customer",
  rating: Number(review.rating ?? 0) || 0,
  review: review.review || review.comment || "",
  date: review.date || review.created_at || "",
  title: review.title || "",
  location: review.location || "",
  images: Array.isArray(review.images)
    ? review.images.map(normalizeReviewImage).filter(Boolean)
    : [],
});

export const normalizeEligibleReviewItem = (item = {}) => ({
  order_id: item.order_id,
  order_item_id: item.order_item_id || item.id,
  product_id: item.product_id,
  variant_id: item.variant_id,
  product_name: item.product_name || item.product?.name || item.name || "",
  variant_name: item.variant_name || item.variant?.name || item.variant || "",
  image:
    item.image ||
    item.product_image ||
    item.product_image_url ||
    item.product?.image ||
    "",
  delivered_date: item.delivered_date || item.order?.delivered_date || "",
  can_review: Boolean(item.can_review),
  already_reviewed: Boolean(item.already_reviewed || item.review),
  reason: item.reason || "",
  review: item.review || null,
});

export const extractEligibleReviewItems = (payload) => {
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.items)
      ? payload.items
      : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.data?.items)
          ? payload.data.items
          : [];

  return items.map(normalizeEligibleReviewItem);
};

export const extractProductReviews = (payload) => {
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.items)
      ? payload.items
      : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.data?.items)
          ? payload.data.items
          : [];

  const summary = payload?.summary || payload?.data?.summary || payload || {};
  const pagination = payload?.pagination || payload?.data?.pagination || {};
  return {
    items: items.map(normalizeProductReview),
    summary,
    pagination,
  };
};

export const buildReviewFormData = (orderItemId, form) => {
  const data = new FormData();
  data.append("order_item_id", String(orderItemId));
  data.append("rating", String(form.rating || 5));
  data.append("title", form.title || "");
  data.append("comment", form.comment || "");

  Array.from(form.images || []).forEach((file, index) => {
    data.append(`images[${index}]`, file);
  });

  return data;
};
