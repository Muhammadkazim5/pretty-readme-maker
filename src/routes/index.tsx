import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type KeyboardEvent } from "react";
import { marked } from "marked";
import { toast } from "sonner";
import {
  FileText, Sparkles, Package, Play, Tag, ListChecks,
  Heart, Scale, User, Award, Copy, Download, X, Plus, Github
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { buildMarkdown } from "@/lib/readme";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "README Generator — Create Stunning GitHub READMEs in Seconds" },
      {
        name: "description",
        content:
          "Free online README generator with live markdown preview. Build professional GitHub README.md files with badges, tech stack, features, and license in seconds.",
      },
      { property: "og:title", content: "README Generator — Create Stunning GitHub READMEs in Seconds" },
      {
        property: "og:description",
        content:
          "Build beautiful GitHub README files with a live markdown preview. Badges, tech stack, features, installation — all in one place.",
      },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: "README Generator — Create Stunning GitHub READMEs in Seconds" },
      {
        name: "twitter:description",
        content:
          "Build beautiful GitHub README files with a live markdown preview. Badges, tech stack, features, installation — all in one place.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is a README generator?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "A README generator is a tool that helps developers create professional README.md files for their GitHub repositories by filling out a simple form and previewing the markdown output in real time.",
              },
            },
            {
              "@type": "Question",
              name: "Is this README generator free?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. README Generator is completely free to use. You can build, copy, and download as many README.md files as you want.",
              },
            },
            {
              "@type": "Question",
              name: "Can I add shields.io badges?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. You can toggle popular badges such as MIT License, Made with Love, Open Source, and PRs Welcome, and they will render directly in your README.",
              },
            },
            {
              "@type": "Question",
              name: "How do I download the README file?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Fill out the form on the left, then click the Download button at the top of the live preview to save the file as README.md.",
              },
            },
          ],
        }),
      },
    ],
  }),
});

marked.setOptions({ gfm: true, breaks: true });

