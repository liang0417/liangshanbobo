import { experience, siteConfig } from "~/data/site";

export function meta() {
  return [{ title: `关于 — ${siteConfig.name}` }, { name: "description", content: siteConfig.about.description }];
}

export default function About() {
  return (
    <main id="main-content" className="page section-frame">
      <header className="about-hero">
        <div>
          <p className="eyebrow">ABOUT / THE HUMAN IN THE LOOP</p>
          <h1>在技术、产品与真实问题之间，<span>持续搭桥。</span></h1>
        </div>
        <div className="portrait-placeholder" aria-label={`${siteConfig.name} identity signal`}>
          <span>{siteConfig.name}</span><small>NO PORTRAIT · SIGNAL ONLY</small>
        </div>
      </header>
      <div className="about-grid">
        <section className="about-copy">
          <h2>我在做什么</h2>
          {siteConfig.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="skill-cloud">
            {siteConfig.about.skills.map((skill) => <span key={skill}>{skill}</span>)}
          </div>
        </section>
        <section>
          <h2>经历</h2>
          <div className="timeline">
            {experience.map((item) => (
              <article key={item.period}><span className="timeline-dot" /><p className="mono">{item.period}</p><h3>{item.role}</h3><p>{item.summary}</p></article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
