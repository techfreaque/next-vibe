/**
 * Challenges Seeds
 * Provides seed data for challenges-related tables
 */

import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import { registerSeed } from "@/packages/next-vibe/server/db/seed-manager";

import type { EndpointLogger } from "../../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { ChallengesPutRequestTypeOutput } from "./definition";
import { challengesRepository } from "./repository";

/**
 * Helper function to create challenges seed data
 */
function createChallengesSeed(
  overrides: Partial<ChallengesPutRequestTypeOutput> & { userId: string },
): ChallengesPutRequestTypeOutput {
  return {
    currentChallenges:
      "Low social media engagement rates, difficulty converting followers to customers, inconsistent content creation, and limited understanding of platform algorithms",
    painPoints:
      "Limited team resources for content creation and community management, difficulty maintaining consistent brand voice across platforms, and challenges in measuring ROI on social media campaigns",
    obstacles:
      "Tight marketing budget constraints, lack of comprehensive analytics and tracking tools, and difficulty integrating social media data with other business metrics",
    marketChallenges:
      "Reaching the right target audience effectively, measuring ROI on social media campaigns, keeping up with constantly changing platform features and best practices",
    resourceConstraints:
      "Small marketing team with limited social media expertise, restricted time for content planning and creation, budget limitations for premium tools and advertising",
    technologyChallenges:
      "Lack of comprehensive analytics and tracking tools, difficulty integrating social media data with other business metrics, limited automation capabilities for routine tasks",
    additionalNotes:
      "Looking for comprehensive solution that can provide both strategic guidance and practical tools to overcome these interconnected challenges while staying within budget constraints",
    ...overrides,
  };
}

/**
 * Development seed function for challenges module
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding challenges data for development environment");

  try {
    // Get the admin user
    const adminUserResponse = await userRepository.getUserByEmail(
      "admin@example.com",
      undefined,
      logger,
    );
    if (!adminUserResponse.success || !adminUserResponse.data) {
      logger.error("❌ Admin user not found, skipping challenges seeding");
      return;
    }

    const adminUser = adminUserResponse.data;

    // Check if challenges data already exists for admin user
    const existingChallengesResponse = await challengesRepository.getChallenges(
      adminUser.id,
      { id: adminUser.id, isPublic: false },
      logger,
    );

    if (
      existingChallengesResponse.success &&
      existingChallengesResponse.data?.currentChallenges
    ) {
      logger.debug(
        "Challenges data already exists for admin user, skipping creation",
      );
      return;
    }

    // Create challenges seed data
    const challengesData = createChallengesSeed({ userId: adminUser.id });

    // Insert challenges data using repository
    const createResponse = await challengesRepository.updateChallenges(
      adminUser.id,
      challengesData,
      { id: adminUser.id, isPublic: false },
      logger,
    );

    if (createResponse.success) {
      logger.debug(`✅ Created challenges data for admin user ${adminUser.id}`);
    } else {
      logger.error(
        `Failed to create challenges data: ${createResponse.message}`,
      );
    }
  } catch (error) {
    logger.error("Error seeding challenges data:", error);
  }
}

/**
 * Test seed function for challenges module
 */
export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding challenges data for test environment");

  try {
    // Get test users
    const testUser1Response = await userRepository.getUserByEmail(
      "test1@example.com",
      undefined,
      logger,
    );
    if (!testUser1Response.success || !testUser1Response.data) {
      logger.error("❌ Test user 1 not found, skipping challenges seeding");
      return;
    }

    const testUser1 = testUser1Response.data;

    // Create test challenges data
    const testChallengesData = createChallengesSeed({
      userId: testUser1.id,
      currentChallenges: "Test challenges for automated testing",
      marketChallenges: "Test marketing challenges",
    });

    // Insert test challenges data
    const createResponse = await challengesRepository.updateChallenges(
      testUser1.id,
      testChallengesData,
      { id: testUser1.id, isPublic: false },
      logger,
    );

    if (createResponse.success) {
      logger.debug(`✅ Created test challenges data for user ${testUser1.id}`);
    } else {
      logger.error(
        `Failed to create test challenges data: ${createResponse.message}`,
      );
    }
  } catch (error) {
    logger.error("Error seeding test challenges data:", error);
  }
}

/**
 * Production seed function for challenges module
 */
export function prod(logger: EndpointLogger): void {
  logger.debug("🌱 Seeding challenges data for production environment");
  // No production seeding for challenges data
  logger.debug("✅ No production challenges seeding required");
}

// Register seeds with the seed manager
// Business data has lower priority (30) - after users (100) but before other modules
registerSeed(
  "challenges",
  {
    dev,
    test,
    prod,
  },
  30,
);
