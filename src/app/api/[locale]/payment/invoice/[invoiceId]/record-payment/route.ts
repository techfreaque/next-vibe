/**
 * Record Manual Payment Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import recordPaymentDefinitions from "./definition";
import { InvoiceRecordPaymentRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: recordPaymentDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, data, user, logger, locale }) =>
      InvoiceRecordPaymentRepository.recordPayment(
        user.id,
        urlPathParams,
        data,
        logger,
        locale,
      ),
  },
});
