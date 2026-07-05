"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";

import { apiFetch } from "@/utils/api";
import { normalizeBlogPagination } from "@/utils/blogs";

export default function BlogsPage() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    from: 0,
    to: 0,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadPosts = async () => {
      setLoading(true);
      try {
        const data = await apiFetch(`/blog-posts?page=${page}`);
        const normalized = normalizeBlogPagination(data);
        if (active) {
          setPosts(normalized.posts);
          setPagination(normalized);
        }
      } catch {
        if (active) {
          setPosts([]);
          setPagination((current) => ({
            ...current,
            from: 0,
            to: 0,
            total: 0,
            hasNext: false,
            hasPrev: false,
          }));
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPosts();
    return () => {
      active = false;
    };
  }, [page]);

  return (
    <main className="bg-white mt-10 text-black">
      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-black/50">
              Stories & Sips
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-black md:text-5xl">
              Kahwa Journal
            </h1>
            {!loading && pagination.total > 0 ? (
              <p className="mt-3 text-sm text-black/55">
                Showing {pagination.from}-{pagination.to} of {pagination.total}{" "}
                stories
              </p>
            ) : null}
          </div>
          <Link
            href="/"
            className="self-start text-xs font-semibold uppercase tracking-[0.05em] text-black/60 hover:text-black"
          >
            Back home
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading && (
            <div className="col-span-full rounded-sm border border-black/10 p-6 text-sm text-black/60">
              Loading stories...
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="col-span-full rounded-sm border border-black/10 p-6 text-sm text-black/60">
              No blog posts available right now.
            </div>
          )}

          {!loading &&
            posts.map((post) => (
              <Link
                key={post.id}
                href={post.href}
                className="group overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative h-60 overflow-hidden bg-[#f2f2f2]">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.05]"
                    />
                  ) : null}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 text-xs text-white/85">
                    <CalendarDays size={14} />
                    {post.date}
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-black">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm text-black/60">{post.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between gap-4 text-xs text-black/50">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={14} />
                      {post.read || "Quick read"}
                    </span>
                    <span className="inline-flex items-center gap-2 font-semibold uppercase tracking-[0.08em] text-black">
                      Read <ArrowRight size={14} strokeWidth={1.8} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
        </div>

        {!loading && pagination.lastPage > 1 ? (
          <div className="mt-10 flex flex-col gap-4 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-black/50">
              Page {pagination.currentPage} of {pagination.lastPage}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={!pagination.hasPrev || loading}
                className="inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-black transition hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                Previous
              </button>
              <button
                type="button"
                onClick={() =>
                  setPage((current) =>
                    Math.min(pagination.lastPage, current + 1),
                  )
                }
                disabled={!pagination.hasNext || loading}
                className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
