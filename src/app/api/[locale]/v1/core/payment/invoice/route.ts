/**
 * Payment Invoice API Route
 * Handles invoice creation and management
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";

import { paymentRepository } from "../repository";
import invoiceDefinitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: invoiceDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      paymentRepository.createInvoice(
        authRepository.requireUserId(user),
        data,
        locale,
        logger,
      ),
  },
});
