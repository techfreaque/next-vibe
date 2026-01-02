/**
 * Auth Definition
 * Defines API types for authentication endpoints
 * Repository-first architecture: exports TypeOutput types for repositories and routes
 */

import { z } from "zod";

import { UserPermissionRole, UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";

/**
 * JWT Payload Schema
 * Defines the structure of JWT token payloads using discriminated union
 *
 * IMPORTANT: Roles are fetched from DB and included in JWT during token creation/refresh.
 * Once in the JWT, roles can be trusted because the JWT is signed and cannot be tampered with.
 * Never fetch roles from cookies - always use roles from the verified JWT payload.
 */

const publicJwtPayloadSchema = z.object({
  isPublic: z.literal(true),
  leadId: z.uuid(),
  roles: z.array(z.enum([UserPermissionRole.PUBLIC])).default([UserPermissionRole.PUBLIC]),
});

const privateJwtPayloadSchema = z.object({
  id: z.uuid(),
  // user has always a leadId
  leadId: z.uuid(),
  isPublic: z.literal(false),
  // Roles are fetched from DB during login/signup and stored in JWT
  roles: z.array(z.enum(UserRoleDB)),
});

export const jwtPayloadSchema = z.discriminatedUnion("isPublic", [
  publicJwtPayloadSchema,
  privateJwtPayloadSchema,
]);

export type JWTPublicPayloadType = z.infer<typeof publicJwtPayloadSchema> & {
  id?: never;
};
export type JwtPrivatePayloadType = z.infer<typeof privateJwtPayloadSchema>;

export type JwtPayloadType = JWTPublicPayloadType | JwtPrivatePayloadType;
