import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllBlogSlugs,
  getBlogPostBySlug,
} from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    return { title: "Not found" };
  }
  return {
    title: post.title,
    description: post.description || undefined,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description || undefined,
      url: `/blog/${slug}`,
      siteName: "HairSalonDirectories.com",
      type: "article",
      publishedTime: post.date || undefined,
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <header className="space-y-3 border-b border-teal/15 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            Blog
          </p>
          <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
            {post.title}
          </h1>
          {post.date ? (
            <time dateTime={post.date} className="text-sm text-slate-500">
              {formatDate(post.date)}
            </time>
          ) : null}
          {post.description ? (
            <p className="text-sm text-slate-600">{post.description}</p>
          ) : null}
        </header>

        <div
          className="blog-content mt-10 text-sm text-slate-700"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>

      <nav className="mx-auto mt-12 max-w-3xl border-t border-teal/15 pt-8 text-sm text-slate-600">
        <Link href="/blog" className="text-teal hover:text-teal-soft">
          All articles
        </Link>
        <span className="mx-2 text-slate-400">·</span>
        <Link href="/" className="text-teal hover:text-teal-soft">
          Homepage
        </Link>
      </nav>
    </div>
  );
}
