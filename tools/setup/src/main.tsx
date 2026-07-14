import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

type Project = { id: string; name: string; description: string; impact: string; stack: string[]; status: string; featured: boolean; url: string };
type Experience = { period: string; role: string; summary: string };
type Article = { slug: string; title: string; summary: string; publishedAt: string; readingTime: string; tags: string[]; featured: boolean };
type HeroVisualVariant = "three-d" | "legacy";
type Config = {
  schemaVersion: number;
  site: {
    name: string; brandMark: string; role: string; email: string; githubUrl: string; repositoryUrl?: string; description: string;
    navigation: { label: string; href: string }[];
    home: { heroVisual: HeroVisualVariant; availability: string; eyebrow: string; headline: string; headlineAccent: string; intro: string; proof: { value: string; label: string }[]; now: string; location: string };
    about: { description: string; paragraphs: string[]; skills: string[] };
    pages: { articlesDescription: string; projectsDescription: string; articleAuthor: string };
    contact: { eyebrow: string; title: string; titleAccent: string; intro: string; collaborationTypes: string[]; bookingUrl: string; resumeUrl: string; formNote: string };
    footer: { title: string; subtitle: string };
  };
  projects: Project[];
  experience: Experience[];
};
type Profile = { id: string; name: string; updatedAt: string };
type History = { id: string; label: string; createdAt: string };
type State = { config: Config; activeProfileId: string; profiles: Profile[]; history: History[]; articles: Article[] };
type Tab = "global" | "home" | "about" | "projects" | "content" | "contact";

const setupApi = "/api/setup";
const tabs: { id: Tab; label: string; hint: string }[] = [
  { id: "global", label: "全局", hint: "页头、SEO 与站点身份" },
  { id: "home", label: "首页", hint: "首页首屏与当前状态" },
  { id: "about", label: "关于", hint: "简介、技能与经历" },
  { id: "projects", label: "项目", hint: "项目卡片、顺序与链接" },
  { id: "content", label: "内容", hint: "文章元数据与列表页文案" },
  { id: "contact", label: "联系", hint: "合作入口、简历与页脚" },
];
const heroVisualOptions: { value: HeroVisualVariant; title: string; description: string }[] = [
  { value: "three-d", title: "3D 宇宙场景", description: "星空、轨道球与全息投影，视觉表现更强。" },
  { value: "legacy", title: "经典 2D 网络", description: "使用项目原有的节点网络，结构更简洁克制。" },
];

