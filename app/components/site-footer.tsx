import { Link } from "react-router";
import { siteIdentity } from "~/data/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <p className="footer-title">构建值得信任的系统。</p>
        <p className="muted">也把值得长期保存的故事，留在其中。</p>
      </div>
      <div className="footer-links">
        <a href={siteIdentity.githubUrl} target="_blank" rel="noreferrer">GitHub</a>
        <a href={siteIdentity.repositoryUrl} target="_blank" rel="noreferrer">Source</a>
        <Link to="/projects" reloadDocument>Projects</Link>
      </div>
      <p className="footer-meta">© 2026 {siteIdentity.name} · LSB / ZYT · Built with React & Vite</p>
    </footer>
  );
}
