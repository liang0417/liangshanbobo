import { Link, NavLink } from "react-router";
import { navigation, siteIdentity } from "~/data/site";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="brand">
        <Link to="/" aria-label="返回首页" reloadDocument>
          {siteIdentity.wordmark.toLowerCase()}<span>.</span>
        </Link>
      </div>
      <nav className="desktop-nav" aria-label="主要导航">
        {navigation.map((item) => (
          <NavLink key={item.href} to={item.href} end={item.href === "/"} reloadDocument>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="header-actions">
        <button className="command-trigger" type="button" data-command-open>
          <span>搜索</span>
          <kbd>⌘ K</kbd>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
