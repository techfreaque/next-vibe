/**
 * Brand Seeds
 * Provides seed data for brand-related tables
 */

import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import { registerSeed } from "@/packages/next-vibe/server/db/seed-manager";

import type { EndpointLogger } from "../../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { BrandPutRequestTypeOutput } from "./definition";
import { BrandPersonality, BrandVoice, VisualStyle } from "./enum";
import { brandRepository } from "./repository";

/**
 * Helper function to create brand seed data
 */
function createBrandSeed(
  overrides: Partial<BrandPutRequestTypeOutput> & { userId: string },
): BrandPutRequestTypeOutput {
  return {
    brandGuidelines: true,
    brandDescription:
      "A modern, innovative social media marketing platform that empowers businesses to grow their online presence through data-driven strategies and authentic engagement",
    brandValues:
      "Innovation, Authenticity, Growth, Transparency, Customer Success, Data-Driven Excellence",
    brandPersonality: BrandPersonality.PROFESSIONAL,
    brandVoice: BrandVoice.PROFESSIONAL,
    brandTone:
      "Professional but friendly, encouraging, solution-focused, clear and direct",
    brandColors: "#007bff, #28a745, #ffffff, #f8f9fa, #343a40",
    brandFonts: "Inter, Roboto, Open Sans",
    logoDescription:
      "Clean, modern logo featuring a stylized social media icon with growth arrow, using primary blue color",
    visualStyle: VisualStyle.MODERN,
    brandPromise:
      "Delivering measurable social media growth through innovative tools and expert guidance",
    brandDifferentiators:
      "AI-powered analytics, Personalized strategies, Real-time optimization, Expert support, Proven ROI",
    brandMission:
      "To democratize social media marketing success by providing businesses of all sizes with enterprise-level tools and insights",
    brandVision:
      "To become the world's most trusted platform for social media marketing growth and success",
    hasStyleGuide: true,
    hasLogoFiles: true,
    hasBrandAssets: true,
    additionalNotes:
      "Brand emphasizes trust, innovation, and measurable results. Visual identity should convey professionalism while remaining approachable to small business owners",
    ...overrides,
  };
}

/**
 * Development seed function for brand module
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding brand data for development environment");

  try {
    // Get the admin user
    const adminUserResponse = await userRepository.getUserByEmail(
      "admin@example.com",
      undefined,
      logger,
    );
    if (!adminUserResponse.success || !adminUserResponse.data) {
      logger.error("❌ Admin user not found, skipping brand seeding");
      return;
    }

    const adminUser = adminUserResponse.data;

    // Check if brand data already exists for admin user
    const existingBrandResponse = await brandRepository.getBrand(
      adminUser.id,
      { id: adminUser.id, isPublic: false },
      logger,
    );

    if (
      existingBrandResponse.success &&
      existingBrandResponse.data?.brandDescription
    ) {
      logger.debug(
        "Brand data already exists for admin user, skipping creation",
      );
      return;
    }

    // Create brand seed data
    const brandData = createBrandSeed({ userId: adminUser.id });

    // Insert brand data using repository
    const createResponse = await brandRepository.updateBrand(
      adminUser.id,
      brandData,
      { id: adminUser.id, isPublic: false },
      logger,
    );

    if (createResponse.success) {
      logger.debug(`✅ Created brand data for admin user ${adminUser.id}`);
    } else {
      logger.error(`Failed to create brand data: ${createResponse.message}`);
    }
  } catch (error) {
    logger.error("Error seeding brand data:", error);
  }
}

/**
 * Test seed function for brand module
 */
export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding brand data for test environment");

  try {
    // Get test users
    const testUser1Response = await userRepository.getUserByEmail(
      "test1@example.com",
      undefined,
      logger,
    );
    if (!testUser1Response.success || !testUser1Response.data) {
      logger.error("❌ Test user 1 not found, skipping brand seeding");
      return;
    }

    const testUser1 = testUser1Response.data;

    // Create test brand data
    const testBrandData = createBrandSeed({
      userId: testUser1.id,
      brandDescription: "Test brand for automated testing purposes",
      brandValues: "Testing, Quality, Reliability",
      brandPersonality: BrandPersonality.RELIABLE,
    });

    // Insert test brand data
    const createResponse = await brandRepository.updateBrand(
      testUser1.id,
      testBrandData,
      { id: testUser1.id, isPublic: false },
      logger,
    );

    if (createResponse.success) {
      logger.debug(`✅ Created test brand data for user ${testUser1.id}`);
    } else {
      logger.error(
        `Failed to create test brand data: ${createResponse.message}`,
      );
    }
  } catch (error) {
    logger.error("Error seeding test brand data:", error);
  }
}

/**
 * Production seed function for brand module
 */
export function prod(logger: EndpointLogger): void {
  logger.debug("🌱 Seeding brand data for production environment");
  // No production seeding for brand data
  logger.debug("✅ No production brand seeding required");
}

// Register seeds with the seed manager
// Business data has lower priority (30) - after users (100) but before other modules
registerSeed(
  "brand",
  {
    dev,
    test,
    prod,
  },
  30,
);
