/**
 * Credit Note Create Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
