/**
 * User Address by ID Repository
 * Update and delete individual addresses for the authenticated user
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { userAddresses } from "@/app/api/[locale]/user/db";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  UserAddressDeleteResponseOutput,
  UserAddressPatchRequestOutput,
  UserAddressPatchResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

export class UserAddressByIdRepository {
  static async updateAddress(
    data: UserAddressPatchRequestOutput,
    addressId: string,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserAddressPatchResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      if (!user.id) {
        return fail({
          message: t("update.errors.unauthorized.title"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      // Verify address belongs to the authenticated user
      const [existing] = await db
        .select({ id: userAddresses.id, userId: userAddresses.userId })
        .from(userAddresses)
        .where(eq(userAddresses.id, addressId))
        .limit(1);

      if (!existing) {
        return fail({
          message: t("update.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (existing.userId !== user.id) {
        return fail({
          message: t("update.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      logger.debug("Updating address", { addressId, userId: user.id });

      // Unset isDefaultBilling on other addresses if this is flagged default billing
      if (data.isDefaultBilling === true) {
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
      if (data.isDefaultDelivery === true) {
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

      const updateData: Partial<typeof userAddresses.$inferInsert> = {
        updatedAt: new Date(),
      };

      if (data.label !== undefined) {
        updateData.label = data.label;
      }
      if (data.fullName !== undefined) {
        updateData.fullName = data.fullName;
      }
      if (data.company !== undefined) {
        updateData.company = data.company;
      }
      if (data.phone !== undefined) {
        updateData.phone = data.phone;
      }
      if (data.vatNumber !== undefined) {
        updateData.vatNumber = data.vatNumber;
      }
      if (data.taxId !== undefined) {
        updateData.taxId = data.taxId;
      }
      if (data.addressLine1 !== undefined) {
        updateData.addressLine1 = data.addressLine1;
      }
      if (data.addressLine2 !== undefined) {
        updateData.addressLine2 = data.addressLine2;
      }
      if (data.city !== undefined) {
        updateData.city = data.city;
      }
      if (data.region !== undefined) {
        updateData.region = data.region;
      }
      if (data.postalCode !== undefined) {
        updateData.postalCode = data.postalCode;
      }
      if (data.country !== undefined) {
        updateData.country = data.country;
      }
      if (data.isDefaultBilling !== undefined) {
        updateData.isDefaultBilling = data.isDefaultBilling;
      }
      if (data.isDefaultDelivery !== undefined) {
        updateData.isDefaultDelivery = data.isDefaultDelivery;
      }

      await db
        .update(userAddresses)
        .set(updateData)
        .where(eq(userAddresses.id, addressId));

      logger.debug("Address updated", { addressId });

      return success({ updated: true });
    } catch (error) {
      logger.error("Error updating address", parseError(error));
      return fail({
        message: t("update.errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  static async deleteAddress(
    addressId: string,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UserAddressDeleteResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      if (!user.id) {
        return fail({
          message: t("delete.errors.unauthorized.title"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      // Verify address belongs to the authenticated user
      const [existing] = await db
        .select({ id: userAddresses.id, userId: userAddresses.userId })
        .from(userAddresses)
        .where(eq(userAddresses.id, addressId))
        .limit(1);

      if (!existing) {
        return fail({
          message: t("delete.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (existing.userId !== user.id) {
        return fail({
          message: t("delete.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      logger.debug("Deleting address", { addressId, userId: user.id });

      await db.delete(userAddresses).where(eq(userAddresses.id, addressId));

      logger.debug("Address deleted", { addressId });

      return success({ deleted: true });
    } catch (error) {
      logger.error("Error deleting address", parseError(error));
      return fail({
        message: t("delete.errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}
