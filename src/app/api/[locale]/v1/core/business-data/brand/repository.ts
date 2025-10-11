/**
 * Brand Repository
 * Implements repository pattern for brand operations
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
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { userRolesRepository } from "@/app/api/[locale]/v1/core/user/user-roles/repository";

import { brand } from "./db";
import type {
  BrandGetResponseTypeOutput,
  BrandPutRequestTypeOutput,
  BrandPutResponseTypeOutput,
} from "./definition";
import { BrandPersonality, BrandVoice, VisualStyle } from "./enum";

type SectionCompletionStatus = BrandGetResponseTypeOutput["completionStatus"];

// Extract types from enum values
type BrandPersonalityType =
  (typeof BrandPersonality)[keyof typeof BrandPersonality];
type BrandVoiceType = (typeof BrandVoice)[keyof typeof BrandVoice];
type VisualStyleType = (typeof VisualStyle)[keyof typeof VisualStyle];

/**
 * Convert string to BrandPersonality enum
 */
function convertToBrandPersonality(
  value?: string | null,
): BrandPersonalityType | undefined {
  if (!value) {
    return undefined;
  }
  return Object.values(BrandPersonality).includes(value as BrandPersonalityType)
    ? (value as BrandPersonalityType)
    : undefined;
}

/**
 * Convert string to BrandVoice enum
 */
function convertToBrandVoice(
  value?: string | null,
): BrandVoiceType | undefined {
  if (!value) {
    return undefined;
  }
  return Object.values(BrandVoice).includes(value as BrandVoiceType)
    ? (value as BrandVoiceType)
    : undefined;
}

/**
 * Convert string to VisualStyle enum
 */
function convertToVisualStyle(
  value?: string | null,
): VisualStyleType | undefined {
  if (!value) {
    return undefined;
  }
  return Object.values(VisualStyle).includes(value as VisualStyleType)
    ? (value as VisualStyleType)
    : undefined;
}

/**
 * Calculate completion status for brand data
 */
function calculateBrandCompletionStatus(
  data: Partial<BrandGetResponseTypeOutput>,
): SectionCompletionStatus {
  // Define all brand fields for completion tracking (18 fields total)
  const allFields = [
    "brandGuidelines",
    "brandDescription",
    "brandValues",
    "brandPersonality",
    "brandVoice",
    "brandTone",
    "brandColors",
    "brandFonts",
    "logoDescription",
    "visualStyle",
    "brandPromise",
    "brandDifferentiators",
    "brandMission",
    "brandVision",
    "hasStyleGuide",
    "hasLogoFiles",
    "hasBrandAssets",
    "additionalNotes",
  ];

  // Count completed fields (non-empty values)
  const completedFields = allFields.filter((field) => {
    const value = data[field as keyof BrandGetResponseTypeOutput];
    // For boolean fields, only consider them completed when they are explicitly true
    // This prevents counting default false values as completed fields
    if (typeof value === "boolean") {
      return value === true;
    }
    return value !== undefined && value !== null && value !== "";
  }).length;

  const totalFields = allFields.length;
  const completionPercentage = Math.round(
    (completedFields / totalFields) * 100,
  );

  // For brand, consider it complete if at least 50% of fields are filled
  const isComplete = completionPercentage >= 50;

  // Required fields for basic completion
  const requiredFields = ["brandDescription", "brandValues", "brandVoice"];
  const missingRequiredFields = requiredFields.filter((field) => {
    const value = data[field as keyof BrandGetResponseTypeOutput];
    return !value || value === "";
  });

  return {
    isComplete,
    completedFields,
    totalFields,
    completionPercentage,
    missingRequiredFields,
  };
}

/**
 * Brand Repository Interface
 */
