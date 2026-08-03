import "server-only";

import { Methods } from "../../../../core/definition/enums";
import { endpointsHandler } from "../../../../core/route/multi";

import deployPreviewEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: deployPreviewEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) =>
      (await import("./repository")).DeployPreviewRepository.preview(
        data,
        logger,
        t,
      ),
  },
});
