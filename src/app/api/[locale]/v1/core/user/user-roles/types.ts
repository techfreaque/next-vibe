/**
 * User Roles Definition
 * Defines API types for user roles functionality
 * Repository-first architecture: exports TypeOutput types for repositories and routes
 */

import { z } from "zod";

import { UserRole } from "./enum";

// Re-export for external use
export { UserRole };

// Use z.enum instead of z.enum for proper enum validation
const userRoleTypeSchema = z.enum(UserRole);

export const userRoleAdminCreateSchema = z.object({
  role: userRoleTypeSchema,
});

export const userRoleRestaurantResponseSchema = z.object({
  id: z.uuid(),
  role: userRoleTypeSchema,
  userId: z.uuid(),
});
export type UserRoleRestaurantResponseType = z.input<
  typeof userRoleRestaurantResponseSchema
>;

export const userRoleResponseSchema = z.object({
  id: z.uuid(),
  role: userRoleTypeSchema,
});
export type UserRoleResponseType = z.input<typeof userRoleResponseSchema>;

const definitions = {};

export default definitions;
