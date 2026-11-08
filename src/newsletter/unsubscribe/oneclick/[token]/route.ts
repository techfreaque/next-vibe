/**
 * Newsletter One-Click Unsubscribe Route (RFC 8058)
 * POST /api/[locale]/newsletter/unsubscribe/oneclick/[token]
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { NewsletterOneClickRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, user, locale, logger, t }) =>
      NewsletterOneClickRepository.unsubscribe(
        urlPathParams,
        user,
        locale,
        logger,
        t,
      ),
  },
});
