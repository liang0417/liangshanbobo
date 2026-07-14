import { Link } from "react-router";
import type { Route } from "./+types/home";
import { ProjectCard } from "~/components/project-card";
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
      <section className="hero section-frame">
        <div className="hero-copy">
          <div className="availability"><span /> AVAILABLE FOR IDEAS</div>
          <p className="eyebrow">AI INDEPENDENT BUILDER / LIANGSHANBOBO</p>
          <h1>构建值得信任的系统，<br /><span>也把值得长期保存的故事，留在其中。</span></h1>
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

        <div className="hero-visual" aria-label="抽象双节点与蝶翼轨迹">
          <div className="visual-grid" />
          <div className="orbit orbit-one"><i /></div>
          <div className="orbit orbit-two"><i /></div>
          <div className="core-orb">
            <span className="core-label">BUILDING</span>
            <strong>SYSTEMS × STORIES</strong>
            <small>Build with care</small>
          </div>
          <div className="visual-note note-top">TRACE / LSB-01</div>
          <div className="visual-note note-bottom">TWIN SIGNALS · ONLINE</div>
        </div>
      </section>

      <section className="now-strip section-frame" aria-label="当前状态">
        <div><span className="pulse" /> {siteIdentity.wordmark}</div>
        <p>正在构建可验证的产品，也为重要的时刻留出位置。</p>
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
          <div><p className="eyebrow">BUILDER JOURNEY / 03</p><h2>构建轨迹</h2></div>
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
        <a className="button button-primary" href={siteIdentity.githubUrl} target="_blank" rel="noreferrer">在 GitHub 找我 <span>↗</span></a>
      </section>
    </main>
  );
}
