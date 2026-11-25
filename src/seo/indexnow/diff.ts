/**
 * Pure IndexNow helpers: which sitemap URLs still need a ping, and batching.
 * A URL is fingerprinted with its lastmod, so a changed lastmod resubmits it.
 */

import { createHash } from "node:crypto";

import { z } from "zod";

import type { SitemapUrl } from "@/_pages/_root/sitemap.xml/build-sitemap";

/** Short, stable fingerprint of one sitemap entry. */
export function fingerprintUrl({ url, lastmod }: SitemapUrl): string {
  return createHash("sha256")
    .update(`${url}\n${lastmod ?? ""}`)
    .digest("hex")
    .slice(0, 16);
}

const fingerprintsSchema = z.array(z.string());

/** Stored fingerprint list; anything malformed counts as "nothing sent yet". */
export function parseFingerprints(value: string | null): Set<string> {
  if (!value) {
    return new Set();
  }
  try {
    const parsed = fingerprintsSchema.safeParse(JSON.parse(value));
    return new Set(parsed.success ? parsed.data : []);
  } catch {
    return new Set();
  }
}

export function serializeFingerprints(fingerprints: Iterable<string>): string {
  return JSON.stringify([...fingerprints].toSorted());
}

/** Entries whose fingerprint was never submitted (all of them with `force`). */
export function pendingUrls(
  urls: readonly SitemapUrl[],
  submitted: ReadonlySet<string>,
  force: boolean,
): SitemapUrl[] {
  return force
    ? [...urls]
    : urls.filter((entry) => !submitted.has(fingerprintUrl(entry)));
}

export function chunk<T>(items: readonly T[], size: number): T[][] {
  const batches: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    batches.push(items.slice(index, index + size));
  }
  return batches;
}
