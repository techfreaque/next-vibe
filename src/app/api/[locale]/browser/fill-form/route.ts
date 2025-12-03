/**
 * FillForm Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import fillFormEndpoints from "./definition";
import { executeFillForm, filterUndefinedArgs } from "../shared/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: fillFormEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      return executeFillForm(
        {
          toolName: "fill-form",
          args: filterUndefinedArgs({
            elements: data.elements,
          }),
        },
        user,
        logger,
        locale,
      );
    },
  },
});
