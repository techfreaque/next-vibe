import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CortexMoveRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, locale, logger, t, streamContext }) =>
      CortexMoveRepository.moveNode({
        streamContext: streamContext,
        userId: user.id,
        user,
        locale,
        from: data.from,
        to: data.to,
        logger,
        t,
      }),
    onRemoteEvent: {
      "node-moved": (props) => CortexMoveRepository.applyRemoteMove(props),
    },
  },
});
