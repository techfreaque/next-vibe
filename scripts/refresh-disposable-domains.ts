/**
 * Refresh the vendored disposable email domain list.
 *
 *   bun scripts/refresh-disposable-domains.ts            # download upstream list
 *   bun scripts/refresh-disposable-domains.ts --from=x   # use a local file (one domain per line)
 *   bun scripts/refresh-disposable-domains.ts --replace  # drop domains upstream no longer lists
 *
 * Default is a MERGE: every domain already in the vendored list stays, so a
 * refresh never unblocks anything. Mainstream providers (MAINSTREAM_ALLOWLIST)
 * are never written, even when upstream lists one by mistake.
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

/** Real providers with real users: never blocked, whatever upstream says */
const MAINSTREAM_ALLOWLIST: ReadonlySet<string> = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "outlook.de",
  "outlook.fr",
  "hotmail.com",
  "hotmail.de",
  "hotmail.fr",
  "hotmail.co.uk",
  "live.com",
  "live.de",
  "live.fr",
  "msn.com",
  "yahoo.com",
  "yahoo.de",
  "yahoo.fr",
  "yahoo.co.uk",
  "ymail.com",
  "aol.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "proton.me",
  "protonmail.com",
  "protonmail.ch",
  "pm.me",
  "tutanota.com",
  "tutanota.de",
  "tuta.io",
  "tuta.com",
  "gmx.com",
  "gmx.de",
  "gmx.net",
  "gmx.at",
  "gmx.ch",
  "gmx.fr",
  "web.de",
  "t-online.de",
  "freenet.de",
  "posteo.de",
  "mailbox.org",
  "orange.fr",
  "free.fr",
  "laposte.net",
  "sfr.fr",
  "wp.pl",
  "o2.pl",
  "onet.pl",
  "interia.pl",
  "mail.ru",
  "bk.ru",
  "inbox.ru",
  "list.ru",
  "yandex.ru",
  "yandex.com",
  "ya.ru",
  "rambler.ru",
  "zoho.com",
  "fastmail.com",
  "hey.com",
  "qq.com",
  "163.com",
  "126.com",
  "naver.com",
  "daum.net",
]);

function parseList(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim().toLowerCase())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .filter((line) => /^[a-z0-9.-]+\.[a-z0-9-]+$/.test(line));
}

/** Domains of the currently vendored list (empty when the file is missing) */
function readVendored(): string[] {
  try {
    const src = readFileSync(TARGET, "utf8");
    return [...src.matchAll(/^ {2}"([a-z0-9.-]+)",$/gm)].flatMap((m) =>
      m[1] ? [m[1]] : [],
    );
  } catch {
    return [];
  }
}

function render(domains: string[], source: string): string {
  const body = domains.map((d) => `  "${d}",`).join("\n");
  return `/**
 * Disposable email domains blocked at signup. GENERATED, do not edit by hand.
 * Refresh: bun scripts/refresh-disposable-domains.ts (merges, never unblocks)
 * Source: ${source}
 * Matching includes subdomains (see isDisposableEmailDomain in email-identity.ts).
 * Rotating temp-mail domains not listed here are caught by their MX host
 * (disposable-mx-hosts.ts).
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
    return { raw: readFileSync(path, "utf8"), source: SOURCE_URL };
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
  const upstream = parseList(loaded.raw);
  if (upstream.length < 100) {
    process.stderr.write(
      `Refusing to write: only ${String(upstream.length)} domains parsed\n`,
    );
    return 1;
  }
  const replace = process.argv.includes("--replace");
  const vendored = replace ? [] : readVendored();
  const merged = [...new Set([...upstream, ...vendored])];
  const allowlisted = merged.filter((d) => MAINSTREAM_ALLOWLIST.has(d));
  if (allowlisted.length > 0) {
    process.stderr.write(
      `Skipping mainstream providers: ${allowlisted.join(", ")}\n`,
    );
  }
  const domains = merged.filter((d) => !MAINSTREAM_ALLOWLIST.has(d)).toSorted();
  const upstreamSet = new Set(upstream);
  const kept = vendored.filter((d) => !upstreamSet.has(d)).length;
  writeFileSync(TARGET, render(domains, loaded.source));
  process.stdout.write(
    `Wrote ${String(domains.length)} domains to ${TARGET} (upstream ${String(upstream.length)}, kept from vendored ${String(kept)})\n`,
  );
  return 0;
}

void main().then((code) => process.exit(code));
