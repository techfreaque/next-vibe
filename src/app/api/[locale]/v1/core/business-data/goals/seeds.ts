/**
 * Goals Seeds
 * Provides seed data for goals-related tables
 */

import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import { registerSeed } from "@/packages/next-vibe/server/db/seed-manager";

import type { EndpointLogger } from "../../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { GoalsPutRequestTypeOutput } from "./definition";
import { BusinessGoal } from "./enum";
import { goalsRepository } from "./repository";

/**
 * Helper function to create goals seed data
 */
function createGoalsSeed(
  overrides: Partial<GoalsPutRequestTypeOutput> & { userId: string },
): GoalsPutRequestTypeOutput {
  return {
    primaryBusinessGoal: BusinessGoal.INCREASE_REVENUE,
    shortTermGoals:
      "Grow social media following by 300%, increase engagement rate to 8%+, generate 500 qualified leads per month, achieve 15% conversion rate from social to trial",
    longTermGoals:
      "Achieve 50% increase in monthly recurring revenue, expand customer base by 200%, establish market presence in 3 new geographic regions, launch 2 new product features",
    revenueGoals:
      "Reach $2M ARR within 18 months, achieve $50K MRR by end of year, maintain 90%+ customer retention rate, increase average customer lifetime value by 40%",
    growthGoals:
      "User acquisition cost under $100, monthly active users growth of 25%, feature adoption rate above 70%, customer satisfaction score of 9.0+",
    successMetrics:
      "Revenue growth, customer acquisition rate, engagement metrics, brand awareness surveys, market share analysis, customer satisfaction scores",
    additionalNotes:
      "Focus on sustainable growth with strong unit economics, prioritize customer success and retention over rapid acquisition, maintain high-quality service standards. Premium yet affordable AI-powered social media growth platform that delivers measurable results for businesses of all sizes.",
    ...overrides,
  };
}

/**
 * Development seed function for goals module
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding goals data for development environment");

  try {
    // Get the admin user
    const adminUserResponse = await userRepository.getUserByEmail(
      "admin@example.com",
      undefined,
      logger,
    );
    if (!adminUserResponse.success || !adminUserResponse.data) {
      logger.error("❌ Admin user not found, skipping goals seeding");
      return;
    }

    const adminUser = adminUserResponse.data;

    // Check if goals data already exists for admin user
    const existingGoalsResponse = await goalsRepository.getGoals(
      adminUser.id,
      {
        id: adminUser.id,
        isPublic: false,
      },
      logger,
    );

    if (
      existingGoalsResponse.success &&
      existingGoalsResponse.data?.primaryBusinessGoal
    ) {
      logger.debug(
        "Goals data already exists for admin user, skipping creation",
      );
      return;
    }

    // Create goals seed data
    const goalsData = createGoalsSeed({ userId: adminUser.id });

    // Insert goals data using repository
    const createResponse = await goalsRepository.updateGoals(
      adminUser.id,
      goalsData,
      { id: adminUser.id, isPublic: false },
      logger,
    );

    if (createResponse.success) {
      logger.debug(`✅ Created goals data for admin user ${adminUser.id}`);
    } else {
      logger.error(`Failed to create goals data: ${createResponse.message}`);
    }
  } catch (error) {
    logger.error("Error seeding goals data:", error);
  }
}

/**
 * Test seed function for goals module
 */
export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding goals data for test environment");

  try {
    // Get test users
    const testUser1Response = await userRepository.getUserByEmail(
      "test1@example.com",
      undefined,
      logger,
    );
    if (!testUser1Response.success || !testUser1Response.data) {
      logger.error("❌ Test user 1 not found, skipping goals seeding");
      return;
    }

    const testUser1 = testUser1Response.data;

    // Create test goals data
    const testGoalsData = createGoalsSeed({
      userId: testUser1.id,
      primaryBusinessGoal: BusinessGoal.GROW_CUSTOMER_BASE,
      growthGoals: "Test growth metrics",
    });

    // Insert test goals data
    const createResponse = await goalsRepository.updateGoals(
      testUser1.id,
      testGoalsData,
      { id: testUser1.id, isPublic: false },
      logger,
    );

    if (createResponse.success) {
      logger.debug(`✅ Created test goals data for user ${testUser1.id}`);
    } else {
      logger.error(
        `Failed to create test goals data: ${createResponse.message}`,
      );
    }
  } catch (error) {
    logger.error("Error seeding test goals data:", error);
  }
}

/**
 * Production seed function for goals module
 */
export function prod(logger: EndpointLogger): void {
  logger.debug("🌱 Seeding goals data for production environment");
  // No production seeding for goals data
  logger.debug("✅ No production goals seeding required");
}

// Register seeds with the seed manager
// Business data has lower priority (30) - after users (100) but before other modules
registerSeed(
  "goals",
  {
    dev,
    test,
    prod,
  },
  30,
);
