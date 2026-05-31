/**
 * User Notes List Route
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import userNotesListEndpoints from "./definition";
import { UserNotesListRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: userNotesListEndpoints,
  [Methods.GET]: {
    handler: ({ data, user, logger, t }) =>
      UserNotesListRepository.listNotes(data, user, logger, t),
  },
});
