/**
 * Vendor Deactivate Repository
 * Soft-deactivates a vendor by setting isActive = false
 */

import "server-only";

import { eq } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";
import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { purchasingVendors } from "../../../db";
import { scopedTranslation } from "../../../i18n";

interface VendorDeactivateResult {
  id: string;
  isActive: boolean;
}

export class VendorDeactivateRepository {
  static async deactivateVendor(
    vendorId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<{ result: VendorDeactivateResult }>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [existing] = await db
        .select({
          id: purchasingVendors.id,
          companyId: purchasingVendors.companyId,
        })
        .from(purchasingVendors)
        .where(eq(purchasingVendors.id, vendorId))
        .limit(1);

      if (!existing) {
        return fail({
          message: t("vendorDeactivate.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        existing.companyId,
        CompanyMemberRole.MEMBER,
        logger,
        locale,
      );
      if (!authResult.success) {
        return fail({
          message: t("vendorDeactivate.post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const [updated] = await db
        .update(purchasingVendors)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(purchasingVendors.id, vendorId))
        .returning({
          id: purchasingVendors.id,
          isActive: purchasingVendors.isActive,
        });

      if (!updated) {
        return fail({
          message: t("vendorDeactivate.post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.info("Vendor deactivated", { vendorId });

      return success({
        result: {
          id: updated.id,
          isActive: updated.isActive,
        },
      });
    } catch (error) {
      logger.error("Failed to deactivate vendor", parseError(error));
      return fail({
        message: t("vendorDeactivate.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
