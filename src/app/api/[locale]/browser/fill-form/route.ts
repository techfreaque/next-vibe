/**
 * FillForm Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { executeFillForm, filterUndefinedArgs } from "../shared/repository";
import fillFormEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: fillFormEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger }) =>
      executeFillForm(
        {
          toolName: "fill-form",
          args: filterUndefinedArgs({
            elements: data.elements,
          }),
        },
        logger,
      ),
  },
});
