/**
 * Record Manual Payment Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
