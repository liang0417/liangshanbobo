import { Link } from "react-router";
import { siteConfig } from "~/data/site";

const repositoryUrl = "repositoryUrl" in siteConfig && typeof siteConfig.repositoryUrl === "string" ? siteConfig.repositoryUrl : undefined;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <p className="footer-title">{siteConfig.footer.title}</p>
        <p className="muted">{siteConfig.footer.subtitle}</p>
      </div>
      <div className="footer-links">
        <a href={`mailto:${siteConfig.email}`}>Email</a>
        <a href={siteConfig.githubUrl} target="_blank" rel="noreferrer">GitHub</a>
        {repositoryUrl ? <a href={repositoryUrl} target="_blank" rel="noreferrer">Source</a> : null}
        <Link to="/projects" reloadDocument>Projects</Link>
      </div>
      <p className="footer-meta">© 2026 {siteConfig.name} · Built in public with React & Vite</p>
    </footer>
  );
}
