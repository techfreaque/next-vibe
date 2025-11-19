/**
 * tRPC API Route Handler
 * Handles all tRPC requests with locale support
 * Integrates with existing next-vibe authentication and context systems
 */

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { validateData } from "next-vibe/shared/utils";
import { z } from "zod";

import { createTRPCContext } from "@/app/api/[locale]/v1/core/system/unified-interface/trpc/context";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { type CountryLanguage, defaultLocale } from "@/i18n/core/config";

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
        urlPathParams: { locale },
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
