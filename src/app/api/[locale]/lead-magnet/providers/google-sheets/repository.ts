import "server-only";

import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";

import { leadMagnetConfigs } from "../../db";
import type { LeadMagnetT } from "../../i18n";
import { saveProviderConfig } from "../repository";

export interface GoogleSheetsCredentials {
  googleAccessToken: string;
  googleRefreshToken: string;
  googleTokenExpiry: string;
  googleSheetId?: string;
  googleSheetTab?: string;
}

export const GoogleSheetsCredentialsRepository = {
  async getCredentials(
    userId: string,
  ): Promise<GoogleSheetsCredentials | null> {
    const rows = await db
      .select({
        credentials: leadMagnetConfigs.credentials,
        provider: leadMagnetConfigs.provider,
      })
      .from(leadMagnetConfigs)
      .where(eq(leadMagnetConfigs.userId, userId))
      .limit(1);

    const row = rows[0];
    if (!row) {
      return null;
    }
    const creds = row.credentials as Record<string, string | undefined> &
      GoogleSheetsCredentials;
    if (!creds.googleRefreshToken) {
      return null;
    }
    return creds;
  },

  async saveConfig(
    userId: string,
    data: {
      spreadsheetId: string;
      sheetTab?: string | null;
      headline?: string | null;
      buttonText?: string | null;
      isActive?: boolean | null;
    },
    t: LeadMagnetT,
  ): ReturnType<typeof saveProviderConfig> {
    const existing =
      await GoogleSheetsCredentialsRepository.getCredentials(userId);
    if (!existing) {
      return fail({
        message: t("providers.shared.errors.forbidden.description"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }
    return saveProviderConfig(
      userId,
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

  async saveOAuthCredentials(
    userId: string,
    tokens: {
      googleAccessToken: string;
      googleRefreshToken: string;
      googleTokenExpiry: string;
    },
  ): Promise<void> {
    const existing = await db
      .select({
        id: leadMagnetConfigs.id,
        credentials: leadMagnetConfigs.credentials,
      })
      .from(leadMagnetConfigs)
      .where(eq(leadMagnetConfigs.userId, userId))
      .limit(1);

    const now = new Date();

    if (existing.length > 0) {
      const prev = (existing[0].credentials ?? {}) as Record<string, string>;
      await db
        .update(leadMagnetConfigs)
        .set({
          provider: "GOOGLE_SHEETS",
          credentials: { ...prev, ...tokens },
          updatedAt: now,
        })
        .where(eq(leadMagnetConfigs.userId, userId));
    } else {
      await db.insert(leadMagnetConfigs).values({
        userId,
        provider: "GOOGLE_SHEETS",
        credentials: tokens,
        isActive: false,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
};
