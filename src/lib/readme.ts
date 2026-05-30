import { Toaster } from "@/components/ui/sonner";

export type CustomBadge = { label: string; message: string; color: string };

export type ReadmeData = {
  name: string;
  description: string;
  tech: string[];
  features: string[];
  install: string;
  usage: string;
  contributing: boolean;
  license: string;
  author: string;
  github: string;
  repo: string;
  demoUrl: string;
  screenshotUrl: string;
  badges: {
    madeWithLove: boolean;
    mit: boolean;
    openSource: boolean;
    prsWelcome: boolean;
    version: boolean;
    stars: boolean;
    build: boolean;
    downloads: boolean;
  };
  customBadges: CustomBadge[];
  toc: boolean;
};

const slug = (s: string) =>
  s.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

function parseRepo(repo: string): { owner: string; name: string } | null {
  const m = repo.match(/github\.com[/:]([^/]+)\/([^/.]+)/i);
  if (m) return { owner: m[1], name: m[2] };
  const parts = repo.split("/").filter(Boolean);
  if (parts.length === 2) return { owner: parts[0], name: parts[1] };
  return null;
}

export function buildMarkdown(d: ReadmeData): string {
  const lines: string[] = [];
  if (d.name) lines.push(`# ${d.name}`, "");

  const badges: string[] = [];
  const r = parseRepo(d.repo);
  if (d.badges.madeWithLove) badges.push("![Made with Love](https://img.shields.io/badge/Made%20with-%E2%9D%A4-ff4f81)");
  if (d.badges.mit) badges.push("![MIT License](https://img.shields.io/badge/License-MIT-7c3aed)");
  if (d.badges.openSource) badges.push("![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9C%93-22c55e)");
  if (d.badges.prsWelcome) badges.push("![PRs Welcome](https://img.shields.io/badge/PRs-welcome-3b82f6)");
  if (r) {
    if (d.badges.version) badges.push(`![Version](https://img.shields.io/github/package-json/v/${r.owner}/${r.name})`);
    if (d.badges.stars) badges.push(`![Stars](https://img.shields.io/github/stars/${r.owner}/${r.name}?style=social)`);
    if (d.badges.build) badges.push(`![Build](https://img.shields.io/github/actions/workflow/status/${r.owner}/${r.name}/ci.yml)`);
    if (d.badges.downloads) badges.push(`![Downloads](https://img.shields.io/github/downloads/${r.owner}/${r.name}/total)`);
  }
  for (const c of d.customBadges) {
    if (!c.label) continue;
    const l = encodeURIComponent(c.label);
    const m = encodeURIComponent(c.message || "");
    badges.push(`![${c.label}](https://img.shields.io/badge/${l}-${m}-${(c.color || "blue").replace("#", "")})`);
  }
  if (badges.length) lines.push(badges.join(" "), "");

  if (d.description) lines.push(d.description, "");

  if (d.screenshotUrl) lines.push(`![Screenshot](${d.screenshotUrl})`, "");
  if (d.demoUrl) lines.push(`🔗 **[Live Demo](${d.demoUrl})**`, "");

  // Build sections list for TOC
  const sections: string[] = [];
  if (d.tech.length) sections.push("🛠️ Tech Stack");
  if (d.features.filter(Boolean).length) sections.push("✨ Features");
  if (d.install) sections.push("📦 Installation");
  if (d.usage) sections.push("🚀 Usage");
  if (d.contributing) sections.push("🤝 Contributing");
  if (d.license) sections.push("📄 License");
  if (d.author || d.github) sections.push("👤 Author");

  if (d.toc && sections.length > 1) {
    lines.push("## 📚 Table of Contents", "");
    sections.forEach((s) => lines.push(`- [${s}](#${slug(s)})`));
    lines.push("");
  }

  if (d.tech.length) {
    lines.push("## 🛠️ Tech Stack", "");
    lines.push(d.tech.map((t) => `\`${t}\``).join(" • "), "");
  }

  if (d.features.filter(Boolean).length) {
    lines.push("## ✨ Features", "");
    d.features.filter(Boolean).forEach((f) => lines.push(`- ${f}`));
    lines.push("");
  }

  if (d.install) lines.push("## 📦 Installation", "", "```bash", d.install, "```", "");
  if (d.usage) lines.push("## 🚀 Usage", "", "```bash", d.usage, "```", "");

  if (d.contributing) {
    lines.push(
      "## 🤝 Contributing",
      "",
      "Contributions, issues and feature requests are welcome! Feel free to check the issues page.",
      "",
      "1. Fork the project",
      "2. Create your feature branch (`git checkout -b feature/amazing`)",
      "3. Commit your changes (`git commit -m 'Add amazing feature'`)",
      "4. Push to the branch (`git push origin feature/amazing`)",
      "5. Open a Pull Request",
      "",
    );
  }
  if (d.license) lines.push("## 📄 License", "", `Distributed under the ${d.license} License.`, "");
  if (d.author || d.github) {
    lines.push("## 👤 Author", "");
    if (d.author) lines.push(`**${d.author}**`, "");
    if (d.github) lines.push(`- GitHub: [${d.github.replace(/^https?:\/\/(www\.)?github\.com\//, "@")}](${d.github})`, "");
  }

  return lines.join("\n").trim();
}

export const TEMPLATES: Record<string, Partial<ReadmeData>> = {
  saas: {
    name: "Acme SaaS",
    description: "Modern SaaS platform that helps teams ship faster with built-in analytics, billing, and auth.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Stripe"],
    features: ["Multi-tenant workspaces", "Stripe subscriptions", "OAuth & SSO", "Real-time analytics"],
    install: "pnpm install",
    usage: "pnpm dev",
  },
  library: {
    name: "awesome-lib",
    description: "A tiny, zero-dependency utility library for modern JavaScript.",
    tech: ["TypeScript", "Vitest", "tsup"],
    features: ["Zero dependencies", "Tree-shakeable", "Fully typed", "100% test coverage"],
    install: "npm install awesome-lib",
    usage: "import { awesome } from 'awesome-lib'",
  },
  cli: {
    name: "my-cli",
    description: "A blazing-fast command-line tool to automate your dev workflow.",
    tech: ["Node.js", "TypeScript", "Commander"],
    features: ["Interactive prompts", "Config file support", "Plugin system", "Cross-platform"],
    install: "npm install -g my-cli",
    usage: "my-cli --help",
  },
  portfolio: {
    name: "John Doe — Portfolio",
    description: "Personal portfolio showcasing my work, writing, and side projects.",
    tech: ["React", "Vite", "Tailwind CSS", "Framer Motion"],
    features: ["Dark mode", "Animated transitions", "MDX blog", "Contact form"],
    install: "bun install",
    usage: "bun dev",
  },
};

export { Toaster };