async function request<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${setupApi}${path}`, body ? { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) } : undefined);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "操作失败。");
  return data;
}

function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }

function Field({ label, value, onChange, multiline = false, type = "text" }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; type?: string }) {
  return <label className="field"><span>{label}</span>{multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} /> : <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />}</label>;
}

function TextList({ label, values, onChange, placeholder, addLabel = "添加" }: { label: string; values: string[]; onChange: (values: string[]) => void; placeholder: string; addLabel?: string }) {
  return <section className="list-editor"><div className="section-heading"><h3>{label}</h3><button className="quiet-button" type="button" onClick={() => onChange([...values, ""])}>{addLabel}</button></div>{values.map((value, index) => <div className="list-row" key={`${label}-${index}`}><input aria-label={`${label} ${index + 1}`} placeholder={placeholder} value={value} onChange={(event) => onChange(values.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} /><button className="remove" type="button" aria-label={`删除${label}`} disabled={values.length === 1} onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}>×</button></div>)}</section>;
}

function HeroVisualPicker({ value, onChange }: { value: HeroVisualVariant; onChange: (value: HeroVisualVariant) => void }) {
  return <fieldset className="visual-picker"><legend>首页视觉样式</legend><div>{heroVisualOptions.map((option) => <label className={option.value === value ? "visual-option active" : "visual-option"} key={option.value}><input type="radio" name="heroVisual" value={option.value} checked={option.value === value} onChange={() => onChange(option.value)} data-testid={`hero-visual-${option.value}`} /><span><strong>{option.title}</strong><small>{option.description}</small></span><b>{option.value === value ? "已选择" : "选择"}</b></label>)}</div></fieldset>;
}

function ArticleEditor({ article, onChange, onSave, busy }: { article: Article; onChange: <K extends keyof Article>(key: K, value: Article[K]) => void; onSave: () => void; busy: boolean }) {
  return <article className="article-config-row"><header><div><span>/{article.slug}</span><strong>{article.title}</strong></div><button className="quiet-button" type="button" disabled={busy} onClick={onSave}>保存文章</button></header><div className="article-config-fields"><Field label="标题" value={article.title} onChange={(value) => onChange("title", value)} /><Field label="发布日期" value={article.publishedAt} type="date" onChange={(value) => onChange("publishedAt", value)} /><Field label="阅读时长" value={article.readingTime} onChange={(value) => onChange("readingTime", value)} /><label className="field checkbox-field"><span>首页精选</span><input type="checkbox" checked={article.featured} onChange={(event) => onChange("featured", event.target.checked)} /></label><Field label="标签（用逗号分隔）" value={article.tags.join(", ")} onChange={(value) => onChange("tags", value.split(",").map((item) => item.trim()).filter(Boolean))} /><Field label="摘要" value={article.summary} multiline onChange={(value) => onChange("summary", value)} /></div></article>;
}

function App() {
  const [state, setState] = useState<State>();
  const [draft, setDraft] = useState<Config>();
  const [articleDrafts, setArticleDrafts] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("global");
  const [profileName, setProfileName] = useState("");
  const [message, setMessage] = useState("正在读取本地配置…");
  const [busy, setBusy] = useState(false);

  const syncState = (next: State) => {
    setState(next);
    setDraft(clone(next.config));
    setArticleDrafts(clone(next.articles));
  };

  const refresh = async () => {
    const next = await request<State>("/state");
    syncState(next);
    return next;
  };

  useEffect(() => { void refresh().then(() => setMessage("本地配置已载入。"), (error: Error) => setMessage(error.message)); }, []);

  const run = async (operation: () => Promise<State>, success: string) => {
    setBusy(true);
    try {
      const next = await operation();
      syncState(next);
      setMessage(success);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "操作失败。");
    } finally {
      setBusy(false);
    }
  };

  if (!state || !draft) return <main className="loading">{message}</main>;

  const updateSite = <K extends keyof Config["site"]>(key: K, value: Config["site"][K]) => setDraft((current) => current ? { ...current, site: { ...current.site, [key]: value } } : current);
  const updateHome = <K extends keyof Config["site"]["home"]>(key: K, value: Config["site"]["home"][K]) => updateSite("home", { ...draft.site.home, [key]: value });
  const updateProject = <K extends keyof Project>(id: string, key: K, value: Project[K]) => setDraft((current) => current ? { ...current, projects: current.projects.map((project) => project.id === id ? { ...project, [key]: value } : project) } : current);
  const moveProject = (id: string, direction: -1 | 1) => setDraft((current) => {
    if (!current) return current;
    const index = current.projects.findIndex((project) => project.id === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= current.projects.length) return current;
    const projects = [...current.projects];
    [projects[index], projects[nextIndex]] = [projects[nextIndex], projects[index]];
    return { ...current, projects };
  });
  const updateExperience = (index: number, key: keyof Experience, value: string) => setDraft((current) => current ? { ...current, experience: current.experience.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item) } : current);
  const updateArticle = <K extends keyof Article>(slug: string, key: K, value: Article[K]) => setArticleDrafts((current) => current.map((article) => article.slug === slug ? { ...article, [key]: value } : article));
  const currentTab = tabs.find((tab) => tab.id === activeTab)!;

  return <main className="setup-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">A</span><span>CONFIG / LOCAL</span></div>
      <div className="sidebar-copy"><h1>配置管理器</h1><p>所有改动只写入当前项目本地文件。</p></div>
      <section className="profile-list" aria-label="配置方案">
        <div className="section-label">配置方案</div>
        {state.profiles.map((profile) => <button className={profile.id === state.activeProfileId ? "profile active" : "profile"} key={profile.id} disabled={busy || profile.id === state.activeProfileId} onClick={() => void run(() => request<State>(`/profiles/${profile.id}/activate`, {}), `已切换到“${profile.name}”。`)}><span>{profile.name}</span><small>{profile.id === state.activeProfileId ? "当前" : "切换"}</small></button>)}
      </section>
      <form className="new-profile" onSubmit={(event) => { event.preventDefault(); const name = profileName.trim(); if (name) void run(() => request<State>("/profiles", { name }), `已创建并启用“${name}”。`).then(() => setProfileName("")); }}>
        <input aria-label="新方案名称" data-testid="new-profile-name" placeholder="新方案名称" value={profileName} onChange={(event) => setProfileName(event.target.value)} />
        <button type="submit" data-testid="create-profile" disabled={busy || !profileName.trim()}>新建</button>
      </form>
      <p className="local-note"><span /> 仅限 127.0.0.1</p>
    </aside>

    <section className="editor">
      <header className="editor-header"><div><p className="section-label">当前方案 / {state.profiles.find((profile) => profile.id === state.activeProfileId)?.name}</p><h2>编辑网站资料</h2></div><button className="save" data-testid="save-config" disabled={busy} onClick={() => void run(() => request<State>("/save", { config: draft }), "已保存，并在保存前创建历史快照。")}><span>{busy ? "处理中" : "保存配置"}</span><b>↗</b></button></header>
      <p className="message" role="status">{message}</p>
      <nav className="setup-tabs" aria-label="配置模块">{tabs.map((tab) => <button key={tab.id} type="button" className={tab.id === activeTab ? "active" : ""} onClick={() => setActiveTab(tab.id)}><strong>{tab.label}</strong><small>{tab.hint}</small></button>)}</nav>
      <p className="impact-note">当前模块会影响：{currentTab.hint}。保存前仅保留在草稿中。</p>

      {activeTab === "global" ? <section className="editor-section"><div className="section-heading"><h3>站点身份</h3><span>同步到页头、SEO 和页脚</span></div><div className="field-grid"><Field label="名称" value={draft.site.name} onChange={(value) => updateSite("name", value)} /><Field label="品牌标识" value={draft.site.brandMark} onChange={(value) => updateSite("brandMark", value.slice(0, 4))} /><Field label="职业定位" value={draft.site.role} onChange={(value) => updateSite("role", value)} /><Field label="联系邮箱" value={draft.site.email} type="email" onChange={(value) => updateSite("email", value)} /><Field label="GitHub 地址" value={draft.site.githubUrl} type="url" onChange={(value) => updateSite("githubUrl", value)} /><Field label="源码地址（可选）" value={draft.site.repositoryUrl ?? ""} type="url" onChange={(value) => updateSite("repositoryUrl", value)} /></div><Field label="默认 SEO 描述" value={draft.site.description} multiline onChange={(value) => updateSite("description", value)} /></section> : null}

      {activeTab === "home" ? <section className="editor-section"><div className="section-heading"><h3>首页首屏</h3><span>影响首页标题、状态、关键信息与右侧视觉</span></div><HeroVisualPicker value={draft.site.home.heroVisual} onChange={(value) => updateHome("heroVisual", value)} /><div className="field-grid"><Field label="可用状态" value={draft.site.home.availability} onChange={(value) => updateHome("availability", value)} /><Field label="眉题" value={draft.site.home.eyebrow} onChange={(value) => updateHome("eyebrow", value)} /><Field label="主标题" value={draft.site.home.headline} onChange={(value) => updateHome("headline", value)} /><Field label="强调标题" value={draft.site.home.headlineAccent} onChange={(value) => updateHome("headlineAccent", value)} /><Field label="当前状态" value={draft.site.home.now} onChange={(value) => updateHome("now", value)} /><Field label="所在地" value={draft.site.home.location} onChange={(value) => updateHome("location", value)} /></div><Field label="首页简介" value={draft.site.home.intro} multiline onChange={(value) => updateHome("intro", value)} /><div className="section-heading"><h3>关键数据</h3></div>{draft.site.home.proof.map((item, index) => <div className="field-grid" key={`${item.label}-${index}`}><Field label={`数据 ${index + 1}`} value={item.value} onChange={(value) => updateHome("proof", draft.site.home.proof.map((proof, proofIndex) => proofIndex === index ? { ...proof, value } : proof))} /><Field label="说明" value={item.label} onChange={(value) => updateHome("proof", draft.site.home.proof.map((proof, proofIndex) => proofIndex === index ? { ...proof, label: value } : proof))} /></div>)}</section> : null}

      {activeTab === "about" ? <section className="editor-section"><div className="section-heading"><h3>关于与经历</h3><span>影响关于页与首页构建轨迹</span></div><Field label="关于页描述" value={draft.site.about.description} onChange={(value) => updateSite("about", { ...draft.site.about, description: value })} /><TextList label="介绍段落" values={draft.site.about.paragraphs} placeholder="写下你的工作方式" onChange={(paragraphs) => updateSite("about", { ...draft.site.about, paragraphs })} addLabel="添加段落" /><TextList label="技能" values={draft.site.about.skills} placeholder="例如 TypeScript" onChange={(skills) => updateSite("about", { ...draft.site.about, skills })} addLabel="添加技能" /><div className="section-heading"><h3>经历时间线</h3><button className="quiet-button" type="button" onClick={() => setDraft((current) => current ? { ...current, experience: [...current.experience, { period: "NOW", role: "新经历", summary: "补充这段经历的说明。" }] } : current)}>添加经历</button></div>{draft.experience.map((item, index) => <article className="project-row" key={`${item.period}-${index}`}><div className="project-number">{String(index + 1).padStart(2, "0")}</div><div className="project-fields"><Field label="时间" value={item.period} onChange={(value) => updateExperience(index, "period", value)} /><Field label="角色" value={item.role} onChange={(value) => updateExperience(index, "role", value)} /><Field label="说明" value={item.summary} multiline onChange={(value) => updateExperience(index, "summary", value)} /></div><button className="remove" type="button" aria-label="删除经历" disabled={draft.experience.length === 1} onClick={() => setDraft((current) => current ? { ...current, experience: current.experience.filter((_, itemIndex) => itemIndex !== index) } : current)}>×</button></article>)}</section> : null}

      {activeTab === "projects" ? <section className="editor-section"><div className="section-heading"><h3>项目</h3><button className="quiet-button" type="button" onClick={() => setDraft((current) => current ? { ...current, projects: [...current.projects, { id: `project-${Date.now()}`, name: "新项目", description: "用一句话说明它解决的问题。", impact: "待补充成果", stack: [], status: "规划中", featured: false, url: "" }] } : current)}>添加项目</button></div><div className="project-editor">{draft.projects.map((project, index) => <article className="project-row" key={project.id}><div className="project-number">{String(index + 1).padStart(2, "0")}</div><div className="project-fields"><Field label="项目名称" value={project.name} onChange={(value) => updateProject(project.id, "name", value)} /><Field label="状态" value={project.status} onChange={(value) => updateProject(project.id, "status", value)} /><Field label="成果" value={project.impact} onChange={(value) => updateProject(project.id, "impact", value)} /><Field label="技术栈（用逗号分隔）" value={project.stack.join(", ")} onChange={(value) => updateProject(project.id, "stack", value.split(",").map((item) => item.trim()).filter(Boolean))} /><Field label="项目链接" value={project.url} type="url" onChange={(value) => updateProject(project.id, "url", value)} /><label className="field checkbox-field"><span>首页精选</span><input type="checkbox" checked={project.featured} onChange={(event) => updateProject(project.id, "featured", event.target.checked)} /></label><Field label="项目说明" value={project.description} multiline onChange={(value) => updateProject(project.id, "description", value)} /></div><div className="project-actions"><button className="quiet-button" type="button" disabled={index === 0} onClick={() => moveProject(project.id, -1)}>上移</button><button className="quiet-button" type="button" disabled={index === draft.projects.length - 1} onClick={() => moveProject(project.id, 1)}>下移</button><button className="remove" type="button" aria-label={`删除${project.name}`} disabled={draft.projects.length === 1} onClick={() => setDraft((current) => current ? { ...current, projects: current.projects.filter((item) => item.id !== project.id) } : current)}>×</button></div></article>)}</div></section> : null}

      {activeTab === "content" ? <section className="editor-section"><div className="section-heading"><h3>内容页面</h3><span>文章正文继续由 Markdown 管理</span></div><Field label="文章页说明" value={draft.site.pages.articlesDescription} multiline onChange={(value) => updateSite("pages", { ...draft.site.pages, articlesDescription: value })} /><Field label="项目页说明" value={draft.site.pages.projectsDescription} multiline onChange={(value) => updateSite("pages", { ...draft.site.pages, projectsDescription: value })} /><Field label="文章署名" value={draft.site.pages.articleAuthor} onChange={(value) => updateSite("pages", { ...draft.site.pages, articleAuthor: value })} /><div className="section-heading article-list-heading"><div><h3>文章列表</h3><span>修改标题、摘要、日期、标签和精选状态会直接更新对应 Markdown。</span></div><span>{articleDrafts.length} 篇文章</span></div><div className="article-editor">{articleDrafts.map((article) => <ArticleEditor key={article.slug} article={article} busy={busy} onChange={(key, value) => updateArticle(article.slug, key, value)} onSave={() => void run(() => request<State>(`/articles/${article.slug}`, { article }), `已保存「${article.title}」。`)} />)}</div></section> : null}

      {activeTab === "contact" ? <section className="editor-section"><div className="section-heading"><h3>合作与联系</h3><span>影响 /contact、首页入口和页脚</span></div><div className="field-grid"><Field label="眉题" value={draft.site.contact.eyebrow} onChange={(value) => updateSite("contact", { ...draft.site.contact, eyebrow: value })} /><Field label="主标题" value={draft.site.contact.title} onChange={(value) => updateSite("contact", { ...draft.site.contact, title: value })} /><Field label="强调标题" value={draft.site.contact.titleAccent} onChange={(value) => updateSite("contact", { ...draft.site.contact, titleAccent: value })} /><Field label="预约链接（可选）" value={draft.site.contact.bookingUrl} type="url" onChange={(value) => updateSite("contact", { ...draft.site.contact, bookingUrl: value })} /><Field label="简历链接（可选）" value={draft.site.contact.resumeUrl} type="url" onChange={(value) => updateSite("contact", { ...draft.site.contact, resumeUrl: value })} /></div><Field label="联系简介" value={draft.site.contact.intro} multiline onChange={(value) => updateSite("contact", { ...draft.site.contact, intro: value })} /><Field label="联系说明" value={draft.site.contact.formNote} multiline onChange={(value) => updateSite("contact", { ...draft.site.contact, formNote: value })} /><TextList label="合作类型" values={draft.site.contact.collaborationTypes} placeholder="例如 AI 产品共创" onChange={(collaborationTypes) => updateSite("contact", { ...draft.site.contact, collaborationTypes })} addLabel="添加类型" /><div className="section-heading"><h3>页脚</h3></div><Field label="页脚标题" value={draft.site.footer.title} onChange={(value) => updateSite("footer", { ...draft.site.footer, title: value })} /><Field label="页脚副标题" value={draft.site.footer.subtitle} onChange={(value) => updateSite("footer", { ...draft.site.footer, subtitle: value })} /></section> : null}
    </section>

    <aside className="history"><header><p className="section-label">自动备份</p><h2>历史配置</h2><span>{state.history.length} 个快照</span></header><div className="history-list">{state.history.length === 0 ? <p className="empty">首次保存后，历史版本会显示在这里。</p> : state.history.map((entry) => <article key={entry.id}><i /><div><strong>{entry.label}</strong><time>{new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(entry.createdAt))}</time></div><button disabled={busy} onClick={() => void run(() => request<State>(`/history/${entry.id}/restore`, {}), "已恢复历史版本，并已备份恢复前的配置。")}>恢复</button></article>)}</div></aside>
  </main>;
}

createRoot(document.getElementById("root")!).render(<App />);
