/**
 * Business Info Seeds
 * Provides seed data for business-info-related tables
 */

import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import { registerSeed } from "@/packages/next-vibe/server/db/seed-manager";

import type { EndpointLogger } from "../../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { UserDetailLevel } from "../../user/enum";
import type { BusinessInfoPostRequestTypeOutput as UpdateBusinessInfoData } from "./definition";
import { BusinessSize, BusinessType, Industry } from "./enum";
import { businessInfoRepository } from "./repository";

/**
 * Helper function to create business info seed data
 */
function createBusinessInfoSeed(
  overrides: Partial<UpdateBusinessInfoData> & { userId: string },
): UpdateBusinessInfoData {
  return {
    businessType: BusinessType.SaaS,
    businessName: "Social Media Growth Solutions",
    industry: Industry.TECHNOLOGY,
    businessSize: BusinessSize.MEDIUM,
    website: "https://socialmediagrowth.com",
    location: "San Francisco, United States",
    foundedYear: 2020,
    description:
      "A comprehensive social media marketing platform that helps businesses grow their online presence through AI-powered analytics, content optimization, and strategic guidance. We specialize in turning social media followers into loyal customers.",
    ...overrides,
  };
}

/**
 * Development seed function for business info module
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding business info data for development environment");

  try {
    // Get the admin user
    const adminUserResponse = await userRepository.getUserByEmail(
      "admin@example.com",
      UserDetailLevel.STANDARD,
      logger,
    );
    if (!adminUserResponse.success || !adminUserResponse.data) {
      logger.error("❌ Admin user not found, skipping business info seeding");
      return;
    }

    const adminUser = adminUserResponse.data;

    // Check if business info data already exists for admin user
    const existingBusinessInfoResponse =
      await businessInfoRepository.getBusinessInfo(
        adminUser.id,
        {
          id: adminUser.id,
          isPublic: false,
        },
        "en-GLOBAL", // Default locale for seeds
        logger,
      );

    if (
      existingBusinessInfoResponse.success &&
      existingBusinessInfoResponse.data?.businessType
    ) {
      logger.debug(
        "Business info data already exists for admin user, skipping creation",
      );
      return;
    }

    // Create business info seed data
    const businessInfoData = createBusinessInfoSeed({ userId: adminUser.id });

    // Insert business info data using repository
    const createResponse = await businessInfoRepository.updateBusinessInfo(
      adminUser.id,
      businessInfoData,
      { id: adminUser.id, isPublic: false },
      "en-GLOBAL", // Default locale for seeds
      logger,
    );

    if (createResponse.success) {
      logger.debug(
        `✅ Created business info data for admin user ${adminUser.id}`,
      );
    } else {
      logger.error(
        `Failed to create business info data: ${createResponse.message}`,
      );
    }
  } catch (error) {
    logger.error("Error seeding business info data:", error);
  }
}

/**
 * Test seed function for business info module
 */
export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding business info data for test environment");

  try {
    // Get test users
    const testUser1Response = await userRepository.getUserByEmail(
      "test1@example.com",
      UserDetailLevel.STANDARD,
      logger,
    );
    if (!testUser1Response.success || !testUser1Response.data) {
      logger.error("❌ Test user 1 not found, skipping business info seeding");
      return;
    }

    const testUser1 = testUser1Response.data;

    // Create test business info data
    const testBusinessInfoData = createBusinessInfoSeed({
      userId: testUser1.id,
      businessType: BusinessType.OTHER,
      businessName: "Test Company Inc",
      industry: Industry.CONSULTING,
      businessSize: BusinessSize.SMALL,
      description: "A test business for automated testing purposes",
    });

    // Insert test business info data
    const createResponse = await businessInfoRepository.updateBusinessInfo(
      testUser1.id,
      testBusinessInfoData,
      { id: testUser1.id, isPublic: false },
      "en-GLOBAL", // Default locale for seeds
      logger,
    );

    if (createResponse.success) {
      logger.debug(
        `✅ Created test business info data for user ${testUser1.id}`,
      );
    } else {
      logger.error(
        `Failed to create test business info data: ${createResponse.message}`,
      );
    }
  } catch (error) {
    logger.error("Error seeding test business info data:", error);
  }
}

/**
 * Production seed function for business info module
 */
export function prod(logger: EndpointLogger): void {
  logger.debug("🌱 Seeding business info data for production environment");
  // No production seeding for business info data
  logger.debug("✅ No production business info seeding required");
}

// Register seeds with the seed manager
// Business data has lower priority (30) - after users (100) but before other modules
registerSeed(
  "business-info",
  {
    dev,
    test,
    prod,
  },
  30,
);
