/**
 * User Note Delete Route
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import userNoteDeleteEndpoints from "./definition";
import { UserNoteDeleteRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: userNoteDeleteEndpoints,
  [Methods.POST]: {
    handler: ({ urlPathParams, user, logger, t }) =>
      UserNoteDeleteRepository.deleteNote(
        urlPathParams.noteId,
        user,
        logger,
        t,
      ),
  },
});
