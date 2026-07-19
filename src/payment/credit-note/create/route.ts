/**
 * Credit Note Create Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import creditNoteCreateDefinitions from "./definition";
import { CreditNoteCreateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: creditNoteCreateDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, locale }) =>
      CreditNoteCreateRepository.createCreditNote(
        user.id,
        data,
        logger,
        locale,
      ),
  },
});
