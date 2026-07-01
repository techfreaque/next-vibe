/**
 * Vendor Get Repository
 * Retrieves a single vendor by ID
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
import type { VendorGetResponseOutput } from "./definition";

export class VendorGetRepository {
  static async getVendor(
    vendorId: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<VendorGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [vendor] = await db
        .select()
        .from(purchasingVendors)
        .where(eq(purchasingVendors.id, vendorId))
        .limit(1);

      if (!vendor) {
        return fail({
          message: t("vendorGet.get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        vendor.companyId,
        CompanyMemberRole.VIEWER,
        logger,
        locale,
      );
      if (!authResult.success) {
        return fail({
          message: t("vendorGet.get.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      return success({
        result: {
          id: vendor.id,
          companyId: vendor.companyId,
          name: vendor.name,
          code: vendor.code,
          email: vendor.email,
          phone: vendor.phone,
          website: vendor.website,
          vatNumber: vendor.vatNumber,
          taxId: vendor.taxId,
          addressLine1: vendor.addressLine1,
          addressLine2: vendor.addressLine2,
          city: vendor.city,
          region: vendor.region,
          postalCode: vendor.postalCode,
          country: vendor.country,
          defaultCurrency: vendor.defaultCurrency,
          defaultPaymentTermsDays: vendor.defaultPaymentTermsDays,
          isActive: vendor.isActive,
          notes: vendor.notes,
          createdAt: vendor.createdAt,
          updatedAt: vendor.updatedAt,
        },
      });
    } catch (error) {
      logger.error("Failed to get vendor", parseError(error));
      return fail({
        message: t("vendorGet.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
