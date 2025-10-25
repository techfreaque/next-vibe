/**
 * tRPC API Route Handler
 * Handles all tRPC requests with locale support
 * Integrates with existing next-vibe authentication and context systems
 */

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";
import { validateData } from "next-vibe/shared/utils";
import { z } from "zod";

import { type CountryLanguage, defaultLocale } from "@/i18n/core/config";
import type { ResponseType } from "next-vibe/shared";

import { createEndpointLogger } from "../../v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { createTRPCContext } from "../../v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/trpc/trpc-context";
import { appRouter } from "./router";

/**
 * Handle all HTTP methods for tRPC with locale support
 * Route pattern: /api/[locale]/trpc/[...trpc]
 */
async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ locale: CountryLanguage; trpc: string[] }> },
): Promise<Response> {
  const { locale: rawLocale } = await params;
  const logger = createEndpointLogger(false, Date.now(), rawLocale);

  // Validate locale parameter
  const localeValidation = validateData(
    rawLocale,
    z.string(),
    logger,
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
        urlParams: { locale },
        logger,
        locale,
      });
    },
    onError: ({ error, path, type }) => {
      logger.error(`tRPC Error [${type}] on ${path}:`, {
        error: error.message,
        code: error.code,
        cause: error.cause,
        locale,
        url: req.url,
      });
    },
  });
}

export { handler as GET, handler as POST };
