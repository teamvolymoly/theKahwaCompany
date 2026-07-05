"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Clock, Leaf } from "lucide-react";

import { apiFetch } from "@/utils/api";
import {
  contentToBlogBlocks,
  normalizeBlogPost,
} from "@/utils/blogs";

export default function BlogDetailPage() {
  const { slug: blogId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadPost = async () => {
      if (!blogId) return;
      setLoading(true);
      try {
        const data = await apiFetch(`/blog-posts/${blogId}`);
        if (active) setPost(normalizeBlogPost(data));
      } catch {
        if (active) setPost(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPost();
    return () => {
      active = false;
    };
  }, [blogId]);

  const blocks = useMemo(
    () => contentToBlogBlocks(post?.content),
    [post?.content],
  );

  return (
    <main className="bg-white pt-24 text-black md:pt-28">
      <article className="container mx-auto px-4 py-10 md:py-16">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-black/55 transition hover:text-black"
          >
            <ArrowLeft size={14} strokeWidth={1.8} />
            Back to journal
          </Link>
        </div>

        {loading && (
          <div className="mx-auto mt-10 max-w-6xl rounded-sm border border-black/10 p-6 text-sm text-black/60">
            Loading story...
          </div>
        )}

        {!loading && !post && (
          <div className="mx-auto mt-10 max-w-6xl rounded-sm border border-black/10 p-6 text-sm text-black/60">
            This blog post could not be found.
          </div>
        )}

        {!loading && post && (
          <>
            <header className="mx-auto mt-8 grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-[#9b7a13]">
                  Kahwa journal
                </p>
                <h1 className="mt-4 max-w-4xl font-(family-name:--font-basker) text-4xl leading-[1.05] text-black md:text-6xl">
                  {post.title}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-black/65 md:text-lg">
                  {post.excerpt}
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-[#f7f3eb] p-5">
                <div className="flex items-center gap-3 border-b border-black/10 pb-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-[#FFBF00]">
                    <Leaf size={18} />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-black/45">
                      Article
                    </p>
                    <p className="font-semibold text-black">Kahwa guide</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-black/60">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={16} />
                    {post.date}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock size={16} />
                    {post.read || "Quick read"}
                  </span>
                </div>
              </div>
            </header>

            {post.image ? (
              <div className="mx-auto mt-10 max-w-6xl overflow-hidden rounded-[28px] bg-[#f2f2f2]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="aspect-[16/7] w-full object-cover"
                />
              </div>
            ) : null}

            <div className="mx-auto mt-12 grid max-w-6xl gap-10 lg:grid-cols-[220px_minmax(0,760px)] lg:items-start lg:justify-center">
              <aside className="hidden border-t border-black/10 pt-5 text-sm text-black/50 lg:block">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">
                  In this story
                </p>
                <div className="mt-4 space-y-3">
                  {blocks
                    .filter((block) => block.type === "heading")
                    .slice(0, 5)
                    .map((block, index) => (
                      <p key={`${block.text}-${index}`}>{block.text}</p>
                    ))}
                </div>
              </aside>

              <div className="min-w-0">
                <div className="border-l-2 border-[#FFBF00] pl-5">
                  <p className="font-(family-name:--font-basker) text-2xl leading-9 text-black md:text-3xl">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-10 space-y-6 text-base leading-8 text-black/70">
                  {blocks.map((block, index) => {
                    if (block.type === "heading") {
                      return (
                        <h2
                          key={`${block.text}-${index}`}
                          className="pt-6 text-2xl font-semibold leading-tight text-black md:text-3xl"
                        >
                          {block.text}
                        </h2>
                      );
                    }

                    if (block.type === "step") {
                      return (
                        <h3
                          key={`${block.text}-${index}`}
                          className="pt-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#9b7a13]"
                        >
                          {block.text}
                        </h3>
                      );
                    }

                    if (block.type === "list") {
                      return (
                        <ul
                          key={`list-${index}`}
                          className="grid gap-2 rounded-2xl bg-[#f7f3eb] p-5 text-black/70 sm:grid-cols-2"
                        >
                          {block.items.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-3"
                            >
                              <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFBF00]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }

                    return (
                      <p key={`${block.text}-${index}`}>{block.text}</p>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </article>
    </main>
  );
}
