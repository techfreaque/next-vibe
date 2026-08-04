import { Methods } from "../../core/definition/enums";
import { endpointsHandler } from "../../core/route/multi";
import { endpoints } from "./definition";
import { AwaitTaskRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, logger, t, toolExecutionContext, platform }) =>
      AwaitTaskRepository.awaitTask(
        data,
        user,
        logger,
        t,
        toolExecutionContext,
        platform,
      ),
  },
});
