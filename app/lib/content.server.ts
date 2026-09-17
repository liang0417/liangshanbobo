import matter from "gray-matter";

export interface ArticleSummary {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
  featured: boolean;
}

export interface Article extends ArticleSummary {
  content: string;
}

const articleModules = import.meta.glob<string>("../content/articles/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

function parseArticle(path: string, raw: string): Article {
  const { data, content } = matter(raw);
  const slug = path.split("/").pop()?.replace(/\.md$/, "") ?? "article";
  const chineseChars = [...content.matchAll(/\p{Script=Han}/gu)].length;
  const otherWords = content.match(/[A-Za-z0-9][A-Za-z0-9+/-]*/g)?.length ?? 0;
  const readingMinutes = Math.max(1, Math.ceil((chineseChars + otherWords * 2) / 350));

  return {
    slug,
    title: String(data.title ?? slug),
    summary: String(data.summary ?? ""),
    publishedAt: String(data.publishedAt ?? ""),
    readingTime: `约 ${readingMinutes} 分钟阅读`,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    featured: Boolean(data.featured),
    content,
  };
}

export function getArticles(): Article[] {
  return Object.entries(articleModules)
    .map(([path, raw]) => parseArticle(path, raw))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getArticle(slug: string) {
  return getArticles().find((article) => article.slug === slug);
}
