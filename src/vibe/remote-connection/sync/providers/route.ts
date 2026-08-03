import "server-only";

import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";

import endpoints from "./definition";
import { SyncProvidersRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    email: undefined,
    handler: ({ locale }) => SyncProvidersRepository.listProviders(locale),
  },
});
