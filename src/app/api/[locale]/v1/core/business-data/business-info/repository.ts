/**
 * Business Info Repository
 * Implements repository pattern for business info operations
 */

import "server-only";

import { eq } from "drizzle-orm";
import { withTransaction } from "next-vibe/server/db/repository-helpers";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { DbId } from "@/app/api/[locale]/v1/core/system/db/types";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";
import { users } from "@/app/api/[locale]/v1/core/user/db";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { userRolesRepository } from "@/app/api/[locale]/v1/core/user/user-roles/repository";
import type { CountryLanguage } from "@/i18n/core/config";

import { businessInfo } from "./db";
import type {
  BusinessInfoGetResponseTypeOutput,
  BusinessInfoPostRequestTypeOutput,
  BusinessInfoPostResponseTypeOutput,
} from "./definition";
import { BusinessType } from "./enum";

type SectionCompletionStatus =
  BusinessInfoGetResponseTypeOutput["completionStatus"];

/**
 * Calculate completion status for business info data
 */
function calculateBusinessInfoCompletionStatus(
  data: Partial<BusinessInfoGetResponseTypeOutput>,
): SectionCompletionStatus {
  // Define all business info fields for completion tracking
  const allFields = [
    "businessName",
    "industry",
    "businessType",
    "businessSize",
    "foundedYear",
    "employeeCount",
    "businessEmail",
    "businessPhone",
    "country",
    "city",
    "location",
    "website",
    "description",
    "productsServices",
    "additionalNotes",
  ];

  const completedFields = allFields.filter((field) => {
    const value = data[field as keyof BusinessInfoGetResponseTypeOutput];
    return value !== undefined && value !== null && value !== "";
  }).length;

  const totalFields = allFields.length;
  const completionPercentage = Math.round(
    (completedFields / totalFields) * 100,
  );

  // Required fields for business info
  const requiredFields = ["businessName", "businessType", "industry"];
  const missingRequiredFields = requiredFields.filter((field) => {
    const value = data[field as keyof BusinessInfoGetResponseTypeOutput];
    return !value || value === "";
  });

  const isComplete = missingRequiredFields.length === 0 && completedFields >= 6; // At least 6 fields filled

  return {
    isComplete,
    completedFields,
    totalFields,
    completionPercentage,
    missingRequiredFields,
  };
}

/**
 * Business Info Repository Interface
 */
