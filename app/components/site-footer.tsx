import { Link } from "react-router";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <p className="footer-title">让想法成为可交付的产品。</p>
        <p className="muted">开放交流 AI、工程、产品与长期创造。</p>
      </div>
      <div className="footer-links">
        <a href="mailto:hello@example.com">Email</a>
        <a href="https://github.com/" rel="noreferrer">GitHub</a>
        <Link to="/projects">Projects</Link>
      </div>
      <p className="footer-meta">© 2026 YOUR.NAME · Built with React & Vite</p>
    </footer>
  );
}
