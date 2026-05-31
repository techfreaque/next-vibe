/**
 * User Notes Create Route
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import userNotesCreateEndpoints from "./definition";
import { UserNotesCreateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: userNotesCreateEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, logger, t }) =>
      UserNotesCreateRepository.createNote(data, user, logger, t),
  },
});
