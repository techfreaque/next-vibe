/**
 * User Addresses Repository
 * List and create addresses for the authenticated user
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { userAddresses } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import type {
  UserAddressesGetResponseOutput,
  UserAddressesPostRequestOutput,
  UserAddressesPostResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class UserAddressesRepository {
  static async listAddresses(
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserAddressesGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      if (!user.id) {
        return fail({
          message: t("list.errors.unauthorized.title"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      logger.debug("Listing addresses", { userId: user.id });

      const rows = await db
        .select()
        .from(userAddresses)
        .where(eq(userAddresses.userId, user.id))
        .orderBy(userAddresses.createdAt);

      return success({
        addresses: rows.map((r) => ({
          ...r,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        })),
      });
    } catch (error) {
      logger.error("Error listing addresses", parseError(error));
      return fail({
        message: t("list.errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  static async createAddress(
    data: UserAddressesPostRequestOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserAddressesPostResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      if (!user.id) {
        return fail({
          message: t("create.errors.unauthorized.title"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      logger.debug("Creating address", { userId: user.id });

      // Unset isDefaultBilling on other addresses if this is flagged default billing
      if (data.isDefaultBilling) {
        await db
          .update(userAddresses)
          .set({ isDefaultBilling: false, updatedAt: new Date() })
          .where(
            and(
              eq(userAddresses.userId, user.id),
              eq(userAddresses.isDefaultBilling, true),
            ),
          );
      }

      // Unset isDefaultDelivery on other addresses if this is flagged default delivery
      if (data.isDefaultDelivery) {
        await db
          .update(userAddresses)
          .set({ isDefaultDelivery: false, updatedAt: new Date() })
          .where(
            and(
              eq(userAddresses.userId, user.id),
              eq(userAddresses.isDefaultDelivery, true),
            ),
          );
      }

      const [created] = await db
        .insert(userAddresses)
        .values({
          userId: user.id,
          label: data.addressLabel,
          fullName: data.fullName ?? null,
          company: data.company ?? null,
          phone: data.phone ?? null,
          vatNumber: data.vatNumber ?? null,
          taxId: data.taxId ?? null,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2 ?? null,
          city: data.city,
          region: data.region ?? null,
          postalCode: data.postalCode ?? null,
          country: data.country,
          isDefaultBilling: data.isDefaultBilling,
          isDefaultDelivery: data.isDefaultDelivery,
        })
        .returning({
          id: userAddresses.id,
          responseLabel: userAddresses.label,
        });

      if (!created) {
        return fail({
          message: t("create.errors.internal.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.debug("Address created", { addressId: created.id });

      return success({ id: created.id, responseLabel: created.responseLabel });
    } catch (error) {
      logger.error("Error creating address", parseError(error));
      return fail({
        message: t("create.errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}
