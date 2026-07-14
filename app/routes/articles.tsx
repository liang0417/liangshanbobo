import { Link } from "react-router";
import type { Route } from "./+types/articles";
import { getArticles } from "~/lib/content.server";

export function meta() {
  return [{ title: "文章 — YOUR.NAME" }, { name: "description", content: "关于 AI 工程、产品、知识系统与长期创造的文章。" }];
}

export function loader() {
  return { articles: getArticles() };
}

export default function Articles({ loaderData }: Route.ComponentProps) {
  const tags = Array.from(new Set(loaderData.articles.flatMap((article) => article.tags)));

  return (
    <main id="main-content" className="page section-frame">
      <header className="page-hero">
        <p className="eyebrow">WRITING / FIELD NOTES</p>
        <h1>写下思考，<span>留下过程。</span></h1>
        <p className="lede">关于 AI 工程、产品设计、复杂系统和把事情真正做完的实践记录。</p>
      </header>
      <div className="filter-row" aria-label="文章主题">
        <span className="filter-active">全部</span>
        {tags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      <div className="article-cards">
        {loaderData.articles.map((article) => (
          <Link className="article-card" key={article.slug} to={`/articles/${article.slug}`} reloadDocument>
            <div className="article-card-top"><span>{article.publishedAt}</span><span>{article.readingTime}</span></div>
            <h2>{article.title}</h2>
            <p>{article.summary}</p>
            <div className="tag-list">{article.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <span className="card-link">阅读全文 ↗</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
