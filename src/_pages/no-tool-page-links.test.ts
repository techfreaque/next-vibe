/**
 * Guard: no user-facing link to a /tools/* page, ever (Max, 2026-11-17).
 * Tool pages are the admin console, not a destination. Link the proper page
 * instead: API keys -> /user/api-keys, models -> /models, generation ->
 * /create/<kind>, notifications -> /user/notifications.
 *
 * Scans every source file under src/ (pages, widgets, emails, i18n strings,
 * llms.txt, docs, blog posts) for a path that points at /tools/<something>.
 * Only the tools framework itself and admin-only entry points are exempt.
 */

import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const SRC_ROOT = join(import.meta.dir, "..");

/** Directories that are the tools framework itself or generated output. */
const SKIPPED_DIRS: readonly string[] = [
  "generated",
  "app", // auto-generated Next.js shells
  join("_pages", "tools"),
  join("vibe", "help-tool"),
  join("vibe", "tooling"),
];

/** Files allowed to point at /tools, each with the reason. */
const ALLOWED_FILES: Record<string, string> = {
  // Admin-only redirect to system settings after the first admin login.
  [join("_pages", "user", "(auth)", "login", "_components", "login-form.tsx")]:
    "admin-only",
  // Framework story page: shows the URL scheme of a tool as code, not a link.
  [join("_pages", "story", "_shared", "surface-snippets.ts")]:
    "framework code sample",
  // This guard.
  [join("_pages", "no-tool-page-links.test.ts")]: "this file",
  // AGENTS.md generator: tells coding agents how to test endpoints.
  [join("vibe", "agent", "skills", "default-skills", "vibe-coder", "skill.ts")]:
    "agent instructions",
};

/**
 * A path into our own /tools pages: `/${locale}/tools/x`, `/en-US/tools/x`,
 * `"/tools/x"`, `unbottled.ai/tools/x`. External sites (another domain's
 * /tools/) don't match.
 */
const TOOL_LINK_PATTERN =
  /(?:\$\{[^}]*\}|\/[a-z]{2}-[A-Z]{2}|unbottled\.ai(?:\/[a-z]{2}-[A-Z]{2})?|["'`(])\/tools\/[\w$<{]/;

/** Reading the current route is valid. Check any links on the same line. */
function hasToolLink(line: string): boolean {
  const withoutRouteChecks = line.replaceAll(
    /\bpathname\.endsWith\((["'`])\/tools\/[^"'`)]*\1\)/g,
    "",
  );
  return TOOL_LINK_PATTERN.test(withoutRouteChecks);
}

const SOURCE_EXTENSIONS = [".ts", ".tsx", ".md", ".txt", ".html"];

function isTestFile(path: string): boolean {
  return /\.(e2e\.)?test\.tsx?$/.test(path) && !path.endsWith("no-tool-page-links.test.ts");
}

function collectFiles(dir: string, out: string[]): void {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = relative(SRC_ROOT, full);
    if (statSync(full).isDirectory()) {
      if (!SKIPPED_DIRS.includes(rel) && name !== "node_modules") {
        collectFiles(full, out);
      }
      continue;
    }
    if (SOURCE_EXTENSIONS.some((ext) => name.endsWith(ext))) {
      out.push(full);
    }
  }
}

/** Import specifiers mention folders named "tools" - not links. */
function isImportLine(line: string): boolean {
  return /^\s*(?:import|export)\b.*from\s+["']/.test(line) ||
    /^\s*}\s*from\s+["']/.test(line) ||
    /(?:import|require)\(\s*["']/.test(line);
}

function isCommentLine(line: string): boolean {
  return /^\s*(?:\/\/|\*|\/\*)/.test(line);
}

describe("no user-facing links to /tools/*", () => {
  test("src has no link into the tools console", () => {
    const files: string[] = [];
    collectFiles(SRC_ROOT, files);
    expect(files.length).toBeGreaterThan(100);

    const offenders: string[] = [];
    for (const file of files) {
      const rel = relative(SRC_ROOT, file);
      if (ALLOWED_FILES[rel] !== undefined || isTestFile(rel)) {
        continue;
      }
      const lines = readFileSync(file, "utf8").split("\n");
      lines.forEach((line, index) => {
        if (isImportLine(line) || isCommentLine(line)) {
          return;
        }
        if (hasToolLink(line)) {
          offenders.push(`src${sep}${rel}:${index + 1}: ${line.trim()}`);
        }
      });
    }
    expect(offenders).toEqual([]);
  });

  test("pattern catches the shapes that slipped through before", () => {
    const bad = [
      "href={`/${locale}/tools/api-keys`}",
      "href={`/${locale}/tools/${IMAGE_GEN_ALIAS}`}",
      'link: "/tools/notifications"',
      "see https://unbottled.ai/en-US/tools/models",
      "web: /en-US/tools/desktop-get-focused-window",
      'if (pathname.endsWith("/tools/a")) go("/tools/b")',
    ];
    const good = [
      'href: "https://aitoolscapital.com/tools/unbottled-ai"',
      "href={`/${locale}/user/api-keys`}",
      "Visitor pagination on /tools was broken.",
      "Plus a web page at /tools/<alias>",
      "if (!pathname.endsWith(`/tools/${alias}`)) {",
    ];
    for (const line of bad) {
      expect(hasToolLink(line)).toBe(true);
    }
    for (const line of good) {
      expect(hasToolLink(line)).toBe(false);
    }
  });
});
