/**
 * Vendor Update Repository
 * Updates vendor details
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/app/api/[locale]/companies/enum";
import { CompanyAuthRepository } from "@/app/api/[locale]/companies/repository";

import { purchasingVendors } from "../../../db";
import { scopedTranslation } from "../../../i18n";
import type {
  VendorUpdateRequestOutput,
  VendorUpdateResponseOutput,
} from "./definition";

export class VendorUpdateRepository {
  static async updateVendor(
    vendorId: string,
    userId: string,
    data: VendorUpdateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<VendorUpdateResponseOutput>> {
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
          message: t("vendorUpdate.patch.errors.notFound.title"),
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
          message: t("vendorUpdate.patch.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const [updated] = await db
        .update(purchasingVendors)
        .set({
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.code !== undefined ? { code: data.code } : {}),
          ...(data.email !== undefined ? { email: data.email } : {}),
          ...(data.phone !== undefined ? { phone: data.phone } : {}),
          ...(data.website !== undefined ? { website: data.website } : {}),
          ...(data.vatNumber !== undefined
            ? { vatNumber: data.vatNumber }
            : {}),
          ...(data.taxId !== undefined ? { taxId: data.taxId } : {}),
          ...(data.addressLine1 !== undefined
            ? { addressLine1: data.addressLine1 }
            : {}),
          ...(data.addressLine2 !== undefined
            ? { addressLine2: data.addressLine2 }
            : {}),
          ...(data.city !== undefined ? { city: data.city } : {}),
          ...(data.region !== undefined ? { region: data.region } : {}),
          ...(data.postalCode !== undefined
            ? { postalCode: data.postalCode }
            : {}),
          ...(data.country !== undefined ? { country: data.country } : {}),
          ...(data.defaultCurrency !== undefined
            ? { defaultCurrency: data.defaultCurrency }
            : {}),
          ...(data.defaultPaymentTermsDays !== undefined
            ? { defaultPaymentTermsDays: data.defaultPaymentTermsDays }
            : {}),
          ...(data.notes !== undefined ? { notes: data.notes } : {}),
          updatedAt: new Date(),
        })
        .where(eq(purchasingVendors.id, vendorId))
        .returning();

      if (!updated) {
        return fail({
          message: t("vendorUpdate.patch.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.info("Vendor updated", { vendorId });

      return success({
        result: {
          id: updated.id,
          nameResponse: updated.name,
          isActive: updated.isActive,
          updatedAt: updated.updatedAt,
        },
      });
    } catch (error) {
      logger.error("Failed to update vendor", parseError(error));
      return fail({
        message: t("vendorUpdate.patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
