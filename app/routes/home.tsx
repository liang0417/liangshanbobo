import { Link } from "react-router";
import type { Route } from "./+types/home";
import { experience, projects, siteIdentity } from "~/data/site";
import { getArticles } from "~/lib/content.server";

export function meta() {
  return [
    { title: `${siteIdentity.name} — AI Independent Builder` },
    { name: "description", content: "Liangshanbobo 的 AI 产品、开源实验、文章与一人公司探索。" },
  ];
}

export function loader() {
  return { articles: getArticles().slice(0, 3) };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main id="main-content">
      <section className="home-intro section-frame">
        <div>
          <p className="eyebrow">LIANGSHANBOBO / 独立 AI 产品构建者</p>
          <h1>你好，我是 Liangshanbobo。</h1>
          <p className="home-intro-copy">
            我在上海，关注 <strong>Agent、RAG 与知识工程</strong>，把模糊想法做成可以运行、验证和持续迭代的产品。
            这里收录我的项目、文章和公开构建记录。
          </p>
        </div>
        <aside className="home-now">
          <p className="mono">NOW / 2026</p>
          <p>正在构建本地优先、答案可验证的个人知识工作台。</p>
          <Link className="text-link" to="/about" reloadDocument>了解更多 ↗</Link>
        </aside>
      </section>

      <section className="home-index section-frame">
        <div className="home-column">
          <div className="index-heading">
            <div><p className="eyebrow">SELECTED WORK</p><h2>作品</h2></div>
            <Link className="text-link" to="/projects" reloadDocument>全部作品 ↗</Link>
          </div>
          <div className="home-project-list">
            {projects.map((project, index) => (
              <article className="home-project-row" key={project.name}>
                <span className="project-index">0{index + 1}</span>
                <div>
                  <div className="home-project-title"><h3>{project.name}</h3><span>{project.status}</span></div>
                  <p>{project.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="home-column">
          <div className="index-heading">
            <div><p className="eyebrow">RECENT WRITING</p><h2>最近文章</h2></div>
            <Link className="text-link" to="/articles" reloadDocument>文章归档 ↗</Link>
          </div>
          <div className="home-article-list">
            {loaderData.articles.map((article) => (
              <Link className="home-article-row" key={article.slug} to={`/articles/${article.slug}`} reloadDocument>
                <span className="mono">{article.publishedAt}</span>
                <div><h3>{article.title}</h3><p>{article.summary}</p></div>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-frame experience-section">
        <div className="section-heading">
          <div><p className="eyebrow">JOURNEY</p><h2>构建轨迹</h2></div>
        </div>
        <div className="experience-grid">
          {experience.map((item) => (
            <article key={item.period} className="experience-item">
              <p className="mono">{item.period}</p>
              <h3>{item.role}</h3>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-cta section-frame">
        <p className="eyebrow">CONTACT</p>
        <h2>有值得一起做的事情，<br /><span>可以来聊聊。</span></h2>
        <a className="text-link contact-link" href={siteIdentity.githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a>
      </section>
    </main>
  );
}
