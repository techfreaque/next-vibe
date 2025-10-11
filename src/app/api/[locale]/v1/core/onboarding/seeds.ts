/**
 * Onboarding Seeds
 * Provides seed data for user onboarding processes
 */

import { db } from "@/app/api/[locale]/v1/core/system/db";
import { registerSeed } from "@/packages/next-vibe/server/db/seed-manager";

import type { EndpointLogger } from "../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { UserDetailLevel } from "../user/enum";
import { userRepository } from "../user/repository";
import {
  type NewOnboarding,
  type NewOnboardingBusinessData,
  onboarding,
  onboardingBusinessData,
} from "./db";
import { OnboardingStep } from "./enum";

/**
 * Helper function to create onboarding seed data
 */
function createOnboardingSeed(
  overrides?: Partial<NewOnboarding>,
): NewOnboarding {
  return {
    userId: "",
    completedSteps: [],
    currentStep: OnboardingStep.QUESTIONS,
    isCompleted: false,
    ...overrides,
  };
}

/**
 * Helper function to create onboarding business data seed
 */
function createOnboardingBusinessDataSeed(
  overrides?: Partial<NewOnboardingBusinessData>,
): NewOnboardingBusinessData {
  return {
    userId: "",
    businessType: "Technology Consulting",
    targetAudience: "Small to medium businesses",
    socialPlatforms: ["LinkedIn", "Instagram"],
    goals: ["Increase online presence", "Generate more leads"],
    currentChallenges: "Limited time for marketing activities",
    brandGuidelines: false,
    ...overrides,
  };
}

/**
 * Development seed function for onboarding module
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding onboarding data for development environment");

  try {
    // Get existing users for onboarding data
    const demoUserResponse = await userRepository.getUserByEmail(
      "demo@example.com",
      UserDetailLevel.STANDARD,
      logger,
    );

    const user1Response = await userRepository.getUserByEmail(
      "user1@example.com",
      UserDetailLevel.STANDARD,
      logger,
    );

    const user2Response = await userRepository.getUserByEmail(
      "user2@example.com",
      UserDetailLevel.STANDARD,
      logger,
    );

    // Create onboarding records for development users
    const onboardingRecords = [
      {
        onboarding: createOnboardingSeed({
          userId: demoUserResponse.success
            ? demoUserResponse.data?.id || ""
            : "",
          completedSteps: [OnboardingStep.QUESTIONS, OnboardingStep.PRICING],
          currentStep: OnboardingStep.CONSULTATION,
          isCompleted: false,
        }),
        businessData: createOnboardingBusinessDataSeed({
          userId: demoUserResponse.success
            ? demoUserResponse.data?.id || ""
            : "",
          businessType: "Digital Marketing Agency",
          targetAudience:
            "Small business owners who need digital marketing help",
          socialPlatforms: ["LinkedIn", "Instagram", "Facebook", "Twitter"],
          goals: [
            "Scale our agency",
            "Help businesses grow online",
            "Generate qualified leads",
          ],
          currentChallenges:
            "Finding qualified leads and managing client expectations",
          brandGuidelines: true,
        }),
      },
      {
        onboarding: createOnboardingSeed({
          userId: user1Response.success ? user1Response.data?.id || "" : "",
          completedSteps: [OnboardingStep.QUESTIONS],
          currentStep: OnboardingStep.PRICING,
          isCompleted: false,
        }),
        businessData: createOnboardingBusinessDataSeed({
          userId: user1Response.success ? user1Response.data?.id || "" : "",
          businessType: "SaaS Startup",
          targetAudience: "Software developers and tech teams",
          socialPlatforms: ["LinkedIn", "Twitter"],
          goals: [
            "Launch MVP",
            "Acquire first 100 customers",
            "Build brand awareness",
          ],
          currentChallenges: "Building brand awareness in competitive market",
          brandGuidelines: false,
        }),
      },
      {
        onboarding: createOnboardingSeed({
          userId: user2Response.success ? user2Response.data?.id || "" : "",
          completedSteps: [
            OnboardingStep.QUESTIONS,
            OnboardingStep.PRICING,
            OnboardingStep.CONSULTATION,
            OnboardingStep.COMPLETE,
          ],
          currentStep: OnboardingStep.COMPLETE,
          isCompleted: true,
        }),
        businessData: createOnboardingBusinessDataSeed({
          userId: user2Response.success ? user2Response.data?.id || "" : "",
          businessType: "Food & Beverage",
          targetAudience: "Local families and food enthusiasts",
          socialPlatforms: ["Instagram", "Facebook"],
          goals: [
            "Increase local customer base",
            "Boost online ordering",
            "Build community presence",
          ],
          currentChallenges:
            "Competition from delivery apps and marketing budget constraints",
          brandGuidelines: false,
        }),
      },
    ];

    // Create onboarding records
    for (const record of onboardingRecords) {
      if (record.onboarding.userId) {
        try {
          // Insert onboarding record directly into database
          const [onboardingResult] = await db
            .insert(onboarding)
            .values(record.onboarding)
            .returning();

          if (onboardingResult) {
            logger.debug(
              `✅ Created onboarding record for user ${record.onboarding.userId}`,
            );

            // Insert business data record
            const [businessResult] = await db
              .insert(onboardingBusinessData)
              .values(record.businessData)
              .returning();

            if (businessResult) {
              logger.debug(
                `✅ Created business data for user ${record.onboarding.userId}`,
              );
            } else {
              logger.error("Failed to create business data record");
            }
          } else {
            logger.error("Failed to create onboarding record");
          }
        } catch (error) {
          logger.error(
            `Error creating onboarding for user ${record.onboarding.userId}:`,
            error,
          );
        }
      }
    }

    logger.debug("✅ Inserted development onboarding data");
  } catch (error) {
    logger.error("Error seeding onboarding data:", error);
  }
}

/**
 * Test seed function for onboarding module
 */
export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding onboarding data for test environment");

  try {
    // Get test users
    const testUserResponse = await userRepository.getUserByEmail(
      "test1@example.com",
      UserDetailLevel.STANDARD,
      logger,
    );

    if (testUserResponse.success && testUserResponse.data) {
      // Create simple test onboarding record
      const testOnboarding = createOnboardingSeed({
        userId: testUserResponse.data.id,
        completedSteps: [OnboardingStep.QUESTIONS],
        currentStep: OnboardingStep.PRICING,
        isCompleted: false,
      });

      const [result] = await db
        .insert(onboarding)
        .values(testOnboarding)
        .returning();

      if (result) {
        logger.debug("✅ Created test onboarding record");
      } else {
        logger.error("Failed to create test onboarding record");
      }
    }
  } catch (error) {
    logger.error("Error seeding test onboarding data:", error);
  }
}

/**
 * Production seed function for onboarding module
 */
export async function prod(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding onboarding data for production environment");

  try {
    // Production doesn't need pre-seeded onboarding data
    // Onboarding records will be created when users actually go through the process
    await Promise.resolve(); // Add await expression for async function
    logger.debug("✅ Onboarding system ready for production user flows");
  } catch (error) {
    logger.error("Error seeding production onboarding data:", error);
  }
}

// Register seeds with medium priority since onboarding depends on users
registerSeed(
  "onboarding",
  {
    dev,
    test,
    prod,
  },
  40,
);
