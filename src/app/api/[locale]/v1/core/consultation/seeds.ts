/**
 * Consultation Seeds
 * Provides seed data for consultation-related tables
 */

import { UserDetailLevel } from "@/app/api/[locale]/v1/core/user/enum";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import { registerSeed } from "@/packages/next-vibe/server/db/seed-manager";

import type { EndpointLogger } from "../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { NewConsultation } from "./db";
import { ConsultationStatus } from "./enum";
// Note: Repository methods will be implemented as needed

/**
 * Helper function to create consultation seed data
 */
function createConsultationSeed(
  overrides: Partial<NewConsultation> & { userId: string },
): NewConsultation {
  const now = new Date();
  const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

  return {
    preferredDate: futureDate,
    preferredTime: "14:00",
    message:
      "I would like to discuss improving my social media strategy and increasing engagement with my target audience.",
    status: ConsultationStatus.PENDING,
    isNotified: false,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Development seed function for consultation module
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding consultation data for development environment");

  try {
    // Get the admin user
    const adminUserResponse = await userRepository.getUserByEmail(
      "admin@example.com",
      UserDetailLevel.STANDARD,
      logger,
    );
    if (!adminUserResponse.success || !adminUserResponse.data) {
      logger.error("❌ Admin user not found, skipping consultation seeding");
      return;
    }

    const adminUser = adminUserResponse.data;

    // Create consultation seed data
    const consultationData = createConsultationSeed({ userId: adminUser.id });

    // TODO: Add actual consultation repository methods to save the data
    // For now, just log that we would create the data
    logger.debug(
      `✅ Would create consultation data for admin user ${adminUser.id}`,
      {
        consultationData,
      },
    );
  } catch (error) {
    logger.error("Error seeding consultation data:", error);
  }
}

/**
 * Test seed function for consultation module
 */
export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding consultation data for test environment");

  try {
    // Get test users
    const testUser1Response = await userRepository.getUserByEmail(
      "test1@example.com",
      UserDetailLevel.STANDARD,
      logger,
    );
    if (!testUser1Response.success || !testUser1Response.data) {
      logger.error("❌ Test user 1 not found, skipping consultation seeding");
      return;
    }

    const testUser1 = testUser1Response.data;

    // Create test consultation data
    const testConsultationData = createConsultationSeed({
      userId: testUser1.id,
      message: "Test consultation for automated testing",
      status: ConsultationStatus.PENDING,
    });

    // TODO: Add actual consultation repository methods to save the data
    // For now, just log that we would create the data
    logger.debug(
      `✅ Would create test consultation data for user ${testUser1.id}`,
      {
        testConsultationData,
      },
    );
  } catch (error) {
    logger.error("Error seeding test consultation data:", error);
  }
}

/**
 * Production seed function for consultation module
 */
export function prod(logger: EndpointLogger): void {
  logger.debug("🌱 Seeding consultation data for production environment");
  // No production seeding for consultation data
  logger.debug("✅ No production consultation seeding required");
}

// Register seeds with the seed manager
// Consultation has lower priority (20) - after users (100) and leads (50) but before business data (30)
registerSeed(
  "consultation",
  {
    dev,
    test,
    prod,
  },
  20,
);
