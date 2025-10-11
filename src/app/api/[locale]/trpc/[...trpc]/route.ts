/**
 * tRPC API Route Handler
 * Handles all tRPC requests with locale support
 * Integrates with existing next-vibe authentication and context systems
 */

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";
import {
  type CountryLanguage,
  CountryLanguageValues,
  defaultLocale,
} from "@/i18n/core/config";
import { debugLogger } from "next-vibe/shared/utils";
import { validateData } from "next-vibe/shared/utils";
import { z } from "zod";

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

  // Validate locale parameter
  const localeValidation = validateData(
    rawLocale,
    z.string(),
  );
  const locale = localeValidation.success
    ? localeValidation.data
    : defaultLocale;

  if (!localeValidation.success) {
    debugLogger("Invalid locale in tRPC request, using default", {
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
        // Pass additional context for URL parameters if needed
        urlParams: { locale },
      });
    },
    onError: ({ error, path, type }) => {
      debugLogger(`tRPC Error [${type}] on ${path}:`, {
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
