/**
 * Auth seeds
 * Provides seed data for auth-related tables
 */

import { registerSeed } from "@/packages/next-vibe/server/db/seed-manager";

import type { EndpointLogger } from "../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { authRepository } from "./auth/repository";
import type { NewUser } from "./db";
import type { StandardUserType } from "./definition";
import { UserDetailLevel } from "./enum";
import { sessionRepository } from "./private/session/repository";
import { userRepository } from "./repository";
import { UserRole } from "./user-roles/enum";
import { userRolesRepository } from "./user-roles/repository";

/**
 * Helper function to create user seed data
 */
function createUserSeed(overrides?: Partial<NewUser>): NewUser {
  return {
    email: `user${Math.floor(Math.random() * 1000)}@example.com`,
    password: "password123", // Plain text password - will be hashed by createWithHashedPassword
    privateName: `User${Math.floor(Math.random() * 1000)}`,
    publicName: `Company${Math.floor(Math.random() * 1000)}`,
    emailVerified: true,
    isActive: true,
    marketingConsent: false,

    ...overrides,
  };
}

/**
 * Development seed function for auth module
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding auth data for development environment");

  // Create CLI system user with all roles
  const cliUser = createUserSeed({
    email: "cli@system.local",
    privateName: "CLI System",
    publicName: "System CLI",
  });

  // Create admin user
  const adminUser = createUserSeed({
    email: "admin@example.com",
    privateName: "Admin User",
    publicName: "Admin Corp",
  });

  // Create demo user
  const demoUser = createUserSeed({
    email: "demo@example.com",
    privateName: "Demo User",
    publicName: "Demo Company",
  });

  // Create regular users
  const regularUsers = [
    createUserSeed({
      email: "user1@example.com",
      privateName: "Regular User1",
      publicName: "User1 Corp",
    }),
    createUserSeed({
      email: "user2@example.com",
      privateName: "Regular User2",
      publicName: "User2 Corp",
    }),
    createUserSeed({
      email: "lowcredits@example.com",
      privateName: "Low Credits User",
      publicName: "Low Credits Corp",
    }),
  ];

  const allUsers = [cliUser, adminUser, demoUser, ...regularUsers];

  // Create users with hashed passwords using the repository
  const createdUsers = await Promise.all(
    allUsers.map(async (user) => {
      try {
        // Check if user already exists
        const existingUserResponse = await userRepository.getUserByEmail(
          user.email,
          UserDetailLevel.STANDARD,
          logger,
        );
        if (existingUserResponse.success && existingUserResponse.data) {
          logger.debug(
            `User with email ${user.email} already exists, skipping creation`,
          );
          return existingUserResponse.data;
        }
        // Create new user
        const newUserResponse = await userRepository.createWithHashedPassword(
          user,
          logger,
        );
        if (!newUserResponse.success) {
          throw new Error(`Failed to create user: ${newUserResponse.message}`);
        }
        return newUserResponse.data;
      } catch (error) {
        logger.error(`Error creating user ${user.email}:`, error);
        throw error;
      }
    }),
  );

  // Create roles for users
  try {
    // Check if user_roles table exists
    try {
      // Only proceed if we have valid user IDs
      if (createdUsers.length > 0 && createdUsers[0]) {
        // First user is CLI user - assign ALL roles for maximum permissions
        const cliUserId = createdUsers[0].id;
        const allRoles = [
          UserRole.ADMIN,
          UserRole.CLI_ONLY,
          UserRole.CLI_WEB,
          UserRole.CUSTOMER,
          UserRole.PARTNER_ADMIN,
          UserRole.PARTNER_EMPLOYEE,
        ];

        for (const role of allRoles) {
          try {
            await userRolesRepository.addRole(
              {
                userId: cliUserId,
                role,
              },
              logger,
            );
            logger.debug(`Created ${role} role for CLI user ${cliUserId}`);
          } catch (roleError) {
            const errorMessage =
              roleError instanceof Error
                ? roleError.message
                : String(roleError);
            if (!errorMessage.includes("duplicate key")) {
              logger.error(
                `Failed to create ${role} role for CLI user:`,
                roleError,
              );
            }
          }
        }
      }

      if (createdUsers.length > 1 && createdUsers[1]) {
        // Second user is admin user
        await userRolesRepository.addRole(
          {
            userId: createdUsers[1].id, // Admin user
            role: UserRole.ADMIN,
          },
          logger,
        );
        logger.debug(`Created admin role for user ${createdUsers[1].id}`);
      }

      if (createdUsers.length > 2 && createdUsers[2]) {
        // Third user is demo user
        await userRolesRepository.addRole(
          {
            userId: createdUsers[2].id, // Demo user
            role: UserRole.CUSTOMER,
          },
          logger,
        );
        logger.debug(`Created customer role for user ${createdUsers[2].id}`);
      }

      // Create roles for regular users (starting from index 3)
      for (let i = 3; i < createdUsers.length; i++) {
        if (createdUsers[i]) {
          await userRolesRepository.addRole(
            {
              userId: createdUsers[i].id, // Regular users
              role: UserRole.CUSTOMER,
            },
            logger,
          );
          logger.debug(`Created customer role for user ${createdUsers[i].id}`);
        }
      }
    } catch (roleError) {
      // Type-safe checks for error message properties
      const errorMessage =
        roleError instanceof Error ? roleError.message : String(roleError);

      // If the error is about the table not existing, we can ignore it
      if (errorMessage.includes('relation "user_roles" does not exist')) {
        logger.debug(
          "user_roles table does not exist yet, skipping role creation",
        );
      } else if (errorMessage.includes("duplicate key")) {
        logger.debug("User roles already exist, skipping creation");
      } else {
        // For other errors, we should log and rethrow
        throw roleError;
      }
    }
  } catch (error) {
    logger.error("Error creating user roles:", error);
    // Don't throw the error, just log it and continue
    // This allows the seed to complete even if roles can't be created
  }

  // Create CLI token and session for CLI user (first user)
  if (createdUsers.length > 0 && createdUsers[0]) {
    const cliUserId = createdUsers[0].id;
    try {
      logger.debug(`Creating CLI authentication for user ${cliUserId}`);

      // Create CLI token
      const cliTokenResponse = await authRepository.createCliToken(
        cliUserId,
        logger,
      );
      if (cliTokenResponse.success) {
        logger.debug(`✅ Created CLI token for user ${cliUserId}`);

        // Create a persistent session for CLI operations
        const sessionExpiresAt = new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000,
        ); // 1 year
        const sessionResult = await sessionRepository.create({
          userId: cliUserId,
          token: cliTokenResponse.data,
          expiresAt: sessionExpiresAt,
          createdAt: new Date(),
        });

        if (sessionResult.success) {
          logger.debug(`✅ Created CLI session for user ${cliUserId}`);
        } else {
          logger.error("Failed to create CLI session:", sessionResult);
        }
      } else {
        logger.error("Failed to create CLI token:", cliTokenResponse);
      }
    } catch (cliError) {
      logger.error("Failed to create CLI authentication:", cliError);
    }
  }

  logger.debug(
    `✅ Inserted ${createdUsers.length} development users with roles and CLI authentication`,
  );
}

/**
 * Test seed function for auth module
 */
