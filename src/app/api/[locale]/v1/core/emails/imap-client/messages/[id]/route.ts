/**
 * IMAP Message Detail API Route Handlers
 * Next.js API route handlers with validation and notifications
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import type { Countries } from "@/i18n/core/config";

import { imapMessagesRepository } from "../repository";
import definitions from "./definition";

// Helper to safely convert locale to country
function getCountryFromLocale(locale: string): Countries {
  const [, countryPart] = locale.split("-");
  const upperCountry = countryPart?.toUpperCase();

  // Map to valid Countries values
  const countryMapping: Record<string, Countries> = {
    DE: "DE",
    PL: "PL",
    GLOBAL: "GLOBAL",
  };

  return countryMapping[upperCountry || ""] || "GLOBAL";
}

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: ({ urlVariables, user, locale, logger }) =>
      imapMessagesRepository.getMessageById(
        { id: urlVariables.id },
        user,
        getCountryFromLocale(locale),
        logger,
      ),
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ urlVariables, data, user, locale, logger }) =>
      imapMessagesRepository.updateMessage(
        { messageId: urlVariables.id, updates: data },
        user,
        getCountryFromLocale(locale),
        logger,
      ),
  },
});

// Add default export for Next.js API route compatibility
export default { GET, PATCH };
