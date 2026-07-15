export const schemaVersion = 3;

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function requireRecord(value, field) {
  if (!isRecord(value)) throw new Error(`${field} 格式无效。`);
  return value;
}

function requireText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} 不能为空。`);
}

function requireTextList(value, field) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`${field} 必须是文本列表。`);
  }
}

function projectId(name, index) {
  const slug = String(name ?? "project").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "project";
  return `${slug}-${index + 1}`;
}

export function normalizeConfig(config) {
  const next = structuredClone(requireRecord(config, "配置"));
  const site = isRecord(next.site) ? next.site : {};

  next.schemaVersion = schemaVersion;
  next.projects = Array.isArray(next.projects)
    ? next.projects.map((project, index) => {
      const item = isRecord(project) ? project : {};
      return { ...item, id: item.id || projectId(item.name, index), url: item.url ?? "" };
    })
    : [];
  next.experience ??= [];
  site.navigation = Array.isArray(site.navigation) ? site.navigation.filter((item) => item?.href !== "/contact") : [];
  site.home = { heroVisual: "three-d", ...(isRecord(site.home) ? site.home : {}) };
  site.about = { description: "", paragraphs: [], skills: [], ...(isRecord(site.about) ? site.about : {}) };
  site.pages = { articlesDescription: "", projectsDescription: "", articleAuthor: site.name ?? "", ...(isRecord(site.pages) ? site.pages : {}) };
  site.footer = { title: "", subtitle: "", ...(isRecord(site.footer) ? site.footer : {}) };
  site.contact = {
    eyebrow: "LET'S WORK TOGETHER",
    title: "有值得一起做的事情？",
    titleAccent: "我们聊聊。",
    intro: `欢迎联系 ${site.name ?? "我"}，一起讨论产品、工程和长期创造。`,
    collaborationTypes: ["AI 产品共创", "技术咨询", "内容交流"],
    bookingUrl: "",
    resumeUrl: "",
    formNote: "可通过邮件发来你的背景、目标和时间安排。",
    ...(isRecord(site.contact) ? site.contact : {}),
  };
  next.site = site;
  return next;
}

export function validateConfig(config) {
  const value = requireRecord(config, "配置");
  const site = requireRecord(value.site, "站点");
  if (!Array.isArray(value.projects) || !Array.isArray(value.experience)) throw new Error("配置缺少项目或经历数据。");

  for (const field of [["name", "姓名"], ["brandMark", "品牌标识"], ["role", "职业定位"], ["email", "邮箱"], ["githubUrl", "GitHub 地址"], ["description", "站点描述"]]) {
    requireText(site[field[0]], field[1]);
  }

  if (!Array.isArray(site.navigation)) throw new Error("导航必须是列表。");
  for (const item of site.navigation) {
    const navigation = requireRecord(item, "导航项");
    requireText(navigation.label, "导航名称");
    requireText(navigation.href, "导航地址");
  }

  const home = requireRecord(site.home, "首页");
  if (home.heroVisual !== "three-d" && home.heroVisual !== "legacy") throw new Error("首页视觉样式无效。");
  for (const field of [["availability", "可用状态"], ["eyebrow", "首页眉题"], ["headline", "首页标题"], ["headlineAccent", "首页强调标题"], ["intro", "首页简介"], ["now", "当前状态"], ["location", "所在地"]]) {
    requireText(home[field[0]], field[1]);
  }
  if (!Array.isArray(home.proof)) throw new Error("首页关键数据必须是列表。");
  for (const item of home.proof) {
    const proof = requireRecord(item, "首页关键数据");
    requireText(proof.value, "关键数据");
    requireText(proof.label, "关键数据说明");
  }

  const about = requireRecord(site.about, "关于页");
  requireText(about.description, "关于页描述");
  requireTextList(about.paragraphs, "介绍段落");
  requireTextList(about.skills, "技能");

  const pages = requireRecord(site.pages, "内容页面");
  for (const field of [["articlesDescription", "文章页说明"], ["projectsDescription", "项目页说明"], ["articleAuthor", "文章署名"]]) {
    requireText(pages[field[0]], field[1]);
  }

  const contact = requireRecord(site.contact, "联系信息");
  for (const field of [["eyebrow", "联系眉题"], ["title", "联系标题"], ["titleAccent", "联系强调标题"], ["intro", "联系简介"], ["bookingUrl", "预约链接"], ["resumeUrl", "简历链接"], ["formNote", "联系说明"]]) {
    if (field[0] === "bookingUrl" || field[0] === "resumeUrl") {
      if (typeof contact[field[0]] !== "string") throw new Error(`${field[1]} 必须是文本。`);
    } else {
      requireText(contact[field[0]], field[1]);
    }
  }
  requireTextList(contact.collaborationTypes, "合作类型");

  const footer = requireRecord(site.footer, "页脚");
  requireText(footer.title, "页脚标题");
  requireText(footer.subtitle, "页脚副标题");

  for (const project of value.projects) {
    const item = requireRecord(project, "项目");
    for (const field of [["id", "项目 ID"], ["name", "项目名称"], ["description", "项目说明"], ["impact", "项目成果"], ["status", "项目状态"]]) {
      requireText(item[field[0]], field[1]);
    }
    requireTextList(item.stack, "项目技术栈");
    if (typeof item.featured !== "boolean") throw new Error("项目首页精选必须是布尔值。");
    if (typeof item.url !== "string") throw new Error("项目链接必须是文本。");
  }

  for (const experience of value.experience) {
    const item = requireRecord(experience, "经历");
    requireText(item.period, "经历时间");
    requireText(item.role, "经历角色");
    requireText(item.summary, "经历说明");
  }
}
