import "server-only";

import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { saveProviderConfig } from "../repository";
import endpoints from "./definition";
import { GoogleSheetsCredentialsRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, user, t }) => {
      const existing = await GoogleSheetsCredentialsRepository.getCredentials(
        user.id,
      );
      if (!existing) {
        return fail({
          message: t("providers.shared.errors.forbidden.description"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      return saveProviderConfig(
        user.id,
        "GOOGLE_SHEETS",
        {
          ...existing,
          googleSheetId: data.spreadsheetId,
          googleSheetTab: data.sheetTab ?? "",
        },
        {
          listId: data.spreadsheetId,
          headline: data.headline ?? null,
          buttonText: data.buttonText ?? null,
          isActive: data.isActive ?? true,
        },
      );
    },
  },
});
