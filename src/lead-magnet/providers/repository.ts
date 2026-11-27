/**
 * Shared repository for provider config saves.
 * All per-provider routes delegate here.
 */

import "server-only";

import { sql } from "drizzle-orm";
import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";

import { leadMagnetConfigs } from "../db";

interface SharedFields {
  listId: string | null;
  headline: string | null;
  buttonText: string | null;
  isActive: boolean;
}

interface SaveProviderResponse {
  provider: string;
  isActiveResponse: boolean;
}

export async function saveProviderConfig(
  userId: string,
  provider: string,
  credentials: Record<string, string | undefined>,
  shared: SharedFields,
): Promise<ResponseType<SaveProviderResponse>> {
  const now = new Date();

  const submittedCredentials: Record<string, string> = {};
  for (const [key, value] of Object.entries(credentials)) {
    if (value !== undefined && value !== "") {
      submittedCredentials[key] = value;
    }
  }

  const values = {
    provider,
    credentials: submittedCredentials,
    listId: shared.listId,
    headline: shared.headline,
    buttonText: shared.buttonText,
    isActive: shared.isActive,
    updatedAt: now,
  };

  await db
    .insert(leadMagnetConfigs)
    .values({ ...values, userId, createdAt: now })
    .onConflictDoUpdate({
      target: leadMagnetConfigs.userId,
      set: {
        ...values,
        credentials: sql`case
          when ${leadMagnetConfigs.provider} = excluded.provider
          then ${leadMagnetConfigs.credentials} || excluded.credentials
          else excluded.credentials
        end`,
      },
    });

  return success({
    provider,
    isActiveResponse: shared.isActive,
  });
}