const LICENSES = ["MIT", "Apache 2.0", "GPL 3.0"];

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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tech, setTech] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [features, setFeatures] = useState<string[]>([""]);
  const [install, setInstall] = useState("");
  const [usage, setUsage] = useState("");
  const [contributing, setContributing] = useState(true);
  const [license, setLicense] = useState("MIT");
  const [author, setAuthor] = useState("");
  const [github, setGithub] = useState("");
  const [badges, setBadges] = useState({
    madeWithLove: true, mit: true, openSource: false, prsWelcome: true,
  });

  const md = useMemo(
    () => buildMarkdown({ name, description, tech, features, install, usage, contributing, license, author, github, badges }),
    [name, description, tech, features, install, usage, contributing, license, author, github, badges]
  );

  const html = useMemo(() => marked.parse(md || "") as string, [md]);

  const addTech = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const v = techInput.trim().replace(/,$/, "");
      if (v && !tech.includes(v)) setTech([...tech, v]);
      setTechInput("");
    } else if (e.key === "Backspace" && !techInput && tech.length) {
      setTech(tech.slice(0, -1));
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster theme="dark" position="bottom-right" />

      {/* Header */}
      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.58_0.24_295/0.25),_transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-6 py-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-[color:var(--accent-glow)] grid place-items-center shadow-lg shadow-primary/30">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">README Generator</h1>
            <p className="text-sm text-muted-foreground mt-1">Create stunning GitHub READMEs in seconds</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: FORM */}
        <section className="space-y-6">
          <div className="rounded-2xl bg-card border border-border p-5">
            <SectionHeader icon={Sparkles} title="Project" />
            <input className={inputCls} placeholder="Project Name" value={name} onChange={(e) => setName(e.target.value)} />
            <div className="mt-3 relative">
              <textarea
                className={inputCls + " min-h-24 resize-y"}
                placeholder="Short description of your project..."
                maxLength={300}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="text-xs text-muted-foreground mt-1 text-right">
                {description.length}/300
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-5">
            <SectionHeader icon={Tag} title="Tech Stack" />
            <div className="flex flex-wrap gap-2 p-2 rounded-xl bg-[color:var(--surface-elevated)] border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 transition">
              {tech.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/20 text-primary-foreground text-xs font-medium border border-primary/40">
                  {t}
                  <button onClick={() => setTech(tech.filter((x) => x !== t))} className="hover:text-destructive transition">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                className="flex-1 min-w-32 bg-transparent outline-none text-sm py-1 px-1"
                placeholder={tech.length ? "" : "Type and press Enter..."}
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={addTech}
              />
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-5">
            <SectionHeader icon={ListChecks} title="Features" />
            <div className="space-y-2">
              {features.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className={inputCls}
                    placeholder={`Feature ${i + 1}`}
                    value={f}
                    onChange={(e) => setFeatures(features.map((x, j) => (j === i ? e.target.value : x)))}
                  />
                  <button
                    onClick={() => setFeatures(features.length > 1 ? features.filter((_, j) => j !== i) : [""])}
                    className="px-3 rounded-xl border border-border hover:border-destructive hover:text-destructive transition"
                    aria-label="Remove feature"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setFeatures([...features, ""])}
                className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition"
              >
                <Plus className="w-4 h-4" /> Add feature
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-5 space-y-4">
            <div>
              <SectionHeader icon={Package} title="Installation" />
              <input className={codeInputCls} placeholder="npm install your-package" value={install} onChange={(e) => setInstall(e.target.value)} />
            </div>
            <div>
              <SectionHeader icon={Play} title="Usage / Run" />
              <input className={codeInputCls} placeholder="npm run dev" value={usage} onChange={(e) => setUsage(e.target.value)} />
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[color:var(--accent-glow)]" />
                <span className="text-sm font-semibold uppercase tracking-wide">Contributing Section</span>
              </div>
              <button
                onClick={() => setContributing(!contributing)}
                className={`relative w-12 h-6 rounded-full transition ${contributing ? "bg-primary" : "bg-border"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${contributing ? "translate-x-6" : ""}`} />
              </button>
            </div>

            <div>
              <SectionHeader icon={Scale} title="License" />
              <select className={inputCls} value={license} onChange={(e) => setLicense(e.target.value)}>
                {LICENSES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-5 space-y-3">
            <SectionHeader icon={User} title="Author" />
            <input className={inputCls} placeholder="Author name" value={author} onChange={(e) => setAuthor(e.target.value)} />
            <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className={inputCls + " pl-10"} placeholder="https://github.com/username" value={github} onChange={(e) => setGithub(e.target.value)} />
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-5">
            <SectionHeader icon={Award} title="Badges" />
            <div className="grid grid-cols-2 gap-2">
              {([
                ["madeWithLove", "Made with Love"],
                ["mit", "MIT License"],
                ["openSource", "Open Source"],
                ["prsWelcome", "PRs Welcome"],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[color:var(--surface-elevated)] border border-border cursor-pointer hover:border-primary transition">
                  <input
                    type="checkbox"
                    checked={badges[key]}
                    onChange={(e) => setBadges({ ...badges, [key]: e.target.checked })}
                    className="accent-[color:var(--primary)] w-4 h-4"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
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
                  onClick={copy}
                  disabled={!md}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[color:var(--surface)] border border-border hover:border-primary hover:text-primary transition disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground"
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

            <div className="overflow-auto scrollbar-thin p-6 min-h-96 lg:min-h-0">
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
                      Start filling the form to see your README come to life
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
        .prose-readme img { display: inline-block; margin: 0.15rem 0.25rem 0.15rem 0; }
        .prose-readme strong { color: var(--foreground); font-weight: 600; }
        .prose-readme hr { border-color: var(--border); margin: 1rem 0; }
      `}</style>
    </div>
  );
}
