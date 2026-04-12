import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";

import { leadMagnetConfigs } from "../../db";

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
