import { Link, NavLink } from "react-router";
import { useState } from "react";
import { navigation, siteConfig } from "~/data/site";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const [signalActive, setSignalActive] = useState(false);

  function triggerSignal() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setSignalActive(false);
    window.requestAnimationFrame(() => setSignalActive(true));
  }

  return (
    <>
      <header className="site-header">
        <div className="brand">
          <button className="brand-signal" type="button" onClick={triggerSignal} aria-label="触发双信号彩蛋">
            <span className="brand-mark">{siteConfig.brandMark}</span>
          </button>
          <Link to="/" aria-label={`返回${siteConfig.name}首页`} reloadDocument>{siteConfig.name}</Link>
        </div>
        <nav className="desktop-nav" aria-label="主要导航">
          {navigation.map((item) => (
            <NavLink key={item.href} to={item.href} end={item.href === "/"} reloadDocument>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="header-contact" to="/#contact" reloadDocument>联系我 <span aria-hidden="true">↗</span></Link>
          <button className="command-trigger" type="button" data-command-open>
            <span>搜索</span>
            <kbd>⌘ K</kbd>
          </button>
          <ThemeToggle />
        </div>
      </header>
      {signalActive && (
        <div className="signal-burst" aria-hidden="true" onAnimationEnd={() => setSignalActive(false)}>
          <span>LSB / ZYT</span>
          {Array.from({ length: 8 }, (_, index) => <i key={index} />)}
        </div>
      )}
    </>
  );
}
