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
  credentials: Record<string, string>,
  shared: SharedFields,
): Promise<ResponseType<SaveProviderResponse>> {
  const now = new Date();

  const existing = await db
    .select({ id: leadMagnetConfigs.id })
    .from(leadMagnetConfigs)
    .where(eq(leadMagnetConfigs.userId, userId))
    .limit(1);

  const values = {
    provider,
    credentials,
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
