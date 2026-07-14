import { useEffect, useMemo, useRef, useState } from "react";
import { navigation, projects } from "~/data/site";

const commands = [
  ...navigation.map((item) => ({ label: item.label, hint: "页面", href: item.href })),
  ...projects.map((project) => ({ label: project.name, hint: "作品", href: "/projects" })),
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    }

    function onTrigger(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (target.closest("[data-command-open]")) setOpen(true);
    }

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onTrigger);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onTrigger);
    };
  }, []);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 0);
    else setQuery("");
  }, [open]);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return commands;
    return commands.filter((item) => item.label.toLowerCase().includes(normalized));
  }, [query]);

  if (!open) return null;

  return (
    <div className="command-backdrop" role="presentation" onMouseDown={() => setOpen(false)}>
      <div className="command-panel" role="dialog" aria-modal="true" aria-label="快速导航" onMouseDown={(event) => event.stopPropagation()}>
        <div className="command-input-wrap">
          <span aria-hidden="true">⌕</span>
          <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索页面或作品…" />
          <kbd>ESC</kbd>
        </div>
        <div className="command-results">
          {results.map((item, index) => (
            <button
              key={`${item.label}-${index}`}
              type="button"
              onClick={() => {
                setOpen(false);
                const path = item.href === "/" ? "" : item.href.slice(1);
                window.location.assign(`${import.meta.env.BASE_URL}${path}`);
              }}
            >
              <span>{item.label}</span>
              <small>{item.hint}</small>
            </button>
          ))}
          {results.length === 0 && <p className="command-empty">没有找到匹配内容。</p>}
        </div>
      </div>
    </div>
  );
}
