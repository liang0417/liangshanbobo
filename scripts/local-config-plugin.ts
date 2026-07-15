import { randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin, ViteDevServer } from "vite";
import matter from "gray-matter";

const projectRoot = process.cwd();
const activeConfigPath = join(projectRoot, "app/data/site.config.json");
const setupTemplatePath = join(projectRoot, "tools/setup/index.html");
const articlesPath = join(projectRoot, "app/content/articles");
const storePath = join(projectRoot, ".portfolio-config");
const profilesPath = join(storePath, "profiles");
const historyPath = join(storePath, "history");
const indexPath = join(storePath, "index.json");
const historyLimit = 30;
const schemaVersion = 3;
const articleSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type ConfigIndex = {
  version: number;
  activeProfileId: string;
  profiles: { id: string; name: string; updatedAt: string }[];
  history: { id: string; label: string; createdAt: string }[];
};

type ArticleRecord = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
  featured: boolean;
};

async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, "utf8")) as T;
}

async function writeJsonAtomically(path: string, value: unknown) {
  await mkdir(dirname(path), { recursive: true });
  const temporaryPath = `${path}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporaryPath, path);
}

function requireText(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} 不能为空。`);
}

function parseArticle(slug: string, data: Record<string, unknown>): ArticleRecord {
  return {
    slug,
    title: String(data.title ?? slug),
    summary: String(data.summary ?? ""),
    publishedAt: String(data.publishedAt ?? ""),
    readingTime: String(data.readingTime ?? "5 min"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    featured: Boolean(data.featured),
  };
}

async function listArticles(): Promise<ArticleRecord[]> {
  const entries = await readdir(articlesPath, { withFileTypes: true });
  const articles = await Promise.all(entries.filter((entry) => entry.isFile() && entry.name.endsWith(".md")).map(async (entry) => {
    const slug = entry.name.replace(/\.md$/, "");
    const source = matter(await readFile(join(articlesPath, entry.name), "utf8"));
    return parseArticle(slug, source.data);
  }));
  return articles.sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
}

async function readArticleSource(slug: string) {
  const filePath = join(articlesPath, `${slug}.md`);
  const source = matter(await readFile(filePath, "utf8"));
  return { filePath, content: source.content, data: source.data as Record<string, unknown> };
}

async function createArticle(article: ArticleRecord) {
  const filePath = join(articlesPath, `${article.slug}.md`);
  const { slug: _slug, ...metadata } = article;
  try {
    await writeFile(filePath, matter.stringify("在这里开始写作。\n", metadata), { encoding: "utf8", flag: "wx" });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "EEXIST") {
      throw new Error("已存在相同 URL 标识的文章。");
    }
    throw error;
  }
}

function validateArticle(value: unknown): asserts value is ArticleRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("文章格式无效。");
  const article = value as Record<string, unknown>;
  if (typeof article.slug !== "string" || !articleSlugPattern.test(article.slug)) throw new Error("文章标识无效。");
  requireText(article.title, "文章标题");
  requireText(article.summary, "文章摘要");
  requireText(article.publishedAt, "发布日期");
  requireText(article.readingTime, "阅读时长");
  if (!Array.isArray(article.tags) || article.tags.some((tag) => typeof tag !== "string")) throw new Error("文章标签必须是文本列表。");
  if (typeof article.featured !== "boolean") throw new Error("首页精选必须是布尔值。");
}

function projectId(name: unknown, index: number) {
  const slug = String(name ?? "project").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "project";
  return `${slug}-${index + 1}`;
}

function normalizeConfig(config: unknown) {
  const next = structuredClone(config) as { schemaVersion?: number; site?: Record<string, unknown>; projects?: Record<string, unknown>[]; experience?: unknown[] };
  if (!next || typeof next !== "object" || Array.isArray(next)) throw new Error("配置格式无效。");
  const site = next.site ?? {};
  next.schemaVersion = schemaVersion;
  next.projects = (next.projects ?? []).map((project, index) => ({ ...project, id: project.id || projectId(project.name, index), url: project.url ?? "" }));
  next.experience ??= [];
  site.navigation = Array.isArray(site.navigation)
    ? (site.navigation as { href?: unknown }[]).filter((item) => item?.href !== "/contact")
    : [];
  site.home = { heroVisual: "three-d", ...(site.home as Record<string, unknown> | undefined) };
  site.about ??= { description: "", paragraphs: [], skills: [] };
  site.pages = { articlesDescription: "", projectsDescription: "", articleAuthor: site.name ?? "", ...(site.pages as Record<string, unknown> | undefined) };
  site.footer ??= { title: "", subtitle: "" };
  site.contact = {
    eyebrow: "LET'S WORK TOGETHER",
    title: "有值得一起做的事情？",
    titleAccent: "我们聊聊。",
    intro: `欢迎联系 ${site.name ?? "我"}，一起讨论产品、工程和长期创造。`,
    collaborationTypes: ["AI 产品共创", "技术咨询", "内容交流"],
    bookingUrl: "",
    resumeUrl: "",
    formNote: "可通过邮件发来你的背景、目标和时间安排。",
    ...(site.contact as Record<string, unknown> | undefined),
  };
  next.site = site;
  return next;
}