export async function test(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding auth data for test environment");

  // Create test users
  const testUsers = [
    createUserSeed({
      email: "test1@example.com",
      privateName: "Test User1",
      publicName: "Test1 Company",
    }),
    createUserSeed({
      email: "test2@example.com",
      privateName: "Test User2",
      publicName: "Test2 Company",
    }),
  ];

  // Create test users with hashed passwords using the repository
  const createdUsers = await Promise.all(
    testUsers.map(async (user) => {
      try {
        // Check if user already exists
        const existingUser = await userRepository.getUserByEmail(
          user.email,
          UserDetailLevel.STANDARD,
          logger,
        );
        if (existingUser.success) {
          logger.debug(
            `User with email ${user.email} already exists, skipping creation`,
          );
          return existingUser.data;
        }
        // Create new user
        const userResponse = await userRepository.createWithHashedPassword(
          user,
          logger,
        );
        if (!userResponse.success) {
          throw new Error(`Failed to create user: ${userResponse.message}`);
        }
        return userResponse.data;
      } catch (error) {
        logger.error(`Error creating user ${user.email}:`, error);
        throw error;
      }
    }),
  );

  // Create roles for test users
  try {
    // Check if user_roles table exists
    try {
      // Try to assign admin role to first user
      await userRolesRepository.addRole(
        {
          userId: createdUsers[0].id,
          role: UserRole.ADMIN,
        },
        logger,
      );
      logger.debug(`Created admin role for test user ${createdUsers[0].id}`);

      // Assign customer role to second user
      await userRolesRepository.addRole(
        {
          userId: createdUsers[1].id,
          role: UserRole.CUSTOMER,
        },
        logger,
      );
      logger.debug(`Created customer role for test user ${createdUsers[1].id}`);
    } catch (roleError) {
      // Type-safe checks for error message properties
      const errorMessage =
        roleError instanceof Error ? roleError.message : String(roleError);

      // If the error is about the table not existing, we can ignore it
      if (errorMessage.includes('relation "user_roles" does not exist')) {
        logger.debug(
          "user_roles table does not exist yet, skipping role creation",
        );
      } else if (errorMessage.includes("duplicate key")) {
        logger.debug("User roles already exist, skipping creation");
      } else {
        // For other errors, we should log and rethrow
        throw roleError;
      }
    }
  } catch (error) {
    logger.error("Error creating test user roles:", error);
    // Don't throw the error, just log it and continue
  }

  logger.debug("✅ Inserted test users with roles");
}

