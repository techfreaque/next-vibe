/**
 * Refresh the vendored disposable email domain list.
 *
 *   bun scripts/refresh-disposable-domains.ts            # download upstream list
 *   bun scripts/refresh-disposable-domains.ts --from=x   # use a local file (one domain per line)
 *
 * Rewrites src/user/public/signup/disposable-domains.ts. Review the diff before committing.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SOURCE_URL =
  "https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/main/disposable_email_blocklist.conf";
const TARGET = join(
  import.meta.dir,
  "..",
  "src/user/public/signup/disposable-domains.ts",
);

function parseList(raw: string): string[] {
  const domains = raw
    .split("\n")
    .map((line) => line.trim().toLowerCase())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .filter((line) => /^[a-z0-9.-]+\.[a-z0-9-]+$/.test(line));
  return [...new Set(domains)].toSorted();
}

function render(domains: string[], source: string): string {
  const body = domains.map((d) => `  "${d}",`).join("\n");
  return `/**
 * Disposable email domains blocked at signup. GENERATED, do not edit by hand.
 * Refresh: bun scripts/refresh-disposable-domains.ts
 * Source: ${source}
 * Matching includes subdomains (see isDisposableEmailDomain in email-identity.ts).
 */

export const DISPOSABLE_EMAIL_DOMAINS: ReadonlySet<string> = new Set([
${body}
]);
`;
}

async function loadRaw(): Promise<{ raw: string; source: string } | null> {
  const fromArg = process.argv.find((a) => a.startsWith("--from="));
  if (fromArg) {
    const path = fromArg.slice("--from=".length);
    return { raw: readFileSync(path, "utf8"), source: "local file" };
  }
  // oxlint-disable-next-line restricted/no-raw-fetch -- external API
  const res = await fetch(SOURCE_URL);
  if (!res.ok) {
    process.stderr.write(
      `Download failed: ${String(res.status)} ${res.statusText}\n`,
    );
    return null;
  }
  return { raw: await res.text(), source: SOURCE_URL };
}

async function main(): Promise<number> {
  const loaded = await loadRaw();
  if (!loaded) {
    return 1;
  }
  const domains = parseList(loaded.raw);
  if (domains.length < 100) {
    process.stderr.write(
      `Refusing to write: only ${String(domains.length)} domains parsed\n`,
    );
    return 1;
  }
  writeFileSync(TARGET, render(domains, loaded.source));
  process.stdout.write(
    `Wrote ${String(domains.length)} domains to ${TARGET}\n`,
  );
  return 0;
}

void main().then((code) => process.exit(code));
