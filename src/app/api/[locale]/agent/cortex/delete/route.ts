import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CortexDeleteRepository } from "./repository";

export const { DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ data, user, locale, logger, t }) =>
      CortexDeleteRepository.deleteNode({
        userId: user.id,
        user,
        locale,
        path: data.path,
        recursive: data.recursive,
        logger,
        t,
      }),
    onRemoteEvent: {
      "node-deleted": (props) =>
        CortexDeleteRepository.applyRemoteDelete(props),
    },
  },
});
