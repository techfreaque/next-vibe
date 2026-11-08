/**
 * Newsletter Confirm API Route
 * POST /api/[locale]/newsletter/confirm
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { NewsletterConfirmRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, logger, t }) =>
      NewsletterConfirmRepository.confirm(data, logger, t),
  },
});
