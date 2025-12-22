/**
 * Test Email API Route Handler
 * POST /api/[locale]/leads/campaigns/emails/test-mail
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
