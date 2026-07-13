/**
 * Vendor Create Repository
 * Registers a new supplier vendor for a company
 */

import "server-only";

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

import { purchasingVendors } from "../../db";
import { scopedTranslation } from "../../i18n";
import type {
  VendorCreateRequestOutput,
  VendorCreateResponseOutput,
} from "./definition";

export class VendorCreateRepository {
  static async createVendor(
    userId: string,
    data: VendorCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<VendorCreateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const authResult = await CompanyAuthRepository.requireMember(
        userId,
        data.companyId,
        CompanyMemberRole.MEMBER,
        logger,
        locale,
      );
      if (!authResult.success) {
        return authResult;
      }

      const [vendor] = await db
        .insert(purchasingVendors)
        .values({
          companyId: data.companyId,
          name: data.name,
          code: data.code ?? null,
          email: data.email ?? null,
          phone: data.phone ?? null,
          website: data.website ?? null,
          vatNumber: data.vatNumber ?? null,
          taxId: data.taxId ?? null,
          addressLine1: data.addressLine1 ?? null,
          addressLine2: data.addressLine2 ?? null,
          city: data.city ?? null,
          region: data.region ?? null,
          postalCode: data.postalCode ?? null,
          country: data.country ?? null,
          defaultCurrency: data.defaultCurrency ?? "EUR",
          defaultPaymentTermsDays: data.defaultPaymentTermsDays ?? 30,
          notes: data.notes ?? null,
        })
        .returning();

      if (!vendor) {
        return fail({
          message: t("vendorCreate.post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.info("Vendor created", {
        vendorId: vendor.id,
        companyId: data.companyId,
        name: data.name,
      });

      return success({
        id: vendor.id,
        nameResponse: vendor.name,
        codeResponse: vendor.code,
        emailResponse: vendor.email,
        isActive: vendor.isActive,
        createdAt: vendor.createdAt,
      });
    } catch (error) {
      logger.error("Failed to create vendor", parseError(error));
      return fail({
        message: t("vendorCreate.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
