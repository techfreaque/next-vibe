/**
 * Shared repository for provider config saves.
 * All per-provider routes delegate here.
 */

import "server-only";

import { eq } from "drizzle-orm";
import {
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";

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

  const existing = await db
    .select({
      id: leadMagnetConfigs.id,
      credentials: leadMagnetConfigs.credentials,
    })
    .from(leadMagnetConfigs)
    .where(eq(leadMagnetConfigs.userId, userId))
    .limit(1);

  // Merge credentials: keep existing value for any key submitted as empty/undefined
  // This preserves stored API keys/secrets when user edits non-sensitive fields only
  const mergedCredentials: Record<string, string> = {};
  const existingCredentials = existing[0]?.credentials ?? {};
  for (const [key, value] of Object.entries(credentials)) {
    if (value !== undefined && value !== "") {
      mergedCredentials[key] = value;
    } else if (existingCredentials[key]) {
      mergedCredentials[key] = existingCredentials[key];
    }
  }
  // Also carry over any credential keys from existing that aren't in the submitted set
  // (e.g. switching providers doesn't apply here, but defensive for edge cases)
  for (const [key, value] of Object.entries(existingCredentials)) {
    if (!(key in mergedCredentials)) {
      mergedCredentials[key] = value;
    }
  }

  const values = {
    provider,
    credentials: mergedCredentials,
    listId: shared.listId,
    headline: shared.headline,
    buttonText: shared.buttonText,
    isActive: shared.isActive,
    updatedAt: now,
  };

  if (existing.length > 0) {
    await db
      .update(leadMagnetConfigs)
      .set(values)
      .where(eq(leadMagnetConfigs.userId, userId));
  } else {
    await db
      .insert(leadMagnetConfigs)
      .values({ ...values, userId, createdAt: now });
  }

  return success({
    provider,
    isActiveResponse: shared.isActive,
  });
}
