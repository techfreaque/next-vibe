/**
 * Journey Variants Repository
 * CRUD operations for email journey variant registrations.
 */

import "server-only";

import { count, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { emailJourneyVariants } from "../../db";
import { EmailJourneyVariant } from "../../enum";
import type {
  JourneyVariantsGetResponseOutput,
  JourneyVariantsPatchRequestOutput,
  JourneyVariantsPatchResponseOutput,
  JourneyVariantsPostRequestOutput,
  JourneyVariantsPostResponseOutput,
} from "./definition";
import type { JourneyVariantsT } from "./i18n";

export class JourneyVariantsRepository {
  private static readonly VALID_VARIANT_KEYS = new Set<string>(
    Object.values(EmailJourneyVariant),
  );
  // ── GET — list all ──────────────────────────────────────────────────────────
  static async getAll(
    logger: EndpointLogger,
    t: JourneyVariantsT,
  ): Promise<ResponseType<JourneyVariantsGetResponseOutput>> {
    try {
      const rows = await db
        .select()
        .from(emailJourneyVariants)
        .orderBy(emailJourneyVariants.variantKey);

      const [countRow] = await db
        .select({ count: count() })
        .from(emailJourneyVariants);

      const total = countRow?.count ?? 0;

      const items = rows.map((r) => ({
        id: r.id,
        variantKey: r.variantKey,
        displayName: r.displayName,
        description: r.description ?? null,
        weight: r.weight,
        active: r.active,
        campaignType: r.campaignType ?? null,
        sourceFilePath: r.sourceFilePath ?? null,
        senderName: r.senderName ?? null,
        companyName: r.companyName ?? null,
        companyEmail: r.companyEmail ?? null,
        checkErrors: r.checkErrors ?? [],
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      }));

      logger.info("journeyVariants.list.success", { total });
      return success({ total, items });
    } catch (error) {
      logger.error("journeyVariants.list.error", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  // ── POST — register new variant ─────────────────────────────────────────────
  static async register(
    data: JourneyVariantsPostRequestOutput,
    logger: EndpointLogger,
    t: JourneyVariantsT,
  ): Promise<ResponseType<JourneyVariantsPostResponseOutput>> {
    // Validate that variantKey exists in the enum
    if (!JourneyVariantsRepository.VALID_VARIANT_KEYS.has(data.variantKey)) {
      return fail({
        message: t("post.errors.notFound.description"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // Check for duplicate
    const [existing] = await db
      .select({ id: emailJourneyVariants.id })
      .from(emailJourneyVariants)
      .where(eq(emailJourneyVariants.variantKey, data.variantKey));

    if (existing) {
      return fail({
        message: t("post.errors.conflict.description"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }

    try {
      const [created] = await db
        .insert(emailJourneyVariants)
        .values({
          variantKey: data.variantKey,
          displayName: data.displayName,
          description: data.description ?? null,
          weight: data.weight ?? 33,
          active: true,
          campaignType: data.campaignType ?? null,
          sourceFilePath: data.sourceFilePath ?? null,
          senderName: data.senderName ?? null,
          companyName: data.companyName ?? null,
          companyEmail: data.companyEmail ?? null,
          checkErrors: [],
        })
        .returning();

      if (!created) {
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.info("journeyVariants.register.success", {
        variantKey: data.variantKey,
        id: created.id,
      });

      return success({
        variantKey: created.variantKey,
        displayName: created.displayName,
        description: created.description ?? null,
        weight: created.weight,
        campaignType: created.campaignType ?? null,
        sourceFilePath: created.sourceFilePath ?? null,
        senderName: created.senderName ?? null,
        companyName: created.companyName ?? null,
        companyEmail: created.companyEmail ?? null,
        id: created.id,
        active: created.active,
        checkErrors: created.checkErrors ?? [],
        createdAt: created.createdAt.toISOString(),
      });
    } catch (error) {
      logger.error("journeyVariants.register.error", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  // ── PATCH — update active/weight/metadata ────────────────────────────────────
  static async update(
    data: JourneyVariantsPatchRequestOutput,
    logger: EndpointLogger,
    t: JourneyVariantsT,
  ): Promise<ResponseType<JourneyVariantsPatchResponseOutput>> {
    const [existing] = await db
      .select()
      .from(emailJourneyVariants)
      .where(eq(emailJourneyVariants.id, data.id));

    if (!existing) {
      return fail({
        message: t("patch.errors.notFound.description"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    try {
      const updates: Partial<typeof emailJourneyVariants.$inferInsert> = {
        updatedAt: new Date(),
      };

      if (data.active !== undefined) {
        updates.active = data.active;
      }
      if (data.weight !== undefined) {
        updates.weight = data.weight;
      }
      if (data.displayName !== undefined) {
        updates.displayName = data.displayName;
      }
      if (data.description !== undefined) {
        updates.description = data.description;
      }
      if (data.senderName !== undefined) {
        updates.senderName = data.senderName ?? null;
      }
      if (data.companyName !== undefined) {
        updates.companyName = data.companyName ?? null;
      }
      if (data.companyEmail !== undefined) {
        updates.companyEmail = data.companyEmail ?? null;
      }

      const [updated] = await db
        .update(emailJourneyVariants)
        .set(updates)
        .where(eq(emailJourneyVariants.id, data.id))
        .returning();

      if (!updated) {
        return fail({
          message: t("patch.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.info("journeyVariants.update.success", {
        id: data.id,
        variantKey: updated.variantKey,
      });

      return success({
        id: updated.id,
        variantKey: updated.variantKey,
        active: updated.active,
        weight: updated.weight,
        displayName: updated.displayName,
        description: updated.description ?? null,
        updatedAt: updated.updatedAt.toISOString(),
      });
    } catch (error) {
      logger.error("journeyVariants.update.error", parseError(error));
      return fail({
        message: t("patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  // ── Helper: fetch active DB variants for renderer ──────────────────────────
  static async getActiveVariantKeys(): Promise<string[]> {
    try {
      const rows = await db
        .select({ variantKey: emailJourneyVariants.variantKey })
        .from(emailJourneyVariants)
        .where(eq(emailJourneyVariants.active, true));
      return rows.map((r) => r.variantKey);
    } catch {
      return [];
    }
  }
}
