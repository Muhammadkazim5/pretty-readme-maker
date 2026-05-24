import { Toaster } from "@/components/ui/sonner";

export function buildMarkdown(d: {
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
  badges: { madeWithLove: boolean; mit: boolean; openSource: boolean; prsWelcome: boolean };
}): string {
  const lines: string[] = [];
  if (d.name) lines.push(`# ${d.name}`, "");

  const badges: string[] = [];
  if (d.badges.madeWithLove) badges.push("![Made with Love](https://img.shields.io/badge/Made%20with-%E2%9D%A4-ff4f81)");
  if (d.badges.mit) badges.push("![MIT License](https://img.shields.io/badge/License-MIT-7c3aed)");
  if (d.badges.openSource) badges.push("![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9C%93-22c55e)");
  if (d.badges.prsWelcome) badges.push("![PRs Welcome](https://img.shields.io/badge/PRs-welcome-3b82f6)");
  if (badges.length) lines.push(badges.join(" "), "");

  if (d.description) lines.push(d.description, "");

  if (d.tech.length) {
    lines.push("## 🛠️ Tech Stack", "");
    lines.push(d.tech.map((t) => `\`${t}\``).join(" • "), "");
  }

  if (d.features.filter(Boolean).length) {
    lines.push("## ✨ Features", "");
    d.features.filter(Boolean).forEach((f) => lines.push(`- ${f}`));
    lines.push("");
  }

  if (d.install) {
    lines.push("## 📦 Installation", "", "```bash", d.install, "```", "");
  }
  if (d.usage) {
    lines.push("## 🚀 Usage", "", "```bash", d.usage, "```", "");
  }
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
  if (d.license) {
    lines.push("## 📄 License", "", `Distributed under the ${d.license} License.`, "");
  }
  if (d.author || d.github) {
    lines.push("## 👤 Author", "");
    if (d.author) lines.push(`**${d.author}**`, "");
    if (d.github) lines.push(`- GitHub: [${d.github.replace(/^https?:\/\/(www\.)?github\.com\//, "@")}](${d.github})`, "");
  }

  return lines.join("\n").trim();
}

export { Toaster };