function validateConfig(config: unknown) {
  if (!config || typeof config !== "object" || Array.isArray(config)) throw new Error("配置格式无效。");
  const value = config as { site?: Record<string, unknown>; projects?: unknown[]; experience?: unknown[] };
  if (!value.site || !Array.isArray(value.projects) || !Array.isArray(value.experience)) throw new Error("配置缺少站点、项目或经历数据。");

  requireText(value.site.name, "姓名");
  requireText(value.site.role, "职业定位");
  requireText(value.site.email, "邮箱");
  requireText(value.site.githubUrl, "GitHub 地址");
  requireText(value.site.description, "站点描述");
  const home = value.site.home as Record<string, unknown> | undefined;
  requireText(home?.headline, "首页标题");
  requireText(home?.intro, "首页简介");
  if (home?.heroVisual !== "three-d" && home?.heroVisual !== "legacy") throw new Error("首页视觉样式无效。");

  for (const project of value.projects) {
    const item = project as Record<string, unknown> | undefined;
    requireText(item?.id, "项目 ID");
    requireText(item?.name, "项目名称");
    requireText(item?.description, "项目说明");
    requireText(item?.impact, "项目成果");
    requireText(item?.status, "项目状态");
    if (!Array.isArray(item?.stack) || item.stack.some((entry) => typeof entry !== "string")) {
      throw new Error("项目技术栈必须是文本列表。");
    }
  }
}

function profileFile(id: string) {
  return join(profilesPath, `${id}.json`);
}

function historyFile(id: string) {
  return join(historyPath, `${id}.json`);
}

async function ensureStore(): Promise<ConfigIndex> {
  await Promise.all([mkdir(profilesPath, { recursive: true }), mkdir(historyPath, { recursive: true })]);
  try {
    return await readJson<ConfigIndex>(indexPath);
  } catch {
    const config = await readJson(activeConfigPath);
    const index: ConfigIndex = {
      version: 1,
      activeProfileId: "default",
      profiles: [{ id: "default", name: "默认方案", updatedAt: new Date().toISOString() }],
      history: [],
    };
    await writeJsonAtomically(profileFile("default"), config);
    await writeJsonAtomically(indexPath, index);
    return index;
  }
}

async function snapshot(index: ConfigIndex, config: unknown, label: string) {
  const id = `${Date.now()}-${randomUUID().slice(0, 8)}`;
  index.history.unshift({ id, label, createdAt: new Date().toISOString() });
  await writeJsonAtomically(historyFile(id), config);
  const removed = index.history.splice(historyLimit);
  await Promise.all(removed.map((item) => rm(historyFile(item.id), { force: true })));
}

async function currentState() {
  const index = await ensureStore();
  const [config, articles] = await Promise.all([readJson(activeConfigPath), listArticles()]);
  return { config: normalizeConfig(config), activeProfileId: index.activeProfileId, profiles: index.profiles, history: index.history, articles };
}

function sendJson(response: ServerResponse, statusCode: number, value: unknown) {
  response.writeHead(statusCode, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  response.end(JSON.stringify(value));
}

async function readRequestBody(request: IncomingMessage) {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 1024 * 1024) throw new Error("请求内容过大。");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as { config?: unknown; name?: unknown; article?: unknown };
}

function isTrustedRequest(request: IncomingMessage) {
  const origin = request.headers.origin;
  if (!origin) return true;
  try {
    const { hostname } = new URL(origin);
    return hostname === "127.0.0.1" || hostname === "localhost" || hostname === "::1";
  } catch {
    return false;
  }
}