export interface BrandRepository {
  getBrand(
    userId: DbId,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<BrandGetResponseTypeOutput>>;

  updateBrand(
    userId: DbId,
    data: BrandPutRequestTypeOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<BrandPutResponseTypeOutput>>;
}

/**
 * Brand Repository Implementation
 */
class BrandRepositoryImpl implements BrandRepository {
  /**
   * Get brand data for a user
   */
  async getBrand(
    userId: DbId,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<BrandGetResponseTypeOutput>> {
    try {
      const actualUserId = authRepository.requireUserId(user);
      const canAccess = await this.canAccessBrand(actualUserId, userId, logger);

      if (!canAccess) {
        return createErrorResponse(
          "app.api.v1.core.businessData.brand.get.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      const brandData = await db
        .select()
        .from(brand)
        .where(eq(brand.userId, userId))
        .limit(1);

      const result = brandData[0];

      const responseData = {
        brandGuidelines: result?.brandGuidelines || false,
        brandDescription: result?.brandDescription || "",
        brandValues: result?.brandValues || "",
        brandPersonality: convertToBrandPersonality(result?.brandPersonality),
        brandVoice: convertToBrandVoice(result?.brandVoice),
        brandTone: result?.brandTone || "",
        brandColors: result?.brandColors || "",
        brandFonts: result?.brandFonts || "",
        logoDescription: result?.logoDescription || "",
        visualStyle: convertToVisualStyle(result?.visualStyle),
        brandPromise: result?.brandPromise || "",
        brandDifferentiators: result?.brandDifferentiators || "",
        brandMission: result?.brandMission || "",
        brandVision: result?.brandVision || "",
        hasStyleGuide: result?.hasStyleGuide || false,
        hasLogoFiles: result?.hasLogoFiles || false,
        hasBrandAssets: result?.hasBrandAssets || false,
        additionalNotes: result?.additionalNotes || "",
      };

      const completionStatus = calculateBrandCompletionStatus(responseData);

      return createSuccessResponse({
        ...responseData,
        completionStatus,
      });
    } catch (error) {
      logger.error("brand.repository.get.error", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.businessData.brand.get.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Update brand data for a user
   */
  async updateBrand(
    userId: DbId,
    data: BrandPutRequestTypeOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<BrandPutResponseTypeOutput>> {
    try {
      const actualUserId = authRepository.requireUserId(user);
      const canAccess = await this.canAccessBrand(actualUserId, userId, logger);

      if (!canAccess) {
        return createErrorResponse(
          "app.api.v1.core.businessData.brand.put.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      await withTransaction(logger, async (tx) => {
        const existingBrand = await tx
          .select()
          .from(brand)
          .where(eq(brand.userId, userId))
          .limit(1);

        if (existingBrand.length > 0) {
          await tx
            .update(brand)
            .set({
              brandGuidelines: data.brandGuidelines,
              brandDescription: data.brandDescription,
              brandValues: data.brandValues,
              brandPersonality: data.brandPersonality,
              brandVoice: data.brandVoice,
              brandTone: data.brandTone,
              brandColors: data.brandColors,
              brandFonts: data.brandFonts,
              logoDescription: data.logoDescription,
              visualStyle: data.visualStyle,
              brandPromise: data.brandPromise,
              brandDifferentiators: data.brandDifferentiators,
              brandMission: data.brandMission,
              brandVision: data.brandVision,
              hasStyleGuide: data.hasStyleGuide,
              hasLogoFiles: data.hasLogoFiles,
              hasBrandAssets: data.hasBrandAssets,
              additionalNotes: data.additionalNotes,
              updatedAt: new Date(),
            })
            .where(eq(brand.userId, userId));
        } else {
          await tx.insert(brand).values({
            userId,
            brandGuidelines: data.brandGuidelines || false,
            brandDescription: data.brandDescription,
            brandValues: data.brandValues,
            brandPersonality: data.brandPersonality,
            brandVoice: data.brandVoice,
            brandTone: data.brandTone,
            brandColors: data.brandColors,
            brandFonts: data.brandFonts,
            logoDescription: data.logoDescription,
            visualStyle: data.visualStyle,
            brandPromise: data.brandPromise,
            brandDifferentiators: data.brandDifferentiators,
            brandMission: data.brandMission,
            brandVision: data.brandVision,
            hasStyleGuide: data.hasStyleGuide || false,
            hasLogoFiles: data.hasLogoFiles || false,
            hasBrandAssets: data.hasBrandAssets || false,
            additionalNotes: data.additionalNotes,
          });
        }
      });

      const responseData = {
        brandGuidelines: data.brandGuidelines,
        brandDescription: data.brandDescription,
        brandValues: data.brandValues,
        brandPersonality: data.brandPersonality,
        brandVoice: data.brandVoice,
        brandTone: data.brandTone,
        brandColors: data.brandColors,
        brandFonts: data.brandFonts,
        logoDescription: data.logoDescription,
        visualStyle: data.visualStyle,
        brandPromise: data.brandPromise,
        brandDifferentiators: data.brandDifferentiators,
        brandMission: data.brandMission,
        brandVision: data.brandVision,
        hasStyleGuide: data.hasStyleGuide,
        hasLogoFiles: data.hasLogoFiles,
        hasBrandAssets: data.hasBrandAssets,
        additionalNotes: data.additionalNotes,
      };

      const completionStatus = calculateBrandCompletionStatus(responseData);

      return createSuccessResponse({
        message: "app.api.v1.core.businessData.brand.put.success.message",
        ...responseData,
        completionStatus,
      });
    } catch (error) {
      logger.error("brand.repository.update.error", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.businessData.brand.put.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Check if user can access brand data
   */
  private async canAccessBrand(
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

export const brandRepository = new BrandRepositoryImpl();
