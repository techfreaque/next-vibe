/**
 * Primary language subtag of the browser's most preferred Accept-Language
 * entry ("hi-IN,hi;q=0.9,en;q=0.8" -> "hi"). Stored on leads at creation so
 * demand for a language is measurable before we serve it (the chosen locale
 * only shows what we already offer). Null when absent, "*" or malformed.
 */
export function primaryAcceptLanguage(
  header: string | null | undefined,
): string | null {
  if (!header) {
    return null;
  }
  let best: { tag: string; q: number } | null = null;
  for (const part of header.slice(0, 512).split(",")) {
    const [rawTag, ...params] = part.trim().split(";");
    const tag = rawTag?.trim().toLowerCase().split(/[-_]/)[0] ?? "";
    if (!/^[a-z]{2,3}$/.test(tag)) {
      continue;
    }
    const qParam = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
    const q = qParam ? Number(qParam.slice(2)) : 1;
    if (!Number.isFinite(q) || q <= 0) {
      continue;
    }
    // Ties keep the earlier entry: browsers list the preference order.
    if (!best || q > best.q) {
      best = { tag, q };
    }
  }
  return best?.tag ?? null;
}
