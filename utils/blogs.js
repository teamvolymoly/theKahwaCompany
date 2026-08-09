export const formatBlogDate = (value) => {
  const parsed = value ? new Date(value) : null;
  if (!parsed || Number.isNaN(parsed.getTime())) return "";

  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const getReadTime = (content = "") => {
  const words = String(content).trim().split(/\s+/).filter(Boolean).length;
  if (!words) return "";
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
};

export const normalizeBlogPost = (item, index = 0) => {
  const content = item?.content || "";
  const excerpt = item?.excerpt || "";
  const id = item?.id || `fallback-blog-${index}`;
  const slug = item?.slug || id;
  const image =
    item?.featured_image_url ||
    item?.featured_image_path ||
    item?.image_url ||
    item?.image ||
    "";

  return {
    id,
    title: item?.title || "",
    slug,
    href: `/blogs/${id}`,
    excerpt,
    content,
    image,
    imagePath: image,
    status: item?.status,
    metaTitle: item?.meta_title || "",
    metaDescription: item?.meta_description || "",
    author:
      item?.author?.name ||
      item?.author_name ||
      item?.created_by?.name ||
      "",
    date: formatBlogDate(item?.published_at || item?.created_at),
    read: getReadTime(content || excerpt),
  };
};

export const normalizeBlogList = (payload) => {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.items)
        ? payload.items
        : [];

  return list.map((item, index) => normalizeBlogPost(item, index));
};

export const normalizeBlogPagination = (payload) => {
  const posts = normalizeBlogList(payload);

  return {
    posts,
    currentPage: Number(payload?.current_page) || 1,
    lastPage: Number(payload?.last_page) || 1,
    perPage: Number(payload?.per_page) || posts.length,
    from: payload?.from || 0,
    to: payload?.to || posts.length,
    total: Number(payload?.total) || posts.length,
    hasNext: Boolean(payload?.next_page_url),
    hasPrev: Boolean(payload?.prev_page_url),
    links: Array.isArray(payload?.links) ? payload.links : [],
  };
};

export const contentToParagraphs = (content = "") =>
  String(content)
    .replace(/â€“/g, "-")
    .replace(/â€™/g, "'")
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

const sectionHeadings = new Set([
  "Ingredients",
  "Brewing Tips",
  "Pair It With",
  "A Cup Full of Tradition",
  "What is Kahwa?",
  "Traditional Ingredients",
  "Health Benefits",
  "Why Modern Tea Lovers Choose Kahwa",
  "Experience Authentic Kahwa",
  "Why Drink Kahwa Daily?",
  "Best Time to Drink Kahwa",
  "Make Kahwa Part of Your Lifestyle",
]);

const isStepHeading = (line) => /^Step\s+\d+$/i.test(line);
const isSectionHeading = (line, index) =>
  index === 0 || sectionHeadings.has(line) || isStepHeading(line);
const isListCandidate = (line) =>
  line.length <= 42 &&
  !/[.!?]$/.test(line) &&
  !isSectionHeading(line, 1);

export const contentToBlogBlocks = (content = "") => {
  const lines = contentToParagraphs(content);
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (isSectionHeading(line, index)) {
      blocks.push({
        type: isStepHeading(line) ? "step" : "heading",
        text: line,
      });
      index += 1;
      continue;
    }

    const previous = blocks[blocks.length - 1];
    const shouldCollectList =
      previous?.type === "heading" ||
      previous?.type === "step" ||
      previous?.text?.endsWith(":");

    if (shouldCollectList && isListCandidate(line)) {
      const items = [];
      while (
        index < lines.length &&
        isListCandidate(lines[index]) &&
        !isSectionHeading(lines[index], index)
      ) {
        items.push(lines[index]);
        index += 1;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    blocks.push({ type: "paragraph", text: line });
    index += 1;
  }

  return blocks;
};
