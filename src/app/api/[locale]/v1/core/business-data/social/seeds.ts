/**
 * Social Seeds
 * Provides seed data for social-related tables
 */

import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import { registerSeed } from "@/packages/next-vibe/server/db/seed-manager";

import type { EndpointLogger } from "../../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { UserDetailLevel } from "../../user/enum";
import type { SocialPutRequestTypeOutput } from "./definition";
import { PlatformPriority, SocialPlatform } from "./enum";
import { socialPlatformRepository } from "./repository";

/**
 * Helper function to create social seed data
 */
function createSocialSeed(
  overrides: Partial<SocialPutRequestTypeOutput> & { userId: string },
): SocialPutRequestTypeOutput {
  return {
    platforms: [
      {
        platform: SocialPlatform.INSTAGRAM,
        username: "socialmediagrowth",
        isActive: true,
        priority: PlatformPriority.HIGH,
      },
      {
        platform: SocialPlatform.LINKEDIN,
        username: "social-media-growth-solutions",
        isActive: true,
        priority: PlatformPriority.HIGH,
      },
      {
        platform: SocialPlatform.TWITTER,
        username: "smgrowthsol",
        isActive: true,
        priority: PlatformPriority.MEDIUM,
      },
      {
        platform: SocialPlatform.FACEBOOK,
        username: "socialmediagrowthsolutions",
        isActive: true,
        priority: PlatformPriority.MEDIUM,
      },
      {
        platform: SocialPlatform.YOUTUBE,
        username: "socialmediagrowthchannel",
        isActive: true,
        priority: PlatformPriority.LOW,
      },
      {
        platform: SocialPlatform.TIKTOK,
        username: "smgrowthsolutions",
        isActive: true,
        priority: PlatformPriority.HIGH,
      },
    ],
    ...overrides,
  };
}

/**
 * Development seed function for social module
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding social data for development environment");

  try {
    // Get the admin user
    const adminUserResponse = await userRepository.getUserByEmail(
      "admin@example.com",
      UserDetailLevel.STANDARD,
      logger,
    );
    if (!adminUserResponse.success || !adminUserResponse.data) {
      logger.error("❌ Admin user not found, skipping social seeding");
      return;
    }

    const adminUser = adminUserResponse.data;

    // Check if social data already exists for admin user
    const existingSocialResponse =
      await socialPlatformRepository.getSocialPlatforms(
        adminUser.id,
        {
          id: adminUser.id,
          isPublic: false,
        },
        logger,
      );

    if (existingSocialResponse.success && existingSocialResponse.data) {
      const { platforms } = existingSocialResponse.data;
      if (platforms && Array.isArray(platforms) && platforms.length > 0) {
        logger.debug(
          "Social data already exists for admin user, skipping creation",
        );
        return;
      }
    }

    // Create social seed data
    const socialData = createSocialSeed({ userId: adminUser.id });

    // Insert social data using repository
    const createResponse = await socialPlatformRepository.updateSocialPlatforms(
      adminUser.id,
      {
        platforms: socialData.platforms,
        contentStrategy: socialData.contentStrategy,
        postingFrequency: socialData.postingFrequency,
        goals: socialData.goals,
      },
      { id: adminUser.id, isPublic: false },
      logger,
    );

    if (createResponse.success) {
      logger.debug(`✅ Created social data for admin user ${adminUser.id}`);
    } else {
      logger.error(`Failed to create social data: ${createResponse.message}`);
    }
  } catch (error) {
    logger.error("Error seeding social data:", error);
  }
}

/**
 * Test seed function for social module
 */
export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding social data for test environment");

  try {
    // Get test users
    const testUser1Response = await userRepository.getUserByEmail(
      "test1@example.com",
      UserDetailLevel.STANDARD,
      logger,
    );
    if (!testUser1Response.success || !testUser1Response.data) {
      logger.error("❌ Test user 1 not found, skipping social seeding");
      return;
    }

    const testUser1 = testUser1Response.data;

    // Create test social data
    const testSocialData = createSocialSeed({
      userId: testUser1.id,
      platforms: [
        {
          platform: SocialPlatform.INSTAGRAM,
          username: "testcompany",
          isActive: true,
          priority: PlatformPriority.HIGH,
        },
        {
          platform: SocialPlatform.TWITTER,
          username: "testcompany",
          isActive: true,
          priority: PlatformPriority.MEDIUM,
        },
      ],
    });

    // Insert test social data
    const createResponse = await socialPlatformRepository.updateSocialPlatforms(
      testUser1.id,
      {
        platforms: testSocialData.platforms,
        contentStrategy: testSocialData.contentStrategy,
        postingFrequency: testSocialData.postingFrequency,
        goals: testSocialData.goals,
      },
      { id: testUser1.id, isPublic: false },
      logger,
    );

    if (createResponse.success) {
      logger.debug(`✅ Created test social data for user ${testUser1.id}`);
    } else {
      logger.error(
        `Failed to create test social data: ${createResponse.message}`,
      );
    }
  } catch (error) {
    logger.error("Error seeding test social data:", error);
  }
}

/**
 * Production seed function for social module
 */
export function prod(logger: EndpointLogger): void {
  logger.debug("🌱 Seeding social data for production environment");
  // No production seeding for social data
  logger.debug("✅ No production social seeding required");
}

// Register seeds with the seed manager
// Business data has lower priority (30) - after users (100) but before other modules
registerSeed(
  "social",
  {
    dev,
    test,
    prod,
  },
  30,
);
