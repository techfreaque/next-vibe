/**
 * Audience Seeds
 * Provides seed data for audience-related tables
 */

import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import { registerSeed } from "@/packages/next-vibe/server/db/seed-manager";

import type { EndpointLogger } from "../../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { AudiencePutRequestOutput } from "./definition";
import { AgeRange, CommunicationChannel, Gender, IncomeLevel } from "./enum";
import { audienceRepository } from "./repository";

/**
 * Helper function to create audience seed data
 */
function createAudienceSeed(
  overrides: Partial<AudiencePutRequestOutput>,
): AudiencePutRequestOutput {
  return {
    targetAudience:
      "Small to medium business owners and entrepreneurs aged 25-45 who are looking to improve their social media presence and digital marketing strategies",
    ageRange: [AgeRange.MILLENNIALS],
    gender: [Gender.ALL],
    location: "United States, Canada, United Kingdom",
    income: [IncomeLevel.UPPER_MIDDLE],
    interests:
      "Business growth, digital marketing, social media, entrepreneurship, technology, productivity tools",
    coreValues:
      "Innovation, efficiency, growth, authenticity, customer service excellence",
    lifestyle:
      "Busy professionals, tech-savvy, always learning, networking-focused",
    onlineBehavior:
      "Active on LinkedIn and Instagram, reads business blogs, watches educational YouTube videos, participates in online communities",
    purchaseBehavior:
      "Research-driven, values ROI, prefers subscription models, influenced by peer recommendations",
    preferredChannels: [CommunicationChannel.EMAIL],
    painPoints:
      "Limited time for marketing, difficulty measuring ROI, keeping up with platform changes, creating consistent content",
    motivations:
      "Growing their business, increasing brand awareness, generating more leads, staying competitive",
    additionalNotes:
      "Highly motivated to invest in tools and services that can demonstrate clear business value and time savings",
    ...overrides,
  } as unknown as AudiencePutRequestOutput;
}

/**
 * Development seed function for audience module
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding audience data for development environment");

  try {
    // Get the admin user
    const adminUserResponse = await userRepository.getUserByEmail(
      "admin@example.com",
      undefined,
      logger,
    );
    if (!adminUserResponse.success || !adminUserResponse.data) {
      logger.error("❌ Admin user not found, skipping audience seeding");
      return;
    }

    const adminUser = adminUserResponse.data;

    // Check if audience data already exists for admin user
    const existingAudienceResponse = await audienceRepository.getAudience(
      adminUser.id,
      { id: adminUser.id, isPublic: false },
      logger,
    );

    if (
      existingAudienceResponse.success &&
      existingAudienceResponse.data?.targetAudience
    ) {
      logger.debug(
        "Audience data already exists for admin user, skipping creation",
      );
      return;
    }

    // Create audience seed data
    const audienceData = createAudienceSeed({});

    // Insert audience data using repository
    const createResponse = await audienceRepository.updateAudience(
      adminUser.id,
      audienceData,
      { id: adminUser.id, isPublic: false },
      logger,
    );

    if (createResponse.success) {
      logger.debug(`✅ Created audience data for admin user ${adminUser.id}`);
    } else {
      logger.error(
        `Failed to create audience data: ${JSON.stringify(createResponse)}`,
      );
    }
  } catch (error) {
    logger.error("Error seeding audience data:", error);
  }
}

/**
 * Test seed function for audience module
 */
export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding audience data for test environment");

  try {
    // Get test users
    const testUser1Response = await userRepository.getUserByEmail(
      "test1@example.com",
      undefined,
      logger,
    );
    if (!testUser1Response.success || !testUser1Response.data) {
      logger.error("❌ Test user 1 not found, skipping audience seeding");
      return;
    }

    const testUser1 = testUser1Response.data;

    // Create test audience data
    const testAudienceData = createAudienceSeed({
      targetAudience: "Test audience for automated testing",
      ageRange: [AgeRange.ALL_AGES],
      location: "Global",
    } as unknown as Partial<AudiencePutRequestOutput>);

    // Insert test audience data
    const createResponse = await audienceRepository.updateAudience(
      testUser1.id,
      testAudienceData,
      { id: testUser1.id, isPublic: false },
      logger,
    );

    if (createResponse.success) {
      logger.debug(`✅ Created test audience data for user ${testUser1.id}`);
    } else {
      logger.error(
        `Failed to create test audience data: ${JSON.stringify(createResponse)}`,
      );
    }
  } catch (error) {
    logger.error("Error seeding test audience data:", error);
  }
}

/**
 * Production seed function for audience module
 */
export function prod(logger: EndpointLogger): void {
  logger.debug("🌱 Seeding audience data for production environment");
  // No production seeding for audience data
  logger.debug("✅ No production audience seeding required");
}

// Register seeds with the seed manager
// Business data has lower priority (30) - after users (100) but before other modules
registerSeed(
  "audience",
  {
    dev,
    test,
    prod,
  },
  30,
);
