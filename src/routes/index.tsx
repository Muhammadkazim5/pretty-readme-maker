import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { marked } from "marked";
import { toast } from "sonner";
import {
  FileText, Sparkles, Package, Play, Tag, ListChecks,
  Heart, Scale, User, Award, Copy, Download, X, Plus, Github,
  Layers, Image as ImageIcon, ExternalLink, Sun, Moon, FileJson, BookOpen, Trash2
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { buildMarkdown, TEMPLATES, type ReadmeData, type CustomBadge } from "@/lib/readme";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "README Generator — Create Stunning GitHub READMEs in Seconds" },
      {
        name: "description",
        content:
          "Free online README generator with live markdown preview, templates, table of contents, and custom shields.io badges. Build professional GitHub README.md files in seconds.",
      },
      { property: "og:title", content: "README Generator — Create Stunning GitHub READMEs in Seconds" },
      {
        property: "og:description",
        content:
          "Build beautiful GitHub README files with live preview, templates, screenshots, custom badges, and auto-generated TOC.",
      },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: "README Generator — Create Stunning GitHub READMEs in Seconds" },
      {
        name: "twitter:description",
        content:
          "Live preview, templates, screenshots, custom shields.io badges, auto TOC — everything you need to ship a great README.",
      },
    ],
  }),
});

marked.setOptions({ gfm: true, breaks: true });

const LICENSES = ["MIT", "Apache 2.0", "GPL 3.0", "BSD 3-Clause", "ISC", "Unlicense"];
const STORAGE_KEY = "readme-generator-draft-v2";

const TEMPLATE_LIST: { id: keyof typeof TEMPLATES; label: string; icon: string }[] = [
  { id: "saas", label: "SaaS", icon: "🚀" },
  { id: "library", label: "Library", icon: "📦" },
  { id: "cli", label: "CLI Tool", icon: "⚡" },
  { id: "portfolio", label: "Portfolio", icon: "🎨" },
];

const defaultState: ReadmeData = {
  name: "",
  description: "",
  tech: [],
  features: [""],
  install: "",
  usage: "",
  contributing: true,
  license: "MIT",
  author: "",
  github: "",
  repo: "",
  demoUrl: "",
  screenshotUrl: "",
  badges: {
    madeWithLove: true, mit: true, openSource: false, prsWelcome: true,
    version: false, stars: false, build: false, downloads: false,
  },
  customBadges: [],
  toc: true,
};

