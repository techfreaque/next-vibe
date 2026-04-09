import "server-only";

import { desc, eq } from "drizzle-orm";
import {
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";

import { leadMagnetCaptures, leadMagnetConfigs } from "../db";
import type { CapturesListResponseOutput } from "./definition";

const DEFAULT_PAGE_SIZE = 50;

export const LeadMagnetCapturesRepository = {
  async listCaptures(
    userId: string,
    page = 1,
  ): Promise<ResponseType<CapturesListResponseOutput>> {
    const offset = (page - 1) * DEFAULT_PAGE_SIZE;

    // Get the config for this user (to join captures)
    const configRows = await db
      .select({ id: leadMagnetConfigs.id })
      .from(leadMagnetConfigs)
      .where(eq(leadMagnetConfigs.userId, userId))
      .limit(1);

    if (configRows.length === 0) {
      return success({
        items: [],
        total: 0,
        page,
        pageSize: DEFAULT_PAGE_SIZE,
      });
    }

    const configId = configRows[0].id;

    const [items, countRows] = await Promise.all([
      db
        .select({
          id: leadMagnetCaptures.id,
          email: leadMagnetCaptures.email,
          firstName: leadMagnetCaptures.firstName,
          status: leadMagnetCaptures.status,
          errorMessage: leadMagnetCaptures.errorMessage,
          createdAt: leadMagnetCaptures.createdAt,
        })
        .from(leadMagnetCaptures)
        .where(eq(leadMagnetCaptures.configId, configId))
        .orderBy(desc(leadMagnetCaptures.createdAt))
        .limit(DEFAULT_PAGE_SIZE)
        .offset(offset),
      db
        .select({ id: leadMagnetCaptures.id })
        .from(leadMagnetCaptures)
        .where(eq(leadMagnetCaptures.configId, configId)),
    ]);

    return success({
      items: items.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
      total: countRows.length,
      page,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  },
};
