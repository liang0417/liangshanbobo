import { Link } from "react-router";
import type { Route } from "./+types/home";
import { ProjectCard } from "~/components/project-card";
import { experience, projects } from "~/data/site";
import { getArticles } from "~/lib/content.server";

export function meta() {
  return [
    { title: "YOUR.NAME — AI Product Engineer" },
    { name: "description", content: "关于 AI、工程与长期创造的个人网站。" },
  ];
}

export function loader() {
  return { articles: getArticles().slice(0, 3) };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main id="main-content">
      <section className="hero section-frame">
        <div className="hero-copy">
          <div className="availability"><span /> AVAILABLE FOR IDEAS</div>
          <p className="eyebrow">AI PRODUCT ENGINEER / INDEPENDENT BUILDER</p>
          <h1>构建 AI 产品，<br /><span>也构建值得信任的系统。</span></h1>
          <p className="hero-lede">我关注 Agent、RAG、知识工程与完整产品交付，把模糊想法变成可理解、可验证、可持续迭代的真实产品。</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/projects" reloadDocument>查看作品 <span>↗</span></Link>
            <Link className="button button-secondary" to="/articles" reloadDocument>阅读文章</Link>
          </div>
          <div className="hero-proof">
            <span><strong>03+</strong> 核心项目</span>
            <span><strong>FULL</strong> 产品闭环</span>
            <span><strong>OPEN</strong> 持续记录</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="抽象智能节点网络">
          <div className="visual-grid" />
          <div className="orbit orbit-one"><i /></div>
          <div className="orbit orbit-two"><i /></div>
          <div className="core-orb">
            <span className="core-label">BUILDING</span>
            <strong>AI × PRODUCT</strong>
            <small>Human-centered systems</small>
          </div>
          <div className="visual-note note-top">TRACE / 0027</div>
          <div className="visual-note note-bottom">STATUS · ONLINE</div>
        </div>
      </section>

      <section className="now-strip section-frame" aria-label="当前状态">
        <div><span className="pulse" /> NOW</div>
        <p>正在构建一个更可靠、更透明的 AI 工作流</p>
        <span className="mono">SHANGHAI · UTC+8</span>
      </section>

      <section className="section section-frame">
        <div className="section-heading">
          <div><p className="eyebrow">SELECTED WORK / 01</p><h2>精选作品</h2></div>
          <Link className="text-link" to="/projects" reloadDocument>查看全部 <span>↗</span></Link>
        </div>
        <div className="project-grid">
          <ProjectCard project={projects[0]} large />
          <div className="project-stack">
            {projects.slice(1).map((project) => <ProjectCard key={project.name} project={project} />)}
          </div>
        </div>
      </section>

      <section className="section section-frame articles-section">
        <div className="section-heading">
          <div><p className="eyebrow">WRITING / 02</p><h2>最近文章</h2></div>
          <Link className="text-link" to="/articles" reloadDocument>文章归档 <span>↗</span></Link>
        </div>
        <div className="article-list">
          {loaderData.articles.map((article, index) => (
            <Link className="article-row" key={article.slug} to={`/articles/${article.slug}`} reloadDocument>
              <span className="article-index">{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{article.title}</h3><p>{article.summary}</p></div>
              <div className="article-meta"><span>{article.publishedAt}</span><span>{article.readingTime}</span></div>
              <span className="article-arrow">↗</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section-frame experience-section">
        <div className="section-heading">
          <div><p className="eyebrow">JOURNEY / 03</p><h2>经历与方向</h2></div>
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
        <p className="eyebrow">LET'S BUILD SOMETHING MEANINGFUL</p>
        <h2>有值得一起做的事情？<br /><span>我们聊聊。</span></h2>
        <a className="button button-primary" href="mailto:hello@example.com">发一封邮件 <span>↗</span></a>
      </section>
    </main>
  );
}
