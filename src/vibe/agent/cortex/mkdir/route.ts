import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CortexMkdirRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, locale, logger, t }) =>
      CortexMkdirRepository.createDirectory({
        userId: user.id,
        user,
        locale,
        path: data.path,
        viewType: data.viewType,
        createParents: data.createParents,
        logger,
        t,
      }),
    onRemoteEvent: {
      "node-written": (props) => CortexMkdirRepository.applyRemoteMkdir(props),
    },
  },
});
