import { projects } from "~/data/site";

type Project = (typeof projects)[number];

export function ProjectCard({ project, large = false }: { project: Project; large?: boolean }) {
  const mark = project.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

  return (
    <article className={`project-card ${large ? "project-card-large" : ""}`}>
      <div className="project-cover" aria-hidden="true">
        <span className="cover-caption">{project.stack.slice(0, 2).join(" / ")}</span>
        <strong>{mark}</strong>
        <span className="cover-name">{project.name}</span>
      </div>
      <div className="project-copy">
        <div className="card-topline">
          <span>{project.status}</span>
          <span>{project.impact}</span>
        </div>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <div className="tag-list">
          {project.stack.map((item) => <span key={item}>{item}</span>)}
        </div>
      </div>
    </article>
  );
}
