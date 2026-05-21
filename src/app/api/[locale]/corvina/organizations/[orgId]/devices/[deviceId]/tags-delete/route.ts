import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { TagsDeleteRepository } from "./repository";

export const { DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ data, urlPathParams, logger, locale }) =>
      TagsDeleteRepository.deleteTags(urlPathParams, data, logger, locale),
  },
});
