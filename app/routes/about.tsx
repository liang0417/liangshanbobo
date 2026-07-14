import { experience, siteIdentity } from "~/data/site";

export function meta() {
  return [{ title: `关于 — ${siteIdentity.name}` }, { name: "description", content: "Liangshanbobo 的构建方向、能力与工作方式。" }];
}

export default function About() {
  return (
    <main id="main-content" className="page section-frame">
      <header className="about-hero">
        <div>
          <p className="eyebrow">ABOUT / THE HUMAN IN THE LOOP</p>
          <h1>在技术、产品与真实问题之间，<span>持续搭桥。</span></h1>
        </div>
        <div className="portrait-placeholder" aria-label="Liangshanbobo identity signal">
          <span>{siteIdentity.wordmark}</span><small>NO PORTRAIT · SIGNAL ONLY</small>
        </div>
      </header>
      <div className="about-grid">
        <section className="about-copy">
          <h2>我在做什么</h2>
          <p>我是 {siteIdentity.name}，一名 AI 独立开发者与一人公司探索者。我把 Agent、RAG、自动化和产品工程当作杠杆，把模糊想法做成可以运行、验证并持续迭代的系统。</p>
          <p>这里不是传统简历的线上复刻，而是一条公开构建轨迹：项目、技术判断、失败复盘、开源工具，以及正在发生的实验。</p>
          <p>我相信好的系统不只追求效率，也应当为重要的人和重要的时刻留出位置。</p>
          <p className="about-signal">Some signals are meant to be understood quietly. <span>LSB / ZYT</span></p>
          <div className="skill-cloud">
            {["AI Agent", "RAG", "React", "TypeScript", "Python", "System Design", "Product Thinking"].map((skill) => <span key={skill}>{skill}</span>)}
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
