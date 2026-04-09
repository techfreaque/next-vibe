import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { ForwardLeadFn } from "../types";

export const forwardLead: ForwardLeadFn = async (credentials, lead, t) => {
  const {
    googleAccessToken,
    googleRefreshToken,
    googleTokenExpiry,
    googleSheetId,
    googleSheetTab,
  } = credentials;

  if (!googleSheetId) {
    return fail({
      message: t("errors.providerError"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }

  const { appendRowToSheet, refreshAccessToken } =
    await import("./oauth-helpers");
  const { GoogleSheetsCredentialsRepository } = await import("./repository");
  const { saveProviderConfig } = await import("../repository");

  let accessToken = googleAccessToken;

  // Refresh token if expired or close to expiry (within 5 min)
  const expiryTime = googleTokenExpiry
    ? new Date(googleTokenExpiry).getTime()
    : 0;
  const needsRefresh = expiryTime - Date.now() < 5 * 60 * 1000;

  if (needsRefresh && googleRefreshToken) {
    const refreshed = await refreshAccessToken(googleRefreshToken);
    if (refreshed) {
      accessToken = refreshed.accessToken;
      // Fire-and-forget: update stored credentials
      void (async (): Promise<void> => {
        const db = await import("@/app/api/[locale]/system/db");
        const drizzle = await import("drizzle-orm");
        const { leadMagnetConfigs } = await import("../../db");
        const rows = await db.db
          .select({ userId: leadMagnetConfigs.userId })
          .from(leadMagnetConfigs)
          .where(drizzle.eq(leadMagnetConfigs.credentials, credentials))
          .limit(1);
        if (rows[0]) {
          const existing =
            await GoogleSheetsCredentialsRepository.getCredentials(
              rows[0].userId,
            );
          if (existing) {
            await saveProviderConfig(
              rows[0].userId,
              "GOOGLE_SHEETS",
              {
                ...credentials,
                googleAccessToken: refreshed.accessToken,
                googleTokenExpiry: refreshed.expiry,
              },
              {
                listId: googleSheetId,
                headline: null,
                buttonText: null,
                isActive: true,
              },
            );
          }
        }
      })();
    }
  }

  const row = [
    new Date().toISOString(),
    lead.firstName,
    lead.email,
    lead.listId ?? "",
  ];

  const ok = await appendRowToSheet(
    accessToken,
    googleSheetId,
    googleSheetTab ?? "",
    row,
  );

  if (!ok) {
    return fail({
      message: t("errors.providerError"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }

  return success(undefined);
};
