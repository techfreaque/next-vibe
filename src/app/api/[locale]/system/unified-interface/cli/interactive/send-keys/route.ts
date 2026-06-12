/**
 * Interactive Send Keys Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { InteractiveRepository } from "../repository";
import sendKeysEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: sendKeysEndpoints,
  [Methods.POST]: {
    handler: ({ data, t }) =>
      InteractiveRepository.sendKeys(
        t,
        data.keys,
        data.pid ?? null,
        data.waitMs ?? null,
      ),
  },
});
