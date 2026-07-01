/**
 * Interactive Send Keys Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
