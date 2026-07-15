import { Link, NavLink } from "react-router";
import { useState } from "react";
import { navigation, siteIdentity } from "~/data/site";
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
        <button className="brand-signal" type="button" onClick={triggerSignal} aria-label="\u89e6\u53d1\u53cc\u4fe1\u53f7\u5f69\u86cb">
          <span className="brand-mark">{siteIdentity.mark}</span>
        </button>
        <Link to="/" aria-label="\u8fd4\u56de\u9996\u9875" reloadDocument>{siteIdentity.wordmark}</Link>
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
      {signalActive && (
        <div className="signal-burst" aria-hidden="true" onAnimationEnd={() => setSignalActive(false)}>
          <span>LSB / ZYT</span>
          {Array.from({ length: 8 }, (_, index) => <i key={index} />)}
        </div>
      )}
    </>
  );
}
