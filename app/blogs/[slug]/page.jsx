"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { apiFetch } from "@/utils/api";
import {
  contentToBlogBlocks,
  normalizeBlogPagination,
  normalizeBlogPost,
} from "@/utils/blogs";

const shareLinks = [
  {
    label: "Facebook",
    href: (url, title) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
    path: "M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z",
  },
  {
    label: "X",
    href: (url, title) =>
      `https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    path: "M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.48 22H3.36l7.27-8.31L3 2h6.4l4.42 5.84L18.9 2zm-1.1 17.84h1.73L8.46 4.05H6.6L17.8 19.84z",
  },
  {
    label: "WhatsApp",
    href: (url, title) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    path: "M12.04 2a9.84 9.84 0 0 0-8.42 14.92L2.1 22l5.2-1.48A9.98 9.98 0 1 0 12.04 2Zm0 17.93a8.08 8.08 0 0 1-4.12-1.13l-.3-.18-3.08.88.9-3-.2-.31a7.9 7.9 0 1 1 6.8 3.74Zm4.42-5.95c-.24-.12-1.43-.7-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.37-1.94-1.2a7.2 7.2 0 0 1-1.34-1.66c-.14-.24-.01-.37.1-.49.11-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.19 1.1.16 1.51.1.46-.06 1.43-.59 1.63-1.15.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z",
  },
];

function ArticleCard({ post }) {
  return (
    <Link
      href={post.href}
      className="group flex min-h-0 snap-start flex-col rounded-lg bg-[#f1f4ec] p-3"
    >
      <div className="aspect-[1.42/1] overflow-hidden rounded-md bg-[#e3e8df]">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <div className="space-y-1 text-[9px] uppercase leading-tight text-[#8a8f86]">
          {post.date ? <p>{post.date}</p> : null}
          <p className="normal-case text-[#646961]">
            Estimated Read Time: {post.read || "Quick read"}
          </p>
        </div>
        <h3 className="mt-4 line-clamp-2 text-md font-semibold leading-[1.2] text-[#252a23]">
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className="mt-4 line-clamp-3 text-md leading-[1.35] text-[#444940]">
            {post.excerpt}...
          </p>
        ) : null}
        <span className="mt-5 flex h-10 w-full items-center justify-center rounded-md bg-[#52653b] text-md font-semibold text-white transition-colors group-hover:bg-[#6B7F42]">
          Read More
        </span>
      </div>
    </Link>
  );
}

function ArticleBody({ blocks }) {
  return (
    <div className="space-y-4 text-base leading-[1.45] text-[#20231f]">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        if (block.type === "heading") {
          return (
            <h2
              key={key}
              className="pt-2 text-md font-semibold leading-tight text-[#20231f]"
            >
              {block.text}
            </h2>
          );
        }

        if (block.type === "step") {
          return (
            <h3
              key={key}
              className="pt-1 text-md font-semibold leading-tight text-[#20231f]"
            >
              {block.text}
            </h3>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={key} className="space-y-1 pl-4">
              {block.items.map((item) => (
                <li key={item} className="list-disc pl-1">
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        return <p key={key}>{block.text}</p>;
      })}
    </div>
  );
}

export default function BlogDetailPage() {
  const { slug: blogId } = useParams();
  const relatedSliderRef = useRef(null);
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState("");

  const scrollRelated = (direction) => {
    const slider = relatedSliderRef.current;
    if (!slider) return;
    const card = slider.firstElementChild;
    const distance = (card?.getBoundingClientRect().width || 0) + 16;
    slider.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  useEffect(() => {
    let active = true;

    const loadArticle = async () => {
      if (!blogId) return;
      setLoading(true);

      try {
        const [postData, listData] = await Promise.all([
          apiFetch(`/blog-posts/${encodeURIComponent(blogId)}`),
          apiFetch("/blog-posts?page=1"),
        ]);
        if (!active) return;

        const normalizedPost = normalizeBlogPost(postData);
        const normalizedList = normalizeBlogPagination(listData).posts;
        setPost(normalizedPost);
        setRelated(
          normalizedList
            .filter((item) => String(item.id) !== String(normalizedPost.id))
            .slice(0, 3),
        );
      } catch {
        if (active) {
          setPost(null);
          setRelated([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadArticle();
    return () => {
      active = false;
    };
  }, [blogId]);

  const blocks = useMemo(
    () => contentToBlogBlocks(post?.content),
    [post?.content],
  );

  useEffect(() => {
    if (!post) return undefined;

    const previousTitle = document.title;
    const title = post.metaTitle || post.title;
    if (title) document.title = title;

    let descriptionMeta = document.querySelector('meta[name="description"]');
    const previousDescription = descriptionMeta?.getAttribute("content") || "";
    const createdDescriptionMeta = !descriptionMeta;

    if (!descriptionMeta) {
      descriptionMeta = document.createElement("meta");
      descriptionMeta.setAttribute("name", "description");
      document.head.appendChild(descriptionMeta);
    }

    const description = post.metaDescription || post.excerpt;
    if (description) descriptionMeta.setAttribute("content", description);

    return () => {
      document.title = previousTitle;
      if (createdDescriptionMeta) {
        descriptionMeta?.remove();
      } else if (descriptionMeta) {
        descriptionMeta.setAttribute("content", previousDescription);
      }
    };
  }, [post]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fdfefb] pt-[70px]">
        <div className="h-[490px] animate-pulse bg-[#e9ede5]" />
        <div className="site-container h-[430px] animate-pulse py-16">
          <div className="h-full rounded-lg bg-[#f1f4ec]" />
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-[70vh] bg-[#fdfefb] px-5 pt-40 text-center text-[#344823]">
        <h1 className="font-(family-name:--font-basker) text-4xl">
          Article not found
        </h1>
        <Link href="/blogs" className="text-cta mt-6 inline-block">
          View all articles
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-[#fdfefb] pt-[70px] text-[#20231f]">
      <article>
        <header className="grid bg-[#6b803f] lg:h-[490px] lg:grid-cols-2">
          <div className="h-[340px] overflow-hidden bg-[#ebece7] sm:h-[430px] lg:h-full">
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div className="flex min-h-[250px] items-center justify-center px-8 py-14 text-center lg:h-full lg:min-h-0 lg:px-14">
            <h1 className="max-w-[560px] text-2xl font-semibold leading-[1.16] text-[#f7f5ee]">
              {post.title}
            </h1>
          </div>
        </header>

        <section className="site-container grid gap-10 py-16 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12 lg:py-[74px]">
          <aside className="text-[#30342d] h-fit bg-[#f1f4ec] rounded-lg px-6 py-8 sm:px-7 sm:py-10 lg:px-4 lg:py-8">
            <p className="text-[18px] leading-snug">
              By {post.author || "The Kahwa Company"}
            </p>
            {post.date ? (
              <p className="mt-1 text-[14px] leading-snug">{post.date}</p>
            ) : null}

            <p className="mt-8 text-[12px] font-semibold uppercase tracking-[0.02em]">
              Share this article
            </p>
            <div className="mt-3 flex gap-2">
              {shareLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href(shareUrl || `/blogs/${blogId}`, post.title)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Share on ${link.label}`}
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-[#687a51] text-[#566b3d] transition hover:bg-[#566b3d] hover:text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d={link.path} />
                  </svg>
                </a>
              ))}
            </div>
          </aside>

          <div className="min-w-0">
            {post.excerpt ? (
              <p className="mb-5 text-base leading-[1.45] text-[#20231f]">
                {post.excerpt}
              </p>
            ) : null}
            <ArticleBody blocks={blocks} />
          </div>
        </section>
      </article>

      {related.length ? (
        <section className="site-container pb-[74px] pt-7 lg:pt-10">
          <div className="flex items-end justify-center gap-6 sm:justify-between">
            <h2 className="font-(family-name:--font-basker) text-[28px] md:text-4xl text-center md:text-left font-normal uppercase leading-none text-[#33372f]">
              Related Articles
            </h2>
            <div className="mb-1 hidden items-center justify-center gap-2 sm:flex">
              <Link
                href="/blogs"
                className="text-md font-medium text-[#52633c] hover:underline  underline-offset-3 sm:text-base"
              >
                View all Articles
              </Link>
              <img
                src="/icons/VectorRight.svg"
                alt=""
                className="h-3.5 w-2 object-contain"
              />
            </div>
          </div>

          <div
            ref={relatedSliderRef}
            className="latest-articles__slider mt-10 grid snap-x snap-mandatory grid-flow-col auto-cols-[calc((100%_-_16px)/1.3)] gap-4 overflow-x-auto sm:grid-flow-row sm:grid-cols-1 sm:auto-cols-auto sm:overflow-visible md:grid-cols-2 lg:grid-cols-3"
          >
            {related.map((item) => (
              <ArticleCard key={item.id} post={item} />
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between sm:hidden">
            <button
              type="button"
              onClick={() => scrollRelated(-1)}
              aria-label="Previous related article"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f5ee] text-[#65794b]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <Link
              href="/blogs"
              className="text-base font-semibold text-[#52633d] underline underline-offset-4"
            >
              View all Articles
            </Link>
            <button
              type="button"
              onClick={() => scrollRelated(1)}
              aria-label="Next related article"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f5ee] text-[#65794b]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </section>
      ) : null}
    </main>
  );
}
