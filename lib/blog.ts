import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import { unified } from "unified";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogPostFrontmatter = {
  title: string;
  date: string;
  description: string;
};

export type BlogPostSummary = BlogPostFrontmatter & {
  slug: string;
};

export type BlogPost = BlogPostSummary & {
  contentHtml: string;
};

function parseFrontmatter(data: Record<string, unknown>): BlogPostFrontmatter {
  const title =
    typeof data.title === "string" && data.title.trim()
      ? data.title.trim()
      : "Untitled";
  const date =
    typeof data.date === "string" && data.date.trim()
      ? data.date.trim()
      : "";
  const description =
    typeof data.description === "string" && data.description.trim()
      ? data.description.trim()
      : "";
  return { title, date, description };
}

function listMarkdownFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((name) => name.endsWith(".md"))
    .sort();
}

export function getAllBlogSlugs(): string[] {
  return listMarkdownFiles().map((name) => name.replace(/\.md$/i, ""));
}

export function getAllBlogPosts(): BlogPostSummary[] {
  const posts: BlogPostSummary[] = [];
  for (const file of listMarkdownFiles()) {
    const slug = file.replace(/\.md$/i, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const { data } = matter(raw);
    const fm = parseFrontmatter(data as Record<string, unknown>);
    posts.push({ slug, ...fm });
  }
  posts.sort((a, b) => {
    const ta = new Date(a.date).getTime();
    const tb = new Date(b.date).getTime();
    if (Number.isNaN(ta) && Number.isNaN(tb)) return 0;
    if (Number.isNaN(ta)) return 1;
    if (Number.isNaN(tb)) return -1;
    return tb - ta;
  });
  return posts;
}

async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(markdown);
  return String(file);
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = parseFrontmatter(data as Record<string, unknown>);
  const contentHtml = await markdownToHtml(content);
  return { slug, ...fm, contentHtml };
}