function SectionHeader({ icon: Icon, title }: { icon: typeof FileText; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-[color:var(--accent-glow)]" />
      <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground/90">{title}</h3>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl bg-[color:var(--surface-elevated)] border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30";
const codeInputCls = inputCls + " font-mono";

function Index() {
  const [state, setState] = useState<ReadmeData>(defaultState);
  const [techInput, setTechInput] = useState("");
  const [previewTheme, setPreviewTheme] = useState<"dark" | "light">("dark");
  const [pkgJsonInput, setPkgJsonInput] = useState("");
  const [showPkgImport, setShowPkgImport] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...defaultState, ...JSON.parse(raw) });
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const update = <K extends keyof ReadmeData>(key: K, value: ReadmeData[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const md = useMemo(() => buildMarkdown(state), [state]);
  const html = useMemo(() => marked.parse(md || "") as string, [md]);

  const addTech = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const v = techInput.trim().replace(/,$/, "");
      if (v && !state.tech.includes(v)) update("tech", [...state.tech, v]);
      setTechInput("");
    } else if (e.key === "Backspace" && !techInput && state.tech.length) {
      update("tech", state.tech.slice(0, -1));
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(md);
    toast.success("Copied to clipboard", { description: "Your README markdown is ready to paste." });
  };

  const download = () => {
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "README.md"; a.click();
    URL.revokeObjectURL(url);
    toast.success("README.md downloaded");
  };

  const applyTemplate = (id: keyof typeof TEMPLATES) => {
    setState((s) => ({ ...s, ...TEMPLATES[id] } as ReadmeData));
    toast.success(`Loaded ${id} template`);
  };

  const resetAll = () => {
    if (confirm("Clear everything and start fresh?")) {
      setState(defaultState);
      toast.success("Cleared");
    }
  };

  const importPkg = () => {
    try {
      const p = JSON.parse(pkgJsonInput);
      setState((s) => ({
        ...s,
        name: p.name || s.name,
        description: p.description || s.description,
        install: p.name ? `npm install ${p.name}` : s.install,
        usage: p.scripts?.dev ? "npm run dev" : p.scripts?.start ? "npm start" : s.usage,
        author: typeof p.author === "string" ? p.author : p.author?.name || s.author,
        repo: p.repository?.url?.replace(/^git\+|\.git$/g, "") || p.repository || s.repo,
        license: p.license || s.license,
        tech: p.dependencies ? Object.keys(p.dependencies).slice(0, 8) : s.tech,
      }));
      setPkgJsonInput("");
      setShowPkgImport(false);
      toast.success("Imported from package.json");
    } catch {
      toast.error("Invalid JSON");
    }
  };

  const addCustomBadge = () =>
    update("customBadges", [...state.customBadges, { label: "", message: "", color: "blue" }]);

  const updateCustomBadge = (i: number, patch: Partial<CustomBadge>) =>
    update(
      "customBadges",
      state.customBadges.map((b, j) => (j === i ? { ...b, ...patch } : b)),
    );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster theme="dark" position="bottom-right" />

      {/* Header */}
      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.58_0.24_295/0.25),_transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-6 py-8 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-[color:var(--accent-glow)] grid place-items-center shadow-lg shadow-primary/30">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">README Generator</h1>
              <p className="text-sm text-muted-foreground mt-1">Create stunning GitHub READMEs in seconds</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPkgImport((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-card border border-border hover:border-primary hover:text-primary transition"
            >
              <FileJson className="w-3.5 h-3.5" /> Import package.json
            </button>
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-card border border-border hover:border-destructive hover:text-destructive transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: FORM */}
        <section className="space-y-6">
          {/* Templates */}
          <div className="rounded-2xl bg-card border border-border p-5">
            <SectionHeader icon={Layers} title="Templates" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TEMPLATE_LIST.map((t) => (
                <button
                  key={t.id}
                  onClick={() => applyTemplate(t.id)}
                  className="flex flex-col items-center gap-1 px-3 py-3 rounded-xl bg-[color:var(--surface-elevated)] border border-border hover:border-primary hover:-translate-y-0.5 transition text-center"
                >
                  <span className="text-xl">{t.icon}</span>
                  <span className="text-xs font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {showPkgImport && (
            <div className="rounded-2xl bg-card border border-primary/50 p-5">
              <SectionHeader icon={FileJson} title="Paste package.json" />
              <textarea
                className={inputCls + " min-h-32 font-mono text-xs"}
                placeholder='{ "name": "...", "description": "..." }'
                value={pkgJsonInput}
                onChange={(e) => setPkgJsonInput(e.target.value)}
              />
              <button
                onClick={importPkg}
                disabled={!pkgJsonInput.trim()}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-40"
              >
                Import
              </button>
            </div>
          )}

          <div className="rounded-2xl bg-card border border-border p-5">
            <SectionHeader icon={Sparkles} title="Project" />
            <input className={inputCls} placeholder="Project Name" value={state.name} onChange={(e) => update("name", e.target.value)} />
            <div className="mt-3 relative">
              <textarea
                className={inputCls + " min-h-24 resize-y"}
                placeholder="Short description of your project..."
                maxLength={300}
                value={state.description}
                onChange={(e) => update("description", e.target.value)}
              />
              <div className="text-xs text-muted-foreground mt-1 text-right">
                {state.description.length}/300
              </div>
            </div>
          </div>

          {/* Screenshots & Demo */}
          <div className="rounded-2xl bg-card border border-border p-5 space-y-3">
            <SectionHeader icon={ImageIcon} title="Screenshot & Demo" />
            <input
              className={inputCls}
              placeholder="Screenshot image URL (https://...)"
              value={state.screenshotUrl}
              onChange={(e) => update("screenshotUrl", e.target.value)}
            />
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                className={inputCls + " pl-10"}
                placeholder="Live demo URL"
                value={state.demoUrl}
                onChange={(e) => update("demoUrl", e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-5">
            <SectionHeader icon={Tag} title="Tech Stack" />
            <div className="flex flex-wrap gap-2 p-2 rounded-xl bg-[color:var(--surface-elevated)] border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 transition">
              {state.tech.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/20 text-primary-foreground text-xs font-medium border border-primary/40">
                  {t}
                  <button onClick={() => update("tech", state.tech.filter((x) => x !== t))} className="hover:text-destructive transition">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                className="flex-1 min-w-32 bg-transparent outline-none text-sm py-1 px-1"
                placeholder={state.tech.length ? "" : "Type and press Enter..."}
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={addTech}
              />
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-5">
            <SectionHeader icon={ListChecks} title="Features" />
            <div className="space-y-2">
              {state.features.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className={inputCls}
                    placeholder={`Feature ${i + 1}`}
                    value={f}
                    onChange={(e) => update("features", state.features.map((x, j) => (j === i ? e.target.value : x)))}
                  />
                  <button
                    onClick={() => update("features", state.features.length > 1 ? state.features.filter((_, j) => j !== i) : [""])}
                    className="px-3 rounded-xl border border-border hover:border-destructive hover:text-destructive transition"
                    aria-label="Remove feature"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => update("features", [...state.features, ""])}
                className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition"
              >
                <Plus className="w-4 h-4" /> Add feature
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-5 space-y-4">
            <div>
              <SectionHeader icon={Package} title="Installation" />
              <input className={codeInputCls} placeholder="npm install your-package" value={state.install} onChange={(e) => update("install", e.target.value)} />
            </div>
            <div>
              <SectionHeader icon={Play} title="Usage / Run" />
              <input className={codeInputCls} placeholder="npm run dev" value={state.usage} onChange={(e) => update("usage", e.target.value)} />
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[color:var(--accent-glow)]" />
                <span className="text-sm font-semibold uppercase tracking-wide">Table of Contents</span>
              </div>
              <button
                onClick={() => update("toc", !state.toc)}
                className={`relative w-12 h-6 rounded-full transition ${state.toc ? "bg-primary" : "bg-border"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${state.toc ? "translate-x-6" : ""}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[color:var(--accent-glow)]" />
                <span className="text-sm font-semibold uppercase tracking-wide">Contributing Section</span>
              </div>
              <button
                onClick={() => update("contributing", !state.contributing)}
                className={`relative w-12 h-6 rounded-full transition ${state.contributing ? "bg-primary" : "bg-border"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${state.contributing ? "translate-x-6" : ""}`} />
              </button>
            </div>

            <div>
              <SectionHeader icon={Scale} title="License" />
              <select className={inputCls} value={state.license} onChange={(e) => update("license", e.target.value)}>
                {LICENSES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-5 space-y-3">
            <SectionHeader icon={User} title="Author" />
            <input className={inputCls} placeholder="Author name" value={state.author} onChange={(e) => update("author", e.target.value)} />
            <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className={inputCls + " pl-10"} placeholder="https://github.com/username" value={state.github} onChange={(e) => update("github", e.target.value)} />
            </div>
            <input
              className={inputCls}
              placeholder="Repository (owner/name or full GitHub URL) — for GitHub badges"
              value={state.repo}
              onChange={(e) => update("repo", e.target.value)}
            />
          </div>

          <div className="rounded-2xl bg-card border border-border p-5">
            <SectionHeader icon={Award} title="Badges" />
            <div className="grid grid-cols-2 gap-2">
              {([
                ["madeWithLove", "Made with Love"],
                ["mit", "MIT License"],
                ["openSource", "Open Source"],
                ["prsWelcome", "PRs Welcome"],
                ["version", "Version (GitHub)"],
                ["stars", "GitHub Stars"],
                ["build", "Build Status"],
                ["downloads", "Downloads"],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[color:var(--surface-elevated)] border border-border cursor-pointer hover:border-primary transition">
                  <input
                    type="checkbox"
                    checked={state.badges[key]}
                    onChange={(e) => update("badges", { ...state.badges, [key]: e.target.checked })}
                    className="accent-[color:var(--primary)] w-4 h-4"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Custom Badges</div>
              {state.customBadges.map((b, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_90px_auto] gap-2">
                  <input className={inputCls} placeholder="Label" value={b.label} onChange={(e) => updateCustomBadge(i, { label: e.target.value })} />
                  <input className={inputCls} placeholder="Message" value={b.message} onChange={(e) => updateCustomBadge(i, { message: e.target.value })} />
                  <input className={inputCls} placeholder="color" value={b.color} onChange={(e) => updateCustomBadge(i, { color: e.target.value })} />
                  <button
                    onClick={() => update("customBadges", state.customBadges.filter((_, j) => j !== i))}
                    className="px-3 rounded-xl border border-border hover:border-destructive hover:text-destructive transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addCustomBadge}
                className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition"
              >
                <Plus className="w-4 h-4" /> Add custom badge
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT: PREVIEW */}
        <section className="lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)]">
          <div className="rounded-2xl bg-card border border-border overflow-hidden flex flex-col lg:max-h-[calc(100vh-3rem)]">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-[color:var(--surface-elevated)] sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Live Preview</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewTheme((t) => (t === "dark" ? "light" : "dark"))}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[color:var(--surface)] border border-border hover:border-primary hover:text-primary transition"
                  title="Toggle GitHub light/dark preview"
                >
                  {previewTheme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  {previewTheme === "dark" ? "Light" : "Dark"}
                </button>
                <button
                  onClick={copy}
                  disabled={!md}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[color:var(--surface)] border border-border hover:border-primary hover:text-primary transition disabled:opacity-40"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
                <button
                  onClick={download}
                  disabled={!md}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary to-[color:var(--accent-glow)] text-primary-foreground hover:opacity-90 transition disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>

            <div
              className={`overflow-auto scrollbar-thin p-6 min-h-96 lg:min-h-0 ${previewTheme === "light" ? "preview-light" : ""}`}
            >
              {md ? (
                <article
                  className="prose-readme transition-opacity duration-300"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ) : (
                <div className="h-full min-h-72 grid place-items-center text-center">
                  <div>
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/30 to-[color:var(--accent-glow)]/30 grid place-items-center mb-4">
                      <FileText className="w-8 h-8 text-[color:var(--accent-glow)]" />
                    </div>
                    <p className="text-muted-foreground max-w-xs">
                      Pick a template or start filling the form to see your README come to life
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .prose-readme { color: var(--foreground); line-height: 1.7; font-size: 14px; }
        .prose-readme h1 { font-size: 1.875rem; font-weight: 700; margin: 0 0 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border); }
        .prose-readme h2 { font-size: 1.375rem; font-weight: 600; margin: 1.5rem 0 0.75rem; padding-bottom: 0.4rem; border-bottom: 1px solid var(--border); }
        .prose-readme h3 { font-size: 1.1rem; font-weight: 600; margin: 1.25rem 0 0.5rem; }
        .prose-readme p { margin: 0.5rem 0; }
        .prose-readme ul, .prose-readme ol { padding-left: 1.5rem; margin: 0.5rem 0; }
        .prose-readme li { margin: 0.25rem 0; }
        .prose-readme a { color: var(--accent-glow); text-decoration: underline; text-underline-offset: 2px; }
        .prose-readme code { background: var(--surface-elevated); padding: 0.15rem 0.4rem; border-radius: 0.35rem; font-size: 0.85em; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--accent-glow); }
        .prose-readme pre { background: oklch(0.14 0.03 265); border: 1px solid var(--border); padding: 1rem; border-radius: 0.75rem; overflow-x: auto; margin: 0.75rem 0; }
        .prose-readme pre code { background: transparent; padding: 0; color: var(--foreground); }
        .prose-readme img { display: inline-block; margin: 0.15rem 0.25rem 0.15rem 0; max-width: 100%; }
        .prose-readme strong { color: var(--foreground); font-weight: 600; }
        .prose-readme hr { border-color: var(--border); margin: 1rem 0; }

        .preview-light { background: #ffffff; }
        .preview-light .prose-readme { color: #1f2328; }
        .preview-light .prose-readme h1, .preview-light .prose-readme h2 { border-color: #d1d9e0; }
        .preview-light .prose-readme a { color: #0969da; }
        .preview-light .prose-readme code { background: #eff1f3; color: #1f2328; }
        .preview-light .prose-readme pre { background: #f6f8fa; border-color: #d1d9e0; }
        .preview-light .prose-readme pre code { color: #1f2328; }
        .preview-light .prose-readme strong { color: #1f2328; }
      `}</style>
    </div>
  );
}
