/**
 * Competitors Seeds
 * Provides seed data for competitors-related tables
 */

import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import { registerSeed } from "@/packages/next-vibe/server/db/seed-manager";

import type { EndpointLogger } from "../../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { CompetitorsPutRequestTypeOutput } from "./definition";
import { competitorsRepository } from "./repository";

/**
 * Helper function to create competitors seed data
 */
function createCompetitorsSeed(
  overrides: Partial<CompetitorsPutRequestTypeOutput> & { userId: string },
): CompetitorsPutRequestTypeOutput {
  return {
    competitors:
      "Hootsuite, Buffer, Sprout Social, Later, SocialBee - these platforms offer similar social media management and scheduling capabilities with analytics features",
    mainCompetitors:
      "Hootsuite, Buffer, Sprout Social - the three main direct competitors with largest market share",
    competitorStrengths:
      "Established brand recognition, large user bases, comprehensive feature sets, strong integrations with major platforms, extensive educational resources and customer support",
    competitorWeaknesses:
      "High pricing for small businesses, complex interfaces for beginners, limited AI-powered insights, generic strategies not tailored to specific industries, poor customer onboarding experience",
    marketPosition:
      "Mid-market solution focusing on AI-driven insights and personalized strategies, positioned between basic scheduling tools and enterprise-level platforms",
    competitiveAdvantages:
      "AI-powered content optimization, industry-specific templates, personalized growth strategies, affordable pricing for small businesses, superior onboarding and customer success",
    competitiveDisadvantages:
      "Smaller brand recognition compared to established players, limited integrations compared to enterprise solutions, newer platform with less proven track record",
    differentiators:
      "Focus on AI-driven personalization, industry-specific expertise, exceptional customer success, and measurable ROI tracking with clear action items",
    marketGaps:
      "Lack of affordable AI-powered solutions for small businesses, limited industry-specific guidance, poor integration between analytics and actionable recommendations",
    additionalNotes:
      "Competitive landscape is evolving rapidly with AI integration becoming table stakes. Our focus on personalization and measurable outcomes provides strong differentiation opportunity",
    ...overrides,
  };
}

/**
 * Development seed function for competitors module
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding competitors data for development environment");

  try {
    // Get the admin user
    const adminUserResponse = await userRepository.getUserByEmail(
      "admin@example.com",
      undefined,
      logger,
    );
    if (!adminUserResponse.success || !adminUserResponse.data) {
      logger.error("❌ Admin user not found, skipping competitors seeding");
      return;
    }

    const adminUser = adminUserResponse.data;

    // Check if competitors data already exists for admin user
    const existingCompetitorsResponse =
      await competitorsRepository.getCompetitors(
        adminUser.id,
        {
          id: adminUser.id,
          isPublic: false,
        },
        logger,
      );

    if (
      existingCompetitorsResponse.success &&
      existingCompetitorsResponse.data &&
      "competitors" in existingCompetitorsResponse.data &&
      existingCompetitorsResponse.data.competitors
    ) {
      logger.debug(
        "Competitors data already exists for admin user, skipping creation",
      );
      return;
    }

    // Create competitors seed data
    const competitorsData = createCompetitorsSeed({ userId: adminUser.id });

    // Insert competitors data using repository
    const createResponse = await competitorsRepository.updateCompetitors(
      adminUser.id,
      competitorsData,
      { id: adminUser.id, isPublic: false },
      logger,
    );

    if (createResponse.success) {
      logger.debug(
        `✅ Created competitors data for admin user ${adminUser.id}`,
      );
    } else {
      logger.error(
        `Failed to create competitors data: ${createResponse.message}`,
      );
    }
  } catch (error) {
    logger.error("Error seeding competitors data:", error);
  }
}

/**
 * Test seed function for competitors module
 */
export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding competitors data for test environment");

  try {
    // Get test users
    const testUser1Response = await userRepository.getUserByEmail(
      "test1@example.com",
      undefined,
      logger,
    );
    if (!testUser1Response.success || !testUser1Response.data) {
      logger.error("❌ Test user 1 not found, skipping competitors seeding");
      return;
    }

    const testUser1 = testUser1Response.data;

    // Create test competitors data
    const testCompetitorsData = createCompetitorsSeed({
      userId: testUser1.id,
      competitors: "Test Competitor A, Test Competitor B",
      mainCompetitors: "Test Competitor A",
      marketPosition: "Test market position for automated testing",
    });

    // Insert test competitors data
    const createResponse = await competitorsRepository.updateCompetitors(
      testUser1.id,
      testCompetitorsData,
      { id: testUser1.id, isPublic: false },
      logger,
    );

    if (createResponse.success) {
      logger.debug(`✅ Created test competitors data for user ${testUser1.id}`);
    } else {
      logger.error(
        `Failed to create test competitors data: ${createResponse.message}`,
      );
    }
  } catch (error) {
    logger.error("Error seeding test competitors data:", error);
  }
}

/**
 * Production seed function for competitors module
 */
export function prod(logger: EndpointLogger): void {
  logger.debug("🌱 Seeding competitors data for production environment");
  // No production seeding for competitors data
  logger.debug("✅ No production competitors seeding required");
}

// Register seeds with the seed manager
// Business data has lower priority (30) - after users (100) but before other modules
registerSeed(
  "competitors",
  {
    dev,
    test,
    prod,
  },
  30,
);
