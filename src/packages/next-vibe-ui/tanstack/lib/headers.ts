/**
 * TanStack Start shim for `next/headers`.
 *
 * Next.js `cookies()` and `headers()` read from an async request context.
 * In TanStack Start / Vite SSR, the request is available via `getRequest()`.
 *
 * This shim returns read-only cookie/header stores backed by the current request.
 * Write operations (set/delete) on cookies are no-ops in SSR — they must go
 * through the response, which TanStack handles separately.
 */

import { getRequest } from "@tanstack/start-server-core";

// ── Types matching next/headers public surface ──────────────────────────────

interface RequestCookie {
  name: string;
  value: string;
}

interface ReadonlyRequestCookies {
  get(name: string): RequestCookie | undefined;
  getAll(): RequestCookie[];
  has(name: string): boolean;
  set(...args: string[]): void;
  delete(...args: string[]): void;
}

interface ReadonlyHeaders {
  get(name: string): string | null;
  has(name: string): boolean;
  getAll(name: string): string[];
  forEach(fn: (value: string, key: string) => void): void;
  entries(): IterableIterator<[string, string]>;
  keys(): IterableIterator<string>;
  values(): IterableIterator<string>;
}

// ── cookies() ───────────────────────────────────────────────────────────────

function parseCookieHeader(header: string): RequestCookie[] {
  return header.split(";").flatMap((part) => {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      return [];
    }
    return [
      {
        name: trimmed.slice(0, eq).trim(),
        value: trimmed.slice(eq + 1).trim(),
      },
    ];
  });
}

export async function cookies(): Promise<ReadonlyRequestCookies> {
  let cookieList: RequestCookie[] = [];
  try {
    const req = getRequest();
    if (req) {
      const raw = req.headers.get("cookie") ?? "";
      cookieList = parseCookieHeader(raw);
    }
  } catch {
    // Outside request context — return empty store
  }

  const map = new Map(cookieList.map((c) => [c.name, c]));

  return {
    get(name: string) {
      return map.get(name);
    },
    getAll() {
      return [...map.values()];
    },
    has(name: string) {
      return map.has(name);
    },
    // Write ops are no-ops in SSR — responses handled by TanStack
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    set(...args: string[]) {
      /* no-op — SSR can't set response cookies here */
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    delete(...args: string[]) {
      /* no-op */
    },
  };
}

// ── headers() ───────────────────────────────────────────────────────────────

export async function headers(): Promise<ReadonlyHeaders> {
  let reqHeaders: Headers = new Headers();
  try {
    const req = getRequest();
    if (req) {
      reqHeaders = req.headers;
    }
  } catch {
    // Outside request context — return empty headers
  }

  return {
    get(name: string) {
      return reqHeaders.get(name);
    },
    has(name: string) {
      return reqHeaders.has(name);
    },
    getAll(name: string) {
      return [reqHeaders.get(name) ?? ""].filter(Boolean);
    },
    forEach(fn: (value: string, key: string) => void) {
      reqHeaders.forEach(fn);
    },
    entries() {
      return reqHeaders.entries();
    },
    keys() {
      return reqHeaders.keys();
    },
    values() {
      return reqHeaders.values();
    },
  };
}
