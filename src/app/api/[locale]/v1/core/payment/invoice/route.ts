/**
 * Payment Invoice API Route
 * Handles invoice creation and management
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";

import { paymentRepository } from "../repository";
import invoiceDefinitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: invoiceDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      const userId = authRepository.requireUserId(user);
      return await paymentRepository.createInvoice(
        userId,
        data,
        locale,
        logger,
      );
    },
  },
});
