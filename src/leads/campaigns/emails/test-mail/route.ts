import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
/**
 * Test Email API Route Handler
 * POST /api/[locale]/leads/campaigns/emails/test-mail
 */
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { TestEmailRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, logger }) =>
      await TestEmailRepository.sendTestEmail(data, user, logger),
  },
});
