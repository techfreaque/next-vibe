import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CortexWriteRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, locale, logger, t, toolExecutionContext }) =>
      CortexWriteRepository.writeFile({
        userId: user.id,
        user,
        locale,
        path: data.path,
        content: data.content,
        createParents: data.createParents,
        logger,
        t,
        toolExecutionContext: toolExecutionContext,
      }),
    onRemoteEvent: {
      "node-written": (props) => CortexWriteRepository.applyRemoteWrite(props),
    },
  },
});
