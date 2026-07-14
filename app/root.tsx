import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
  isRouteErrorResponse,
  useRouteError,
} from "react-router";
import type { Route } from "./+types/root";
import { CommandPalette } from "~/components/command-palette";
import { SiteFooter } from "~/components/site-footer";
import { SiteHeader } from "~/components/site-header";
import "~/styles/global.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" data-theme="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#07090d" />
        <Meta />
        <Links />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          跳到主要内容
        </a>
        <div className="site-shell">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
        <CommandPalette />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const title = isRouteErrorResponse(error) && error.status === 404 ? "页面不存在" : "页面暂时不可用";

  return (
    <main id="main-content" className="page page-center">
      <p className="eyebrow">SYSTEM / 404</p>
      <h1>{title}</h1>
      <p className="lede">可能是链接发生了变化，也可能是这部分内容仍在构建中。</p>
      <Link className="button button-primary" to="/">
        返回首页
      </Link>
    </main>
  );
}
