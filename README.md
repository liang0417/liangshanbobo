# Personal AI Portfolio

一个面向文章、个人简历、项目案例和未来实验的开源个人网站。

项目使用 React、Vite、TypeScript 与 React Router Framework Mode。内容页面会在构建阶段预渲染为独立 HTML，适合部署到腾讯云 COS、CloudBase、CDN 或其他静态托管平台。

本仓库定位为公开的网站模板与核心代码。建议把真实个人网站维护在独立私有仓库中，并将本仓库配置为 `upstream`：社区贡献进入公开模板，个人资料、未发布文章与部署配置留在私有实例。

## 当前功能

- AI 科技感响应式首页
- 文章归档与 Markdown 正文
- 作品集和项目摘要
- 关于与经历页面
- 明暗主题切换
- 全局命令面板
- 静态预渲染和路由级 SEO 元信息
- 移动端布局与 reduced-motion 支持

## 本地开发

要求 Node.js 22 或更高版本。

```bash
npm install
npm run dev
```

默认开发地址为 `http://localhost:5173`。

## 验证与构建

```bash
npm run typecheck
npm run build
```

静态文件输出到 `build/client`。文章、项目和其他公开页面应在部署前全部出现在构建日志的 `Prerender` 列表中。

## 内容维护

文章保存在：

```text
app/content/articles/*.md
```

每篇文章包含以下 frontmatter：

```yaml
---
title: "文章标题"
summary: "文章摘要"
publishedAt: "2026-07-13"
readingTime: "8 min"
tags: ["React", "AI"]
featured: false
---
```

项目和经历的示例数据位于 `app/data/site.ts`。

## 个性化清单

正式发布前需要替换：

- `YOUR.NAME`
- `hello@example.com`
- GitHub 地址
- 首页个人定位和项目数据
- 关于页照片与真实经历
- 域名确定后的 canonical、Open Graph、Sitemap 和 RSS 地址

## 公开模板与私人网站

推荐使用两个边界清晰的仓库：

```text
personal-ai-portfolio（公开）  →  组件、主题、博客引擎、示例内容
my-personal-site（私有）       →  真实资料、未发布内容、部署配置
```

在私人网站仓库中添加本项目作为上游：

```bash
git remote add upstream https://github.com/liang0417/personal-ai-portfolio.git
git fetch upstream
git merge upstream/main
```

不要把 API Key、部署令牌或其他秘密放进 React/Vite 前端。以 `VITE_` 开头的变量会进入浏览器构建结果，不适合保存秘密；需要密钥的能力应由服务端接口代理，并配置鉴权、限流与配额。

## 中国大陆部署路线

推荐链路：

```text
GitHub → CI 构建 → build/client → 腾讯云 COS/CloudBase → 国内 CDN → 已备案域名
```

域名、ICP备案、HTTPS 和 CDN 尚未在本仓库中配置。不要在没有真实线上验证的情况下宣称部署完成。

## 开源与内容版权

程序代码使用 [MIT License](LICENSE)。文章、个人简历、照片、项目描述和个人品牌素材不随代码使用 MIT 授权，详见 [CONTENT_LICENSE.md](CONTENT_LICENSE.md)。

参与开发前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)，安全问题请按 [SECURITY.md](SECURITY.md) 的方式报告。
