/**
 * Adapters for Next.js API route conventions in TanStack Start.
 *
 * Pages and layouts use tanstackLoader + TanstackPage exports directly (no wrapper needed).
 * API routes use wrapNextApiRoute — bridges $param → param and method dispatch.
 */

import type { ReactNode } from "react";
import { NextRequest } from "next-vibe-ui/lib/request";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NextPageProps {
  params: Promise<Record<string, string | string[]>>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export interface NextLayoutProps extends NextPageProps {
  children: ReactNode;
}

export interface NextApiRouteContext {
  params?: Promise<Record<string, string | string[]>>;
}

export interface NextApiModule {
  GET?(req: Request, ctx?: NextApiRouteContext): Response | Promise<Response>;
  POST?(req: Request, ctx?: NextApiRouteContext): Response | Promise<Response>;
  PUT?(req: Request, ctx?: NextApiRouteContext): Response | Promise<Response>;
  PATCH?(req: Request, ctx?: NextApiRouteContext): Response | Promise<Response>;
  DELETE?(
    req: Request,
    ctx?: NextApiRouteContext,
  ): Response | Promise<Response>;
  HEAD?(req: Request, ctx?: NextApiRouteContext): Response | Promise<Response>;
  OPTIONS?(
    req: Request,
    ctx?: NextApiRouteContext,
  ): Response | Promise<Response>;
}

interface TanstackHandlerCtx {
  request: Request;
  params?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Shared helper — exported so generated routes can import it
// ---------------------------------------------------------------------------

/** Strip TanStack $name prefix → plain Next.js param names */
export function toNextParams<
  T extends Record<string, string> = Record<string, string>,
>(raw: Record<string, string>): T {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    out[k.startsWith("$") ? k.slice(1) : k] = v;
  }
  return out as T;
}

// ---------------------------------------------------------------------------
// API route wrapper
// ---------------------------------------------------------------------------

type TanstackHandlerFn = (ctx: TanstackHandlerCtx) => Promise<Response>;
type TanstackHandlers = Partial<
  Record<
    "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS",
    TanstackHandlerFn
  >
>;

export function wrapNextApiRoute(
  importFn: () => Promise<NextApiModule>,
): TanstackHandlers {
  const methods = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "HEAD",
    "OPTIONS",
  ] as const;
  const handlers: TanstackHandlers = {};
  for (const method of methods) {
    handlers[method] = async (ctx: TanstackHandlerCtx): Promise<Response> => {
      const mod = await importFn();
      const handler = mod[method];
      if (!handler) {
        return new Response("Method Not Allowed", { status: 405 });
      }
      const nextParams = toNextParams(ctx.params ?? {});
      // Wrap the request as NextRequest so handlers can use .cookies / .nextUrl.
      // Pass ctx.request directly (not a clone) to preserve the body stream.
      const nextRequest = new NextRequest(ctx.request);
      return handler(nextRequest, { params: Promise.resolve(nextParams) });
    };
  }
  return handlers;
}
