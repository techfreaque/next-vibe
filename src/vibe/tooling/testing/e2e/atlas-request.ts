import type { z } from "zod";

import { resolveE2EBaseUrl } from "./config";

type Body = z.infer<ReturnType<typeof z.json>>;
interface AtlasHttp {
  get(
    path: string,
    options?: { params: Record<string, string> },
  ): Promise<Response>;
  post(path: string, options: { data: Body }): Promise<Response>;
}

/** Real local HTTP with a scoped session header and no redirect forwarding. */
export function atlasRequest(token: string, leadCookie?: string): AtlasHttp {
  const base = new URL(resolveE2EBaseUrl() ?? "http://localhost:3000");
  async function call(path: string, init: RequestInit): Promise<Response> {
    const url = new URL(path, base);
    if (url.origin !== base.origin) {
      return new Response(null, { status: 403 });
    }
    const headers = new Headers(init.headers);
    headers.set("authorization", `Bearer ${token}`);
    if (leadCookie) {
      headers.set("cookie", leadCookie);
    }
    // oxlint-disable-next-line restricted/no-raw-fetch -- exercise actual Atlas HTTP without replaying session cookies
    return fetch(url, {
      ...init,
      headers,
      redirect: "error",
      signal: AbortSignal.timeout(30000),
    });
  }
  return {
    post(path, options): Promise<Response> {
      return call(path, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(options.data),
      });
    },
    get(path, options): Promise<Response> {
      const url = new URL(path, base);
      for (const [key, value] of Object.entries(options?.params ?? {})) {
        url.searchParams.set(key, value);
      }
      return call(url.href, { method: "GET" });
    },
  };
}
