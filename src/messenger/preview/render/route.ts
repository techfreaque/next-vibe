/**
 * Email Preview Render Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definition from "./definition";
import { EmailPreviewRenderRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger, t }) =>
      EmailPreviewRenderRepository.renderPreview(data, logger, t),
  },
});
