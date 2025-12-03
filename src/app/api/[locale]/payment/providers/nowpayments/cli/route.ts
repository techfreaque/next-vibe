import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { CliNowpaymentsRepositoryImpl } from "./repository";

const repository = new CliNowpaymentsRepositoryImpl();

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, locale }) => {
      return repository.execute(data, locale);
    },
  },
});