export interface BusinessInfoRepository {
  getBusinessInfo(
    userId: DbId,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<BusinessInfoGetResponseTypeOutput>>;

  updateBusinessInfo(
    userId: DbId,
    data: BusinessInfoPostRequestTypeOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<BusinessInfoPostResponseTypeOutput>>;
}

/**
 * Business Info Repository Implementation
 */
class BusinessInfoRepositoryImpl implements BusinessInfoRepository {
  /**
   * Get business info for a user
   */
  async getBusinessInfo(
    userId: DbId,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<BusinessInfoGetResponseTypeOutput>> {
    try {
      const actualUserId = authRepository.requireUserId(user);
      const canAccess = await this.canAccessBusinessInfo(
        actualUserId,
        userId,
        logger,
      );

      if (!canAccess) {
        return createErrorResponse(
          "app.api.v1.core.businessData.businessInfo.get.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      const businessInfoData = await db
        .select()
        .from(businessInfo)
        .where(eq(businessInfo.userId, userId))
        .limit(1);

      // Get company name from user table
      const userData = await db
        .select({ company: users.company, website: users.website })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      const result = businessInfoData[0];
      const userResult = userData[0];

      const responseData = {
        businessName: userResult?.company || undefined,
        industry: result?.industry || undefined,
        businessType: result?.businessType || undefined,
        businessSize: result?.businessSize || undefined,
        foundedYear: result?.foundedYear || undefined,
        employeeCount: result?.employeeCount || undefined,
        businessEmail: result?.businessEmail || undefined,
        businessPhone: result?.businessPhone || undefined,
        country: result?.country || undefined,
        city: result?.city || undefined,
        location: result?.location || undefined,
        website: userResult?.website || undefined,
        description: result?.description || undefined,
        productsServices: result?.productsServices || undefined,
        additionalNotes: result?.additionalNotes || undefined,
      };

      const completionStatus =
        calculateBusinessInfoCompletionStatus(responseData);

      return createSuccessResponse({
        ...responseData,
        completionStatus,
      });
    } catch (error) {
      logger.error(
        "app.api.v1.core.businessData.businessInfo.get.errors.server.title",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.businessData.businessInfo.get.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Update business info for a user
   */
  async updateBusinessInfo(
    userId: DbId,
    data: BusinessInfoPostRequestTypeOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<BusinessInfoPostResponseTypeOutput>> {
    try {
      const actualUserId = authRepository.requireUserId(user);
      const canAccess = await this.canAccessBusinessInfo(
        actualUserId,
        userId,
        logger,
      );

      if (!canAccess) {
        return createErrorResponse(
          "app.api.v1.core.businessData.businessInfo.get.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      await withTransaction(logger, async (tx) => {
        const existingBusinessInfo = await tx
          .select()
          .from(businessInfo)
          .where(eq(businessInfo.userId, userId))
          .limit(1);

        if (existingBusinessInfo.length > 0) {
          // Update business info
          await tx
            .update(businessInfo)
            .set({
              industry: data.industry,
              businessType: data.businessType,
              businessSize: data.businessSize,
              foundedYear: data.foundedYear,
              employeeCount: data.employeeCount,
              businessEmail: data.businessEmail,
              businessPhone: data.businessPhone,
              country: data.country,
              city: data.city,
              location: data.location,
              description: data.description,
              productsServices: data.productsServices,
              additionalNotes: data.additionalNotes,
              updatedAt: new Date(),
            })
            .where(eq(businessInfo.userId, userId));

          // Update company name and website in user table if provided
          if (data.businessName || data.website) {
            const updateData: {
              company?: string;
              website?: string;
              updatedAt: Date;
            } = {
              updatedAt: new Date(),
            };
            if (data.businessName) {
              updateData.company = data.businessName;
            }
            if (data.website) {
              updateData.website = data.website;
            }

            await tx.update(users).set(updateData).where(eq(users.id, userId));
          }
        } else {
          // Insert business info
          await tx.insert(businessInfo).values({
            userId,
            businessType: data.businessType || BusinessType.OTHER,
            industry: data.industry,
            businessSize: data.businessSize,
            foundedYear: data.foundedYear,
            employeeCount: data.employeeCount,
            businessEmail: data.businessEmail,
            businessPhone: data.businessPhone,
            country: data.country,
            city: data.city,
            location: data.location,
            description: data.description,
            productsServices: data.productsServices,
            additionalNotes: data.additionalNotes,
          });

          // Update company name and website in user table if provided
          if (data.businessName || data.website) {
            const updateData: {
              company?: string;
              website?: string;
              updatedAt: Date;
            } = {
              updatedAt: new Date(),
            };
            if (data.businessName) {
              updateData.company = data.businessName;
            }
            if (data.website) {
              updateData.website = data.website;
            }

            await tx.update(users).set(updateData).where(eq(users.id, userId));
          }
        }
      });

      // Get updated company name from user table for response
      const userData = await db
        .select({ company: users.company })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      const responseData = {
        businessName: data.businessName || userData[0]?.company,
        industry: data.industry,
        businessType: data.businessType,
        businessSize: data.businessSize,
        foundedYear: data.foundedYear,
        employeeCount: data.employeeCount,
        businessEmail: data.businessEmail,
        businessPhone: data.businessPhone,
        country: data.country,
        city: data.city,
        location: data.location,
        website: data.website,
        description: data.description,
        productsServices: data.productsServices,
        additionalNotes: data.additionalNotes,
      };

      const completionStatus =
        calculateBusinessInfoCompletionStatus(responseData);

      return createSuccessResponse({
        ...responseData,
        message:
          "app.api.v1.core.businessData.businessInfo.put.success.message",
        completionStatus,
      });
    } catch (error) {
      logger.error(
        "app.api.v1.core.businessData.businessInfo.put.errors.server.title",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.businessData.businessInfo.put.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Check if user can access business info data
   */
  private async canAccessBusinessInfo(
    actualUserId: DbId,
    targetUserId: DbId,
    logger: EndpointLogger,
  ): Promise<boolean> {
    if (actualUserId === targetUserId) {
      return true;
    }

    const userRoles = await userRolesRepository.findByUserId(
      actualUserId,
      logger,
    );
    if (userRoles.success) {
      return userRoles.data.some((role) => role.role === UserRole.ADMIN);
    }

    return false;
  }
}

export const businessInfoRepository = new BusinessInfoRepositoryImpl();
