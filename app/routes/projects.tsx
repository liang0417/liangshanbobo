import { ProjectCard } from "~/components/project-card";
import { projects, siteIdentity } from "~/data/site";

export function meta() {
  return [{ title: `作品 — ${siteIdentity.name}` }, { name: "description", content: "AI、知识工程与产品交付项目案例。" }];
}

export default function Projects() {
  return (
    <main id="main-content" className="page section-frame">
      <header className="page-hero">
        <p className="eyebrow">PROJECTS / SHIPPED & EXPERIMENTAL</p>
        <h1>作品</h1>
        <p className="lede">我正在构建和已经交付的 AI 产品。这里记录它们解决的问题、采用的方法和当前状态。</p>
      </header>
      <div className="projects-page-grid">
        {projects.map((project, index) => (
          <div key={project.name} className="project-page-item">
            <span className="project-number">0{index + 1}</span>
            <ProjectCard project={project} large={index === 0} />
          </div>
        ))}
      </div>
    </main>
  );
}
