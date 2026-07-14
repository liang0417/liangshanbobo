import { Link } from "react-router";
import type { Route } from "./+types/home";
import { HeroVisual } from "~/components/hero-visual";
import { ProjectCard } from "~/components/project-card";
import { experience, projects, siteConfig } from "~/data/site";
import { getArticles } from "~/lib/content.server";

export function meta() {
  return [
    { title: `${siteConfig.name} — ${siteConfig.role}` },
    { name: "description", content: siteConfig.description },
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
          <div className="availability"><span /> {siteConfig.home.availability}</div>
          <p className="eyebrow">{siteConfig.home.eyebrow}</p>
          <h1>{siteConfig.home.headline}<br /><span>{siteConfig.home.headlineAccent}</span></h1>
          <p className="hero-lede">{siteConfig.home.intro}</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/projects" reloadDocument>查看作品 <span>↗</span></Link>
            <Link className="button button-secondary" to="/articles" reloadDocument>阅读文章</Link>
          </div>
          <div className="hero-proof">
            {siteConfig.home.proof.map((item) => <span key={item.label}><strong>{item.value}</strong> {item.label}</span>)}
          </div>
        </div>

        <HeroVisual variant={siteConfig.home.heroVisual} />
      </section>

      <section className="now-strip section-frame" aria-label="当前状态">
        <div><span className="pulse" /> {siteConfig.name}</div>
        <p>{siteConfig.home.now}</p>
        <span className="mono">{siteConfig.home.location}</span>
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

      <section id="contact" className="contact-cta section-frame" aria-labelledby="contact-heading">
        <p className="eyebrow">{siteConfig.contact.eyebrow}</p>
        <h2 id="contact-heading">{siteConfig.contact.title}<br /><span>{siteConfig.contact.titleAccent}</span></h2>
        <div className="contact-content">
          <div className="contact-copy">
            <p className="contact-intro">{siteConfig.contact.intro}</p>
            <p className="contact-note">{siteConfig.contact.formNote}</p>
            <div className="hero-actions">
              <a className="button button-primary" href={`mailto:${siteConfig.email}`}>发送邮件 <span>↗</span></a>
              {siteConfig.contact.bookingUrl ? <a className="button button-secondary" href={siteConfig.contact.bookingUrl} target="_blank" rel="noreferrer">预约交流</a> : null}
              {siteConfig.contact.resumeUrl ? <a className="button button-secondary" href={siteConfig.contact.resumeUrl} target="_blank" rel="noreferrer">查看简历</a> : null}
            </div>
          </div>
          <div className="contact-options">
            <div className="tag-list">{siteConfig.contact.collaborationTypes.map((type) => <span key={type}>{type}</span>)}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
