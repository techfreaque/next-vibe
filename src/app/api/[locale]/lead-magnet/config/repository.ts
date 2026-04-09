/**
 * Lead Magnet Config Repository
 * GET and DELETE only - saves are handled per-provider
 */

import "server-only";

import { eq } from "drizzle-orm";
import {
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";

import type { LeadMagnetProviderDB } from "../enum";
import { leadMagnetConfigs } from "../db";
import type { LeadMagnetConfigGetResponseOutput } from "./definition";

type LeadMagnetProviderKey = (typeof LeadMagnetProviderDB)[number];

export const LeadMagnetConfigRepository = {
  async getConfig(
    userId: string,
  ): Promise<ResponseType<LeadMagnetConfigGetResponseOutput>> {
    const rows = await db
      .select()
      .from(leadMagnetConfigs)
      .where(eq(leadMagnetConfigs.userId, userId))
      .limit(1);

    if (rows.length === 0) {
      return success({ exists: false, config: null });
    }

    const row = rows[0];
    return success({
      exists: true,
      config: {
        id: row.id,
        userId: row.userId,
        provider: row.provider as LeadMagnetProviderKey,
        listId: row.listId,
        headline: row.headline,
        buttonText: row.buttonText,
        isActive: row.isActive,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      },
    });
  },

  async deleteConfig(
    userId: string,
  ): Promise<ResponseType<{ deleted: boolean }>> {
    const rows = await db
      .delete(leadMagnetConfigs)
      .where(eq(leadMagnetConfigs.userId, userId))
      .returning({ id: leadMagnetConfigs.id });

    return success({ deleted: rows.length > 0 });
  },
};
