import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { GoogleSheetsT } from "../i18n";
import type { GoogleSpreadsheet } from "../oauth-helpers";
import { listSpreadsheets } from "../oauth-helpers";
import { GoogleSheetsCredentialsRepository } from "../repository";

export class SheetsListRepository {
  static async list(
    userId: string,
    t: GoogleSheetsT,
  ): Promise<ResponseType<{ sheets: GoogleSpreadsheet[] }>> {
    const creds =
      await GoogleSheetsCredentialsRepository.getCredentials(userId);

    if (!creds) {
      return fail({
        message: t("errors.forbidden.description"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    const sheets = await listSpreadsheets(creds.googleAccessToken);

    return success({ sheets });
  }
}
