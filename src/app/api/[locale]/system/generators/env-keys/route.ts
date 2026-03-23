import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { EnvKeysGeneratorRepository } from "./repository";

export const { tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, logger, t }) =>
      EnvKeysGeneratorRepository.generateEnvKeys(data, logger, t),
  },
});
