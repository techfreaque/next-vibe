/**
 * Chat Folders Seeds
 * Provides seed data for chat folder categories (PUBLIC root folder)
 */

import { eq } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  UserPermissionRole,
  type UserPermissionRoleValue,
} from "@/app/api/[locale]/user/user-roles/enum";

import { DefaultFolderId } from "../config";
import { chatFolders } from "../db";
import type { IconKey } from "../model-access/icons";

/**
 * Forum category configurations
 * These will be created as root-level folders in the PUBLIC folder
 */
interface CategoryConfig {
  id: string; // Fixed UUID for stable identification
  name: string;
  icon: IconKey;
  color: string;
  sortOrder: number;
  description?: string;
  rolesView: (typeof UserPermissionRoleValue)[];
  rolesManage: (typeof UserPermissionRoleValue)[];
  rolesCreateThread: (typeof UserPermissionRoleValue)[];
  rolesPost: (typeof UserPermissionRoleValue)[];
  rolesModerate: (typeof UserPermissionRoleValue)[];
  rolesAdmin: (typeof UserPermissionRoleValue)[];
}

/**
 * Default forum categories for PUBLIC root folder
 * Fixed UUIDs ensure stable identification across deployments
 */
const FORUM_CATEGORIES: CategoryConfig[] = [
  {
    id: "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d",
    name: "Technology",
    icon: "cpu",
    color: "#3b82f6", // blue
    sortOrder: 0,
    description: "Software, hardware, AI, and emerging tech",
    rolesView: [UserPermissionRole.PUBLIC, UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesManage: [UserPermissionRole.ADMIN],
    rolesCreateThread: [UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesPost: [UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesModerate: [UserPermissionRole.PARTNER_ADMIN, UserPermissionRole.ADMIN],
    rolesAdmin: [UserPermissionRole.ADMIN],
  },
  {
    id: "b2c3d4e5-f6a1-4b2c-8d3e-4f5a6b7c8d9e",
    name: "Philosophy",
    icon: "brain",
    color: "#8b5cf6", // violet
    sortOrder: 1,
    description: "Ethics, metaphysics, epistemology, and critical thinking",
    rolesView: [UserPermissionRole.PUBLIC, UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesManage: [UserPermissionRole.ADMIN],
    rolesCreateThread: [UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesPost: [UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesModerate: [UserPermissionRole.PARTNER_ADMIN, UserPermissionRole.ADMIN],
    rolesAdmin: [UserPermissionRole.ADMIN],
  },
  {
    id: "c3d4e5f6-a1b2-4c3d-8e4f-5a6b7c8d9e0f",
    name: "Science",
    icon: "microscope",
    color: "#10b981", // emerald
    sortOrder: 2,
    description: "Physics, biology, chemistry, mathematics, and research",
    rolesView: [UserPermissionRole.PUBLIC, UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesManage: [UserPermissionRole.ADMIN],
    rolesCreateThread: [UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesPost: [UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesModerate: [UserPermissionRole.PARTNER_ADMIN, UserPermissionRole.ADMIN],
    rolesAdmin: [UserPermissionRole.ADMIN],
  },
  {
    id: "d4e5f6a1-b2c3-4d4e-8f5a-6b7c8d9e0f1a",
    name: "Politics",
    icon: "scale",
    color: "#ef4444", // red
    sortOrder: 3,
    description: "Political theory, current events, and policy discussion",
    rolesView: [UserPermissionRole.PUBLIC, UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesManage: [UserPermissionRole.ADMIN],
    rolesCreateThread: [UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesPost: [UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesModerate: [UserPermissionRole.PARTNER_ADMIN, UserPermissionRole.ADMIN],
    rolesAdmin: [UserPermissionRole.ADMIN],
  },
  {
    id: "e5f6a1b2-c3d4-4e5f-8a6b-7c8d9e0f1a2b",
    name: "Business",
    icon: "briefcase",
    color: "#f59e0b", // amber
    sortOrder: 4,
    description: "Entrepreneurship, startups, finance, and economics",
    rolesView: [UserPermissionRole.PUBLIC, UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesManage: [UserPermissionRole.ADMIN],
    rolesCreateThread: [UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesPost: [UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesModerate: [UserPermissionRole.PARTNER_ADMIN, UserPermissionRole.ADMIN],
    rolesAdmin: [UserPermissionRole.ADMIN],
  },
  {
    id: "f6a1b2c3-d4e5-4f6a-8b7c-8d9e0f1a2b3c",
    name: "Culture",
    icon: "palette",
    color: "#ec4899", // pink
    sortOrder: 5,
    description: "Art, music, film, literature, and cultural analysis",
    rolesView: [UserPermissionRole.PUBLIC, UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesManage: [UserPermissionRole.ADMIN],
    rolesCreateThread: [UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesPost: [UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesModerate: [UserPermissionRole.PARTNER_ADMIN, UserPermissionRole.ADMIN],
    rolesAdmin: [UserPermissionRole.ADMIN],
  },
  {
    id: "a7b8c9d0-e1f2-4a7b-8c8d-9e0f1a2b3c4d",
    name: "Health",
    icon: "heart",
    color: "#06b6d4", // cyan
    sortOrder: 6,
    description: "Fitness, nutrition, mental health, and medicine",
    rolesView: [UserPermissionRole.PUBLIC, UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesManage: [UserPermissionRole.ADMIN],
    rolesCreateThread: [UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesPost: [UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesModerate: [UserPermissionRole.PARTNER_ADMIN, UserPermissionRole.ADMIN],
    rolesAdmin: [UserPermissionRole.ADMIN],
  },
  {
    id: "b8c9d0e1-f2a3-4b8c-8d9e-0f1a2b3c4d5e",
    name: "Gaming",
    icon: "gamepad",
    color: "#a855f7", // purple
    sortOrder: 7,
    description: "Video games, esports, game design, and gaming culture",
    rolesView: [UserPermissionRole.PUBLIC, UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesManage: [UserPermissionRole.ADMIN],
    rolesCreateThread: [UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesPost: [UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesModerate: [UserPermissionRole.PARTNER_ADMIN, UserPermissionRole.ADMIN],
    rolesAdmin: [UserPermissionRole.ADMIN],
  },
  {
    id: "c9d0e1f2-a3b4-4c9d-8e0f-1a2b3c4d5e6f",
    name: "Education",
    icon: "graduation-cap",
    color: "#0ea5e9", // sky
    sortOrder: 8,
    description: "Learning, teaching, academia, and self-improvement",
    rolesView: [UserPermissionRole.PUBLIC, UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesManage: [UserPermissionRole.ADMIN],
    rolesCreateThread: [UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesPost: [UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesModerate: [UserPermissionRole.PARTNER_ADMIN, UserPermissionRole.ADMIN],
    rolesAdmin: [UserPermissionRole.ADMIN],
  },
  {
    id: "d0e1f2a3-b4c5-4d0e-8f1a-2b3c4d5e6f7a",
    name: "Meta",
    icon: "message-square",
    color: "#64748b", // slate
    sortOrder: 9,
    description: "Discussion about this platform, feedback, and community",
    rolesView: [UserPermissionRole.PUBLIC, UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesManage: [UserPermissionRole.ADMIN],
    rolesCreateThread: [UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesPost: [UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
    rolesModerate: [UserPermissionRole.PARTNER_ADMIN, UserPermissionRole.ADMIN],
    rolesAdmin: [UserPermissionRole.ADMIN],
  },
];

/**
 * Helper function to create or update a category folder
 * Uses fixed UUIDs to enable updates to existing categories
 */
async function createOrUpdateCategory(
  category: CategoryConfig,
  logger: EndpointLogger,
): Promise<void> {
  try {
    // Check if category already exists by ID
    const existingFolders = await db
      .select()
      .from(chatFolders)
      .where(eq(chatFolders.id, category.id))
      .limit(1);

    const folderData = {
      userId: null, // System folder - no specific owner
      leadId: null, // System folder - no lead association
      rootFolderId: DefaultFolderId.PUBLIC,
      name: category.name,
      icon: category.icon,
      color: category.color,
      parentId: null, // Root-level category
      expanded: true,
      sortOrder: category.sortOrder,
      rolesView: category.rolesView,
      rolesManage: category.rolesManage,
      rolesCreateThread: category.rolesCreateThread,
      rolesPost: category.rolesPost,
      rolesModerate: category.rolesModerate,
      rolesAdmin: category.rolesAdmin,
    };

    if (existingFolders.length > 0) {
      // Update existing category
      await db
        .update(chatFolders)
        .set({
          ...folderData,
          updatedAt: new Date(),
        })
        .where(eq(chatFolders.id, category.id));

      logger.debug(`✅ Updated category folder "${category.name}" (${category.id})`);
    } else {
      // Create new category folder with fixed ID
      await db.insert(chatFolders).values({
        id: category.id,
        ...folderData,
      });

      logger.debug(`✅ Created category folder "${category.name}" (${category.id})`);
    }
  } catch (error) {
    logger.error(`Failed to create/update category "${category.name}"`, {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Shared seed logic for all environments
 */
async function seedCategories(logger: EndpointLogger, environment: string): Promise<void> {
  logger.debug(`🌱 Seeding chat folder categories for ${environment} environment`);

  for (const category of FORUM_CATEGORIES) {
    await createOrUpdateCategory(category, logger);
  }

  logger.debug(`✅ Finished seeding ${FORUM_CATEGORIES.length} forum categories`);
}

/**
 * Development seed function for chat folders
 */
export async function dev(logger: EndpointLogger): Promise<void> {
  await seedCategories(logger, "development");
}

/**
 * Test seed function for chat folders
 */
export async function test(logger: EndpointLogger): Promise<void> {
  await seedCategories(logger, "test");
}

/**
 * Production seed function for chat folders
 */
export async function prod(logger: EndpointLogger): Promise<void> {
  await seedCategories(logger, "production");
}

// Export priority for seed manager
// Chat folders should be created after users (priority 100)
// Set priority to 90 to ensure users exist first
export const priority = 90;
