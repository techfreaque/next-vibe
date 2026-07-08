import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CortexEditRepository } from "./repository";

export const { PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, user, locale, logger, t, streamContext }) =>
      CortexEditRepository.editFile({
        streamContext: streamContext,
        userId: user.id,
        user,
        locale,
        path: data.path,
        find: data.find,
        replace: data.replace,
        startLine: data.startLine,
        endLine: data.endLine,
        newContent: data.newContent,
        logger,
        t,
      }),
    onRemoteEvent: {
      "node-written": (props) => CortexEditRepository.applyRemoteEdit(props),
    },
  },
});
