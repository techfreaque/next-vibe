/**
 * TanStack Start implementation of NextRequest / NextResponse.
 *
 * Shared code imports from `next-vibe-ui/lib/request` - vibe-ui resolves
 * tanstack/lib first so this file is used instead of next/server in Vite/TanStack.
 */

import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";

// ── Cookie helpers ────────────────────────────────────────────────────────────

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

interface RequestCookies {
  get(name: string): RequestCookie | undefined;
  getAll(): RequestCookie[];
  has(name: string): boolean;
}

interface ResponseCookies {
  set(name: string, value: string, options?: CookieSetOptions): void;
  set(options: CookieSetOptions & { name: string; value: string }): void;
  get(name: string): RequestCookie | undefined;
}

function parseCookieHeader(header: string): Map<string, RequestCookie> {
  const map = new Map<string, RequestCookie>();
  for (const part of header.split(";")) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      continue;
    }
    const name = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    map.set(name, { name, value });
  }
  return map;
}

// ── NextRequest ───────────────────────────────────────────────────────────────

export class NextRequest extends Request {
  readonly nextUrl: URL;
  readonly cookies: RequestCookies;

  constructor(input: Request | string, init?: RequestInit) {
    super(input, init);
    this.nextUrl = new URL(typeof input === "string" ? input : input.url);
    const map = parseCookieHeader(this.headers.get("cookie") ?? "");
    this.cookies = {
      get: (name: string): RequestCookie | undefined => map.get(name),
      getAll: (): RequestCookie[] => [...map.values()],
      has: (name: string): boolean => map.has(name),
    };
  }
}

// ── NextResponse ──────────────────────────────────────────────────────────────

export class NextResponse extends Response {
  readonly cookies: ResponseCookies;

  constructor(body?: BodyInit | null, init?: ResponseInit) {
    super(body, init);
    const responseHeaders = this.headers;
    this.cookies = {
      get: (name: string): RequestCookie | undefined =>
        parseCookieHeader(responseHeaders.get("cookie") ?? "").get(name),
      set(
        nameOrOptions:
          | string
          | (CookieSetOptions & { name: string; value: string }),
        value?: string,
        options?: CookieSetOptions,
      ): void {
        const name =
          typeof nameOrOptions === "string"
            ? nameOrOptions
            : nameOrOptions.name;
        const val =
          typeof nameOrOptions === "string"
            ? (value ?? "")
            : nameOrOptions.value;
        const opts =
          typeof nameOrOptions === "string" ? options : nameOrOptions;
        let cookie = `${name}=${encodeURIComponent(val)}`;
        if (opts?.path) {
          cookie += `; Path=${opts.path}`;
        }
        if (opts?.maxAge !== undefined) {
          cookie += `; Max-Age=${String(opts.maxAge)}`;
        }
        if (opts?.httpOnly) {
          cookie += `; HttpOnly`;
        }
        if (opts?.secure) {
          cookie += `; Secure`;
        }
        if (opts?.sameSite) {
          cookie += `; SameSite=${opts.sameSite}`;
        }
        if (opts?.domain) {
          cookie += `; Domain=${opts.domain}`;
        }
        if (opts?.expires) {
          cookie += `; Expires=${opts.expires.toUTCString()}`;
        }
        responseHeaders.append("Set-Cookie", cookie);
      },
    };
  }

  static override json(body: WidgetData, init?: ResponseInit): NextResponse {
    return new NextResponse(JSON.stringify(body), {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  }

  static redirect(
    url: string | URL,
    init?: number | ResponseInit,
  ): NextResponse {
    const status = typeof init === "number" ? init : (init?.status ?? 307);
    return new NextResponse(null, {
      status,
      headers: { Location: String(url) },
    });
  }

  static next(): NextResponse {
    return new NextResponse(null, { status: 200 });
  }
}

export { NextResponse as NextResponseClass };
