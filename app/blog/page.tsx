import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides and tips on choosing salons, hair care, color, extensions, and getting the most from your salon visits.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | HairSalonDirectories.com",
    url: "/blog",
    siteName: "HairSalonDirectories.com",
    type: "website",
  },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
          Blog
        </p>
        <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
          Hair salon guides &amp; tips
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Practical articles on finding salons, services, pricing, and how to
          prepare for your appointment.
        </p>
      </header>

      <ul className="mt-12 divide-y divide-teal/15 border-t border-teal/15">
        {posts.map((post) => (
          <li key={post.slug} className="py-8 first:pt-6">
            <article className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
              <div className="min-w-0 flex-1 space-y-2">
                <h2 className="text-lg font-semibold text-navy">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-navy transition-colors hover:text-teal-soft"
                  >
                    {post.title}
                  </Link>
                </h2>
                {post.description ? (
                  <p className="text-sm text-slate-600">{post.description}</p>
                ) : null}
              </div>
              <time
                dateTime={post.date}
                className="shrink-0 text-xs text-slate-500 sm:text-right"
              >
                {formatDate(post.date)}
              </time>
            </article>
          </li>
        ))}
      </ul>

      {posts.length === 0 ? (
        <p className="mt-8 text-sm text-slate-600">No articles yet.</p>
      ) : null}

      <p className="mt-10 text-sm text-slate-600">
        <Link href="/" className="text-teal hover:text-teal-soft">
          Back to homepage
        </Link>
      </p>
    </div>
  );
}
