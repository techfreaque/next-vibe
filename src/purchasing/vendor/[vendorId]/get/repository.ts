/**
 * Vendor Get Repository
 * Retrieves a single vendor by ID
 */

import "server-only";

import { and, eq, sql } from "drizzle-orm";
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

import { companies } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import { purchaseOrders, purchasingVendors } from "../../../db";
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

      const [[company], [orders]] = await Promise.all([
        db
          .select({ name: companies.name })
          .from(companies)
          .where(eq(companies.id, vendor.companyId)),
        db
          .select({
            orderCount: sql<number>`count(*)::int`,
            receivingCount: sql<number>`count(*) filter (where ${purchaseOrders.status} in ('SENT', 'CONFIRMED', 'PARTIALLY_RECEIVED'))::int`,
          })
          .from(purchaseOrders)
          .where(
            and(
              eq(purchaseOrders.companyId, vendor.companyId),
              eq(purchaseOrders.vendorId, vendor.id),
            ),
          ),
      ]);

      return success({
        result: {
          id: vendor.id,
          companyId: vendor.companyId,
          companyName: company?.name,
          orderCount: orders?.orderCount ?? 0,
          receivingCount: orders?.receivingCount ?? 0,
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
