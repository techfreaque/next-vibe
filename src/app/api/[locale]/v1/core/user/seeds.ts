/**
 * Auth seeds
 * Provides seed data for auth-related tables
 */

import { and, eq } from "drizzle-orm";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import { registerSeed } from "@/app/api/[locale]/v1/core/system/db/seed/seed-manager";
import { createMockUser, getCliUserEmail } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/auth/cli-user-factory";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "@/i18n/core/language-utils";

import { leads, userLeads } from "../leads/db";
import { LeadSource, LeadStatus } from "../leads/enum";
import { parseError } from "../shared/utils";
import { authRepository } from "./auth/repository";
import type { NewUser } from "./db";
import { users } from "./db";
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
export async function dev(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  logger.debug("🌱 Seeding auth data for development environment");

  // Create CLI system user with all roles
  const cliUser = createUserSeed({
    email: getCliUserEmail(),
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
  const createdUsers: StandardUserType[] = [];
  for (const user of allUsers) {
    try {
      // Check if user already exists using emailExists (doesn't fetch full user)
      const emailExistsResponse = await userRepository.emailExists(
        user.email,
        logger,
      );
      if (emailExistsResponse.success && emailExistsResponse.data) {
        logger.debug(
          `User with email ${user.email} already exists, skipping creation`,
        );
        // Get existing user ID to fetch later after leads are created
        const results = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, user.email))
          .limit(1);
        if (results.length > 0) {
          // Create minimal user object for now
          const minimalUser: StandardUserType = {
            id: results[0].id,
            leadId: "",
            isPublic: false,
            privateName: user.privateName,
            publicName: user.publicName,
            email: user.email,
            emailVerified: true,
            isActive: true,
            requireTwoFactor: false,
            marketingConsent: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            userRoles: [],
          };
          createdUsers.push(minimalUser);
        }
        continue;
      }
      // Create new user
      const newUserResponse = await userRepository.createWithHashedPassword(
        user,
        logger,
      );
      if (!newUserResponse.success) {
        logger.error(
          `Failed to create user ${user.email}: ${newUserResponse.message}`,
        );
        continue;
      }
      createdUsers.push(newUserResponse.data);
    } catch (error) {
      logger.error(`Error creating user ${user.email}`, parseError(error));
    }
  }

  // Create primary leads for all users
  const { language, country } = getLanguageAndCountryFromLocale(locale);
  for (const user of createdUsers) {
    try {
      // Check if lead already exists for this email
      const existingLeads = await db
        .select()
        .from(leads)
        .where(eq(leads.email, user.email))
        .limit(1);

      let leadId: string;
      if (existingLeads.length > 0) {
        leadId = existingLeads[0].id;
        logger.debug(
          `Lead already exists for ${user.email}, using existing lead ${leadId}`,
        );
      } else {
        // Create lead
        const leadData = {
          email: user.email,
          businessName: user.publicName || "",
          status: LeadStatus.SIGNED_UP,
          source: LeadSource.WEBSITE,
          country,
          language,
        };
        const [newLead] = await db.insert(leads).values(leadData).returning();
        leadId = newLead.id;
        logger.debug(`Created primary lead ${leadId} for user ${user.id}`);
      }

      // Check if user-lead link already exists
      const existingUserLeads = await db
        .select()
        .from(userLeads)
        .where(and(eq(userLeads.userId, user.id), eq(userLeads.leadId, leadId)))
        .limit(1);

      if (existingUserLeads.length === 0) {
        // Link to user as primary
        await db.insert(userLeads).values({
          userId: user.id,
          leadId,
          isPrimary: true,
        });
        logger.debug(`Linked lead ${leadId} to user ${user.id}`);
      } else {
        logger.debug(
          `User-lead link already exists for user ${user.id} and lead ${leadId}`,
        );
      }
    } catch (error) {
      const errorMsg = parseError(error).message;
      if (!errorMsg.includes("duplicate key")) {
        logger.error(
          `Error creating lead for user ${user.id}`,
          parseError(error),
        );
      }
    }
  }

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
          UserRole.CLI_OFF,
          UserRole.AI_TOOL_OFF,
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
            logger.error(
              `Failed to create ${role} role for CLI user`,
              parseError(roleError),
            );
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
    logger.error("Error creating user roles", parseError(error));
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
        "en-GLOBAL",
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
          logger.error("Failed to create CLI session");
        }
      } else {
        logger.error("Failed to create CLI token");
      }
    } catch (cliError) {
      logger.error(
        "Failed to create CLI authentication",
        parseError(cliError),
      );
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
          "en-GLOBAL",
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
        logger.error(`Error creating user ${user.email}`, parseError(error));
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
    logger.error("Error creating test user roles", parseError(error));
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
      "en-GLOBAL",
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
    logger.error("Error creating admin user or role", parseError(error));
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
