import { constants } from "node:fs";
import { access, copyFile, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const examplePath = join(projectRoot, "app/data/site.config.example.json");
const activeConfigPath = join(projectRoot, "app/data/site.config.json");
const schemaVersion = 3;

function projectId(name, index) {
  const slug = String(name ?? "project").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "project";
  return `${slug}-${index + 1}`;
}

function normalizeConfig(config) {
  const next = structuredClone(config);
  const site = next.site ?? {};
  next.schemaVersion = schemaVersion;
  next.projects = (next.projects ?? []).map((project, index) => ({ ...project, id: project.id || projectId(project.name, index), url: project.url ?? "" }));
  next.experience ??= [];
  site.navigation = Array.isArray(site.navigation)
    ? site.navigation.filter((item) => item?.href !== "/contact")
    : [];
  site.home = { heroVisual: "three-d", ...site.home };
  site.about ??= { description: "", paragraphs: [], skills: [] };
  site.pages = { articlesDescription: "", projectsDescription: "", articleAuthor: site.name ?? "", ...site.pages };
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
    ...site.contact,
  };
  next.site = site;
  return next;
}

try {
  await access(activeConfigPath, constants.F_OK);
} catch (error) {
  if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") throw error;
  await copyFile(examplePath, activeConfigPath);
  console.log("已从示例创建本地配置：app/data/site.config.json");
}

const current = JSON.parse(await readFile(activeConfigPath, "utf8"));
const normalized = normalizeConfig(current);
const serialized = `${JSON.stringify(normalized, null, 2)}\n`;
if (serialized !== `${JSON.stringify(current, null, 2)}\n`) {
  await writeFile(activeConfigPath, serialized, "utf8");
  console.log("已补齐本地配置的最新字段。");
}
