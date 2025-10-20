/**
 * Users Management Seeds
 * Provides seed data for users management functionality
 */

import type { TFunction } from "@/i18n/core/static-types";
import { registerSeed } from "@/packages/next-vibe/server/db/seed-manager";

import type { EndpointLogger } from "../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { userRepository } from "../user/repository";
import { UserRole } from "../user/user-roles/enum";
import type { UserCreateRequestOutput } from "./create/definition";
import { userCreateRepository } from "./create/repository";

/**
 * Dummy translation function for seeds
 */
const dummyT: TFunction = ((key: string) => key) as TFunction;

/**
 * Helper function to create user management seed data
 */
function createUserManagementSeed(
  config: UserCreateRequestOutput,
): UserCreateRequestOutput {
  return config;
}

/**
 * Development seed function for users management module
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding users management data for development environment");

  try {
    // Get admin user to act as creator
    const adminUserResponse = await userRepository.getUserByEmail(
      "admin@example.com",
      undefined,
      logger,
    );

    if (!adminUserResponse.success || !adminUserResponse.data) {
      logger.error(
        "❌ Admin user not found, skipping users management seeding",
      );
      return;
    }

    const adminUser = adminUserResponse.data;

    if (!adminUser.leadId) {
      logger.error(
        "❌ Admin user has no leadId, skipping users management seeding",
      );
      return;
    }

    const adminJwtPayload = {
      id: adminUser.id,
      leadId: adminUser.leadId,
      isPublic: false,
    } as const;

    // Create sample users for testing user management functionality
    const sampleUsers = [
      createUserManagementSeed({
        basicInfo: {
          email: "sarah.johnson@example.com",
          password: "DevPass123!",
          privateName: "Sarah Johnson",
          publicName: "Sarah J.",
        },
        adminSettings: {
          isActive: true,
          emailVerified: true,
          roles: [UserRole.CUSTOMER],
        },
      }),
      createUserManagementSeed({
        basicInfo: {
          email: "michael.chen@example.com",
          password: "DevPass123!",
          privateName: "Michael Chen",
          publicName: "Mike C.",
        },
        adminSettings: {
          isActive: true,
          emailVerified: true,
          roles: [UserRole.CUSTOMER],
        },
      }),
      createUserManagementSeed({
        basicInfo: {
          email: "emily.rodriguez@example.com",
          password: "DevPass123!",
          privateName: "Emily Rodriguez",
          publicName: "Emily R.",
        },
        adminSettings: {
          isActive: true,
          emailVerified: false, // Mix of verified and unverified for testing
          roles: [UserRole.CUSTOMER],
        },
      }),
    ];

    // Create each sample user
    let createdCount = 0;
    for (const userData of sampleUsers) {
      try {
        // Check if user already exists
        const existingUserResponse = await userRepository.getUserByEmail(
          userData.basicInfo.email,
          undefined,
          logger,
        );

        if (existingUserResponse.success && existingUserResponse.data) {
          logger.debug(
            `User ${userData.basicInfo.email} already exists, skipping creation`,
          );
          continue;
        }

        // Create the user
        const createResponse = await userCreateRepository.createUser(
          userData,
          adminJwtPayload,
          "en-GLOBAL",
          logger,
          dummyT,
        );

        if (createResponse.success) {
          createdCount++;
          logger.debug(
            `✅ Created sample user: ${userData.basicInfo.email} (ID: ${createResponse.data.responseId})`,
          );
        } else {
          logger.error(
            `Failed to create sample user ${userData.basicInfo.email}: ${createResponse.message}`,
          );
        }
      } catch (error) {
        logger.error(`Error creating user ${userData.basicInfo.email}:`, error);
      }
    }

    logger.debug(
      `✅ Created ${createdCount} sample users for development environment`,
    );
  } catch (error) {
    logger.error("Error seeding users management data:", error);
  }
}

/**
 * Test seed function for users management module
 */
export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding users management data for test environment");

  try {
    // Get admin user to act as creator
    const adminUserResponse = await userRepository.getUserByEmail(
      "admin@example.com",
      undefined,
      logger,
    );

    if (!adminUserResponse.success || !adminUserResponse.data) {
      logger.error(
        "❌ Admin user not found, skipping test users management seeding",
      );
      return;
    }

    const adminUser = adminUserResponse.data;

    if (!adminUser.leadId) {
      logger.error(
        "❌ Admin user has no leadId, skipping test users management seeding",
      );
      return;
    }

    const adminJwtPayload = {
      id: adminUser.id,
      leadId: adminUser.leadId,
      isPublic: false,
    } as const;

    // Create minimal test user for user management testing
    const testUserData = createUserManagementSeed({
      basicInfo: {
        email: "test.manager@example.com",
        password: "TestPass123!",
        privateName: "Test Manager",
        publicName: "Test M.",
      },
      adminSettings: {
        isActive: true,
        emailVerified: true,
        roles: [UserRole.CUSTOMER],
      },
    });

    // Check if test user already exists
    const existingUserResponse = await userRepository.getUserByEmail(
      testUserData.basicInfo.email,
      undefined,
      logger,
    );

    if (existingUserResponse.success && existingUserResponse.data) {
      logger.debug("Test management user already exists, skipping creation");
      return;
    }

    // Create test user
    const createResponse = await userCreateRepository.createUser(
      testUserData,
      adminJwtPayload,
      "en-GLOBAL",
      logger,
      dummyT,
    );

    if (createResponse.success) {
      logger.debug(
        `✅ Created test management user: ${testUserData.basicInfo.email} (ID: ${createResponse.data.responseId})`,
      );
    } else {
      logger.error(
        `Failed to create test management user: ${createResponse.message}`,
      );
    }
  } catch (error) {
    logger.error("Error seeding test users management data:", error);
  }
}

/**
 * Production seed function for users management module
 */
export async function prod(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding users management data for production environment");

  try {
    // Users management in production doesn't need pre-seeded data
    // Real users will be created through the admin interface or API
    await Promise.resolve(); // Ensure async behavior for consistency

    logger.debug("✅ Users management system ready for production use");
  } catch (error) {
    logger.error("Error seeding production users management data:", error);
  }
}

// Register seeds with lower priority than core user seeds
// Users management depends on existing users (100) but runs after business data (30)
registerSeed(
  "users-management",
  {
    dev,
    test,
    prod,
  },
  20,
);
