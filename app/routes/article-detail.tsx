import { Link } from "react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Route } from "./+types/article-detail";
import { siteConfig } from "~/data/site";
import { getArticle } from "~/lib/content.server";

export function loader({ params }: Route.LoaderArgs) {
  const article = getArticle(params.slug ?? "");
  if (!article) throw new Response("Not Found", { status: 404 });
  return { article };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: loaderData ? `${loaderData.article.title} — ${siteConfig.name}` : "文章不存在" },
    { name: "description", content: loaderData?.article.summary ?? "" },
  ];
}

export default function ArticleDetail({ loaderData }: Route.ComponentProps) {
  const { article } = loaderData;
  return (
    <main id="main-content" className="article-page section-frame">
      <Link className="back-link" to="/articles" reloadDocument>← 返回文章</Link>
      <header className="article-header">
        <div className="tag-list">{article.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <h1>{article.title}</h1>
        <p className="lede">{article.summary}</p>
        <div className="article-byline"><span>{article.publishedAt}</span><span>{article.readingTime}</span><span>{siteConfig.pages.articleAuthor || siteConfig.name}</span></div>
      </header>
      <article className="prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
      </article>
    </main>
  );
}
