import { Link } from "react-router";
import { siteIdentity } from "~/data/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <p className="footer-title">Liangshanbobo</p>
        <p className="muted">产品、文章与正在发生的实验。</p>
      </div>
      <div className="footer-links">
        <a href={siteIdentity.githubUrl} target="_blank" rel="noreferrer">GitHub</a>
        <a href={siteIdentity.repositoryUrl} target="_blank" rel="noreferrer">Source</a>
        <Link to="/projects" reloadDocument>Projects</Link>
      </div>
      <p className="footer-meta">© 2026 {siteIdentity.name} · Shanghai</p>
    </footer>
  );
}
