import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="max-w-xl w-full text-center">
        <div className="inline-flex items-center justify-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          Error 404
        </div>
        <h1 className="mt-6 text-6xl font-bold tracking-tight text-foreground sm:text-7xl">
          Page not found
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          The page you're looking for doesn't exist. If you just deployed this
          app to <strong className="text-foreground">Vercel</strong> and every
          route returns 404, that's expected — this project is built for the
          Cloudflare Workers runtime that Lovable's preview uses, and Vercel
          can't execute the Worker bundle.
        </p>

        <div className="mt-6 rounded-lg border border-border bg-card p-4 text-left text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Fix the deploy</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>
              Recommended: publish from Lovable — zero config, same runtime as
              preview.
            </li>
            <li>
              Or convert the project off Cloudflare (remove the Cloudflare
              Vite plugin, <code>wrangler.jsonc</code>, and{" "}
              <code>src/server.ts</code>; switch TanStack Start to a Node
              target; add <code>vercel.json</code>). This breaks the Lovable
              preview.
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
          <a
            href="https://docs.lovable.dev/features/deploy"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Publishing docs
          </a>
          <a
            href="https://docs.lovable.dev/features/cloud"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Self-host guide
          </a>
        </div>
      </div>
    </div>
  );
}


function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "README Generator — Create Stunning GitHub READMEs in Seconds" },
      {
        name: "description",
        content:
          "Free online README generator with live markdown preview. Build professional GitHub README files with badges, tech stack, features, installation, and license sections in seconds.",
      },
      {
        name: "keywords",
        content:
          "readme generator, github readme, markdown generator, readme.md, readme maker, github profile readme, shields.io badges, open source readme",
      },
      { name: "author", content: "README Generator" },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#0f172a" },

      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "README Generator" },
      { property: "og:title", content: "README Generator — Create Stunning GitHub READMEs in Seconds" },
      {
        property: "og:description",
        content:
          "Build beautiful GitHub README files with a live markdown preview. Badges, tech stack, features, installation — all in one place.",
      },
      { property: "og:url", content: "/" },
      { property: "og:locale", content: "en_US" },

      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "README Generator — Create Stunning GitHub READMEs in Seconds" },
      {
        name: "twitter:description",
        content:
          "Build beautiful GitHub README files with a live markdown preview. Badges, tech stack, features, installation — all in one place.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "README Generator",
          description:
            "Free online README generator with live markdown preview. Build professional GitHub README files with badges, tech stack, features, installation, and license sections in seconds.",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Any",
          browserRequirements: "Requires JavaScript. Requires HTML5.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          featureList: [
            "Live markdown preview",
            "Shields.io badges",
            "Tech stack tag input",
            "Dynamic feature list",
            "License selector",
            "Copy to clipboard",
            "Download as README.md",
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
