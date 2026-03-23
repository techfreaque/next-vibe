/**
 * tRPC API Route Handler
 * Handles all tRPC requests with locale support
 * Integrates with existing next-vibe authentication and context systems
 */

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { validateData } from "next-vibe/shared/utils";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { createTRPCContext } from "@/app/api/[locale]/system/unified-interface/trpc/setup";
import { type CountryLanguage, defaultLocale } from "@/i18n/core/config";

/**
 * Handle all HTTP methods for tRPC with locale support
 * Route pattern: /api/[locale]/trpc/[...trpc]
 *
 * tRPC is opt-in. Enable by running the tRPC router generator, which creates
 * router.ts in this directory. Delete router.ts to disable tRPC entirely.
 */
async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ locale: CountryLanguage; trpc: string[] }> },
): Promise<Response> {
  const { locale: rawLocale } = await params;
  const logger = createEndpointLogger(false, Date.now(), rawLocale);

  // Dynamically import the generated router — only exists if tRPC is enabled
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let appRouter: any;
  try {
    // turbopack-ignore-next-line
    const routerModule = await import(
      // @ts-expect-error -- Doesnt exist if tRPC is not enabled
      /* turbopackIgnore: true */ /* webpackIgnore: true */ "./router"
    );
    appRouter = routerModule.appRouter;
  } catch {
    return new Response(
      "tRPC is not enabled. Run the tRPC router generator to enable it.",
      {
        status: 404,
      },
    );
  }

  // Validate locale parameter
  const localeValidation = validateData(
    rawLocale,
    z.string(),
    logger,
    rawLocale,
    Platform.NEXT_API,
    "trpc/locale",
  ) as ResponseType<CountryLanguage>;
  const locale = localeValidation.success
    ? localeValidation.data
    : defaultLocale;

  if (!localeValidation.success) {
    logger.error("Invalid locale in tRPC request, using default", {
      requestedLocale: rawLocale,
      defaultLocale,
      url: req.url,
    });
  }

  return await fetchRequestHandler({
    endpoint: `/api/${locale}/trpc`,
    req,
    router: appRouter,
    createContext: async () => {
      return await createTRPCContext({
        req,
        urlPathParams: { locale },
        logger,
        locale,
      });
    },
    onError: ({
      error,
      path,
      type,
    }: {
      error: { message: string; code: string; cause?: Error };
      path?: string;
      type: string;
    }) => {
      logger.error(`tRPC Error [${type}] on ${path ?? "unknown"}:`, {
        error: error.message,
        code: error.code,
        cause: error.cause !== undefined ? String(error.cause) : undefined,
        locale,
        url: req.url,
      });
    },
  });
}

export { handler as GET, handler as POST };
