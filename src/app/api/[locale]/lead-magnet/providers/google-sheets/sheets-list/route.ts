import "server-only";

import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { GoogleSheetsCredentialsRepository } from "../repository";
import { listSpreadsheets } from "../oauth-helpers";
import endpoints from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: async ({ user, t }) => {
      const creds = await GoogleSheetsCredentialsRepository.getCredentials(
        user.id,
      );

      if (!creds) {
        return fail({
          message: t("errors.forbidden.description"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const sheets = await listSpreadsheets(creds.googleAccessToken);

      return success({ sheets });
    },
  },
});