async function handleApi(request: IncomingMessage, response: ServerResponse, server: ViteDevServer) {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");
  if (!isTrustedRequest(request)) return sendJson(response, 403, { error: "只允许本机配置向导访问。" });

  try {
    if (request.method === "GET" && url.pathname === "/api/setup/state") return sendJson(response, 200, await currentState());
    if (request.method !== "POST") return sendJson(response, 405, { error: "不支持的操作。" });

    const payload = await readRequestBody(request);
    const index = await ensureStore();
    const active = await readJson(activeConfigPath);

    if (url.pathname === "/api/setup/save") {
      const nextConfig = normalizeConfig(payload.config);
      validateConfig(nextConfig);
      const profile = index.profiles.find((item) => item.id === index.activeProfileId);
      await snapshot(index, active, `保存前：${profile?.name ?? "当前方案"}`);
      await writeJsonAtomically(activeConfigPath, nextConfig);
      await writeJsonAtomically(profileFile(index.activeProfileId), nextConfig);
      if (profile) profile.updatedAt = new Date().toISOString();
      await writeJsonAtomically(indexPath, index);
      return sendJson(response, 200, await currentState());
    }

    if (url.pathname === "/api/setup/profiles") {
      const name = String(payload.name ?? "").trim();
      if (!name) throw new Error("请输入方案名称。");
      if (index.profiles.some((item) => item.name === name)) throw new Error("已存在同名方案。");
      const id = `profile-${Date.now().toString(36)}`;
      const profile = { id, name, updatedAt: new Date().toISOString() };
      await writeJsonAtomically(profileFile(id), active);
      index.profiles.push(profile);
      index.activeProfileId = id;
      await writeJsonAtomically(indexPath, index);
      return sendJson(response, 200, await currentState());
    }

    const activateMatch = url.pathname.match(/^\/api\/setup\/profiles\/(profile-[a-z0-9-]+|default)\/activate$/);
    if (activateMatch) {
      const profile = index.profiles.find((item) => item.id === activateMatch[1]);
      if (!profile) throw new Error("找不到该配置方案。");
      const nextConfig = normalizeConfig(await readJson(profileFile(profile.id)));
      validateConfig(nextConfig);
      await snapshot(index, active, `切换前：${index.profiles.find((item) => item.id === index.activeProfileId)?.name ?? "当前方案"}`);
      await writeJsonAtomically(activeConfigPath, nextConfig);
      index.activeProfileId = profile.id;
      profile.updatedAt = new Date().toISOString();
      await writeJsonAtomically(indexPath, index);
      return sendJson(response, 200, await currentState());
    }

    const restoreMatch = url.pathname.match(/^\/api\/setup\/history\/(\d+-[a-f0-9-]+)\/restore$/);
    if (restoreMatch) {
      const entry = index.history.find((item) => item.id === restoreMatch[1]);
      if (!entry) throw new Error("找不到该历史版本。");
      const restored = normalizeConfig(await readJson(historyFile(entry.id)));
      validateConfig(restored);
      await snapshot(index, active, `恢复前：${entry.label}`);
      await writeJsonAtomically(activeConfigPath, restored);
      await writeJsonAtomically(profileFile(index.activeProfileId), restored);
      await writeJsonAtomically(indexPath, index);
      return sendJson(response, 200, await currentState());
    }

    if (url.pathname === "/api/setup/articles") {
      validateArticle(payload.article);
      await createArticle(payload.article);
      sendJson(response, 200, await currentState());
      setTimeout(() => { void server.restart(); }, 0);
      return;
    }

    const articleMatch = url.pathname.match(/^\/api\/setup\/articles\/([a-z0-9]+(?:-[a-z0-9]+)*)$/);
    if (articleMatch) {
      validateArticle(payload.article);
      if (payload.article.slug !== articleMatch[1]) throw new Error("文章标识不匹配。");
      const source = await readArticleSource(articleMatch[1]);
      const { slug: _slug, ...metadata } = payload.article;
      await writeFile(source.filePath, matter.stringify(source.content, { ...source.data, ...metadata }), "utf8");
      return sendJson(response, 200, await currentState());
    }

    return sendJson(response, 404, { error: "找不到配置接口。" });
  } catch (error) {
    return sendJson(response, 400, { error: error instanceof Error ? error.message : "保存失败。" });
  }
}

export function localConfigPlugin(): Plugin {
  return {
    name: "local-config-manager",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const url = new URL(request.url ?? "/", "http://127.0.0.1");
        if (url.pathname.startsWith("/api/setup/")) {
          await handleApi(request, response, server);
          return;
        }
        if (request.method === "GET" && (url.pathname === "/setup" || url.pathname === "/setup/")) {
          try {
            const html = await readFile(setupTemplatePath, "utf8");
            const transformed = await server.transformIndexHtml("/setup", html);
            response.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
            response.end(transformed);
          } catch (error) {
            next(error);
          }
          return;
        }
        next();
      });
    },
  };
}
