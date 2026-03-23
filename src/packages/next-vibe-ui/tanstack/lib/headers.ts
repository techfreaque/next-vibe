/**
 * TanStack Start shim for `next/headers`.
 *
 * Next.js `cookies()` and `headers()` read from an async request context.
 * In TanStack Start / Vite SSR, the request is available via `getRequest()`.
 *
 * Read ops use the incoming request cookies.
 * Write ops (set/delete) call TanStack's setCookie/deleteCookie to write
 * Set-Cookie headers on the response.
 */

import { deleteCookie, setCookie } from "@tanstack/start-server-core";
import { getRequest } from "@tanstack/start-server-core";

// ── Types matching next/headers public surface ──────────────────────────────

interface RequestCookie {
  name: string;
  value: string;
}

interface CookieSetOptions {
  name?: string;
  value?: string;
  httpOnly?: boolean;
  path?: string;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  maxAge?: number;
  expires?: Date;
  domain?: string;
}

interface ReadonlyRequestCookies {
  get(name: string): RequestCookie | undefined;
  getAll(): RequestCookie[];
  has(name: string): boolean;
  set(name: string, value: string, options?: CookieSetOptions): void;
  set(options: CookieSetOptions & { name: string; value: string }): void;
  delete(name: string | { name: string }): void;
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
    set(
      nameOrOptions:
        | string
        | (CookieSetOptions & { name: string; value: string }),
      value?: string,
      options?: CookieSetOptions,
    ) {
      const name =
        typeof nameOrOptions === "string" ? nameOrOptions : nameOrOptions.name;
      const val =
        typeof nameOrOptions === "string" ? (value ?? "") : nameOrOptions.value;
      const opts = typeof nameOrOptions === "string" ? options : nameOrOptions;
      setCookie(name, val, {
        httpOnly: opts?.httpOnly,
        path: opts?.path ?? "/",
        secure: opts?.secure,
        sameSite: opts?.sameSite,
        maxAge: opts?.maxAge,
        expires: opts?.expires,
        domain: opts?.domain,
      });
    },
    delete(nameOrOptions: string | { name: string }) {
      const name =
        typeof nameOrOptions === "string" ? nameOrOptions : nameOrOptions.name;
      deleteCookie(name);
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
