import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { CliNowpaymentsRepositoryImpl } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, locale, t }) =>
      CliNowpaymentsRepositoryImpl.execute(data, locale, t),
  },
});