/**
 * Production seed function for auth module
 */
export async function prod(logger: EndpointLogger): Promise<void> {
  logger.debug("🌱 Seeding auth data for production environment");

  // Create admin user
  const adminUser = createUserSeed({
    email: "hi@socialmediaservice.center",
    privateName: "Admin User",
    publicName: "Social Media Service Center",
  });

  // Create admin user with hashed password using the repository
  let createdAdmin: StandardUserType;
  try {
    // Check if admin user already exists
    const existingAdmin = await userRepository.getUserByEmail(
      adminUser.email,
      UserDetailLevel.STANDARD,
      logger,
    );
    if (existingAdmin.success && existingAdmin.data) {
      logger.debug(
        `Admin user with email ${adminUser.email} already exists, skipping creation`,
      );
      createdAdmin = existingAdmin.data;
    } else {
      // User doesn't exist, create new admin user
      logger.debug(
        `Admin user with email ${adminUser.email} does not exist, creating new user`,
      );
      const adminResponse = await userRepository.createWithHashedPassword(
        adminUser,
        logger,
      );
      if (!adminResponse.success) {
        throw new Error(
          `Failed to create admin user: ${JSON.stringify(adminResponse)}`,
        );
      }
      createdAdmin = adminResponse.data;
      logger.debug(
        `Successfully created admin user with email ${adminUser.email}`,
      );
    }

    // Create admin role for admin user
    try {
      await userRolesRepository.addRole(
        {
          userId: createdAdmin.id,
          role: UserRole.ADMIN,
        },
        logger,
      );
      logger.debug(`Created admin role for user ${createdAdmin.id}`);
    } catch (roleError) {
      // Type-safe checks for error message properties
      const errorMessage =
        roleError instanceof Error ? roleError.message : String(roleError);

      // If the error is about the table not existing, we can ignore it
      if (errorMessage.includes('relation "user_roles" does not exist')) {
        logger.debug(
          "user_roles table does not exist yet, skipping role creation",
        );
      } else if (errorMessage.includes("duplicate key")) {
        logger.debug(
          `Admin role for user ${createdAdmin.id} already exists, skipping creation`,
        );
      } else {
        // For other errors, we should log and rethrow
        throw roleError;
      }
    }
  } catch (error) {
    logger.error("Error creating admin user or role:", error);
    // Don't throw the error, just log it and continue
  }

  logger.debug("✅ Inserted essential production users with roles");
}

// Register seeds with the seed manager
// User has highest priority (100) as users must be created first
registerSeed(
  "user",
  {
    dev,
    test,
    prod,
  },
  100,
);
