/**
 * Email Preview Send Test Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definition from "./definition";
import { EmailPreviewSendTestRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger, t }) =>
      EmailPreviewSendTestRepository.sendTest(data, logger, t),
  },
});
