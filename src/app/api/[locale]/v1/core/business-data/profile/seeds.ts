/**
 * Profile Seeds
 * Provides seed data for profile-related functionality
 */

import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import { registerSeed } from "@/packages/next-vibe/server/db/seed-manager";

import type { EndpointLogger } from "../../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { ProfilePutRequestTypeOutput } from "./definition";
import { profileRepository } from "./repository";

/**
 * Helper function to create profile seed data
 */
function createProfileSeed(
  overrides: Partial<ProfilePutRequestTypeOutput>,
): ProfilePutRequestTypeOutput {
  return {
    fullName: "John Smith",
    jobTitle: "CEO & Founder",
    bio: "Experienced entrepreneur with 15+ years in the tech industry, passionate about building innovative solutions that make a real difference.",
    expertise:
      "Product strategy, team leadership, business development, digital marketing, SaaS scaling",
    professionalBackground:
      "Former VP of Product at TechCorp, MBA from Stanford Business School, led multiple successful product launches",
    additionalNotes:
      "Passionate about sustainable business practices, mentoring young entrepreneurs, and staying current with emerging technologies",
    ...overrides,
  } as unknown as ProfilePutRequestTypeOutput;
}

/**
 * Development seed function for profile module
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding profile data for development environment");

  try {
    // Get the admin user
    const adminUserResponse = await userRepository.getUserByEmail(
      "admin@example.com",
      undefined,
      logger,
    );
    if (!adminUserResponse.success || !adminUserResponse.data) {
      logger.error("❌ Admin user not found, skipping profile seeding");
      return;
    }

    const adminUser = adminUserResponse.data;

    // Check if profile data already exists for admin user
    const existingProfileResponse = await profileRepository.getProfile(
      adminUser.id,
      { id: adminUser.id, isPublic: false },
      logger,
    );

    if (
      existingProfileResponse.success &&
      existingProfileResponse.data?.fullName
    ) {
      logger.debug(
        "Profile data already exists for admin user, skipping creation",
      );
      return;
    }

    // Create profile seed data
    const profileData = createProfileSeed({
      fullName: `${adminUser.firstName} ${adminUser.lastName}`,
      jobTitle: "Administrator",
      bio: "Platform administrator with expertise in system management and user experience optimization.",
      expertise:
        "System administration, user management, platform optimization, business process improvement",
      professionalBackground:
        "Senior administrator with experience managing complex platforms and user communities",
      additionalNotes:
        "Focused on creating seamless user experiences and maintaining platform reliability",
    });

    // Update profile data using repository
    const updateResponse = await profileRepository.updateProfile(
      adminUser.id,
      profileData,
      { id: adminUser.id, isPublic: false },
      logger,
    );

    if (updateResponse.success) {
      logger.debug(`✅ Created profile data for admin user ${adminUser.id}`);
    } else {
      logger.error(
        `Failed to create profile data: ${JSON.stringify(updateResponse)}`,
      );
    }

    // Also create profile for demo user if exists
    const demoUserResponse = await userRepository.getUserByEmail(
      "demo@example.com",
      undefined,
      logger,
    );
    if (demoUserResponse.success && demoUserResponse.data) {
      const demoUser = demoUserResponse.data;

      const demoProfileData = createProfileSeed({
        fullName: `${demoUser.firstName} ${demoUser.lastName}`,
        jobTitle: "Marketing Director",
        bio: "Creative marketing professional with a passion for digital storytelling and brand building.",
        expertise:
          "Digital marketing, content strategy, social media management, brand development",
        professionalBackground:
          "10+ years in marketing, formerly at leading agencies, specialized in B2B SaaS marketing",
        additionalNotes:
          "Always exploring new marketing channels and creative approaches to reach target audiences",
      });

      const demoUpdateResponse = await profileRepository.updateProfile(
        demoUser.id,
        demoProfileData,
        { id: demoUser.id, isPublic: false },
        logger,
      );

      if (demoUpdateResponse.success) {
        logger.debug(`✅ Created profile data for demo user ${demoUser.id}`);
      } else {
        logger.error(
          `Failed to create demo profile data: ${JSON.stringify(demoUpdateResponse)}`,
        );
      }
    }
  } catch (error) {
    logger.error("Error seeding profile data:", error);
  }
}

/**
 * Test seed function for profile module
 */
export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding profile data for test environment");

  try {
    // Get test users
    const testUser1Response = await userRepository.getUserByEmail(
      "test1@example.com",
      undefined,
      logger,
    );
    if (!testUser1Response.success || !testUser1Response.data) {
      logger.error("❌ Test user 1 not found, skipping profile seeding");
      return;
    }

    const testUser1 = testUser1Response.data;

    // Create test profile data
    const testProfileData = createProfileSeed({
      fullName: `${testUser1.firstName} ${testUser1.lastName}`,
      jobTitle: "Test Manager",
      bio: "Test profile for automated testing scenarios",
      expertise: "Quality assurance, test automation, system validation",
      professionalBackground:
        "Experienced in test environment management and quality processes",
      additionalNotes:
        "Dedicated to ensuring system reliability through comprehensive testing",
    });

    // Update test profile data
    const updateResponse = await profileRepository.updateProfile(
      testUser1.id,
      testProfileData,
      { id: testUser1.id, isPublic: false },
      logger,
    );

    if (updateResponse.success) {
      logger.debug(`✅ Created test profile data for user ${testUser1.id}`);
    } else {
      logger.error(
        `Failed to create test profile data: ${JSON.stringify(updateResponse)}`,
      );
    }
  } catch (error) {
    logger.error("Error seeding test profile data:", error);
  }
}

/**
 * Production seed function for profile module
 */
export async function prod(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding profile data for production environment");

  try {
    // Get production admin user
    const adminUserResponse = await userRepository.getUserByEmail(
      "hi@socialmediaservice.center",
      undefined,
      logger,
    );
    if (!adminUserResponse.success || !adminUserResponse.data) {
      logger.error(
        "❌ Production admin user not found, skipping profile seeding",
      );
      return;
    }

    const adminUser = adminUserResponse.data;

    // Check if profile already exists
    const existingProfileResponse = await profileRepository.getProfile(
      adminUser.id,
      { id: adminUser.id, isPublic: false },
      logger,
    );

    if (
      existingProfileResponse.success &&
      existingProfileResponse.data?.fullName
    ) {
      logger.debug(
        "Production admin profile already exists, skipping creation",
      );
      return;
    }

    // Create minimal production profile
    const productionProfileData = createProfileSeed({
      fullName: `${adminUser.firstName} ${adminUser.lastName}`,
      jobTitle: "Platform Administrator",
      bio: "Social Media Service platform administrator",
      expertise: "Platform management, user support, system administration",
      professionalBackground: "Experienced platform administrator",
      additionalNotes:
        "Dedicated to providing excellent service and platform reliability",
    });

    // Update production profile
    const updateResponse = await profileRepository.updateProfile(
      adminUser.id,
      productionProfileData,
      { id: adminUser.id, isPublic: false },
      logger,
    );

    if (updateResponse.success) {
      logger.debug(`✅ Created production profile for admin ${adminUser.id}`);
    } else {
      logger.error(
        `Failed to create production profile: ${JSON.stringify(updateResponse)}`,
      );
    }
  } catch (error) {
    logger.error("Error seeding production profile data:", error);
  }
}

// Register seeds with the seed manager
// Profile has lower priority (25) - after users (100) and basic business data (30)
registerSeed(
  "profile",
  {
    dev,
    test,
    prod,
  },
  25,
);
