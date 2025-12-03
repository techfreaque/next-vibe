/**
 * Auth Definition
 * Defines API types for authentication endpoints
 * Repository-first architecture: exports TypeOutput types for repositories and routes
 */

import { dateSchema } from "next-vibe/shared/types/common.schema";
import { z } from "zod";

import { WebSocketErrorCode } from "./enum";
import {
  UserPermissionRole,
  UserRoleDB,
} from "@/app/api/[locale]/user/user-roles/enum";

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
  roles: z
    .array(z.enum([UserPermissionRole.PUBLIC]))
    .default([UserPermissionRole.PUBLIC]),
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

/**
 * Session Schema
 * Defines the structure of user sessions
 */
export const sessionSchema = z.object({
  id: z.uuid().optional(),
  userId: z.uuid(),
  token: z.string(),
  expiresAt: dateSchema,
  createdAt: dateSchema,
  lastUsedAt: dateSchema.optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  isRevoked: z.boolean().default(false),
});
export type SessionType = z.infer<typeof sessionSchema>;
export type NewSessionType = Omit<SessionType, "id">;

/**
 * Auth Token Schema
 * Defines the structure of authentication tokens
 */
export const authTokenSchema = z.object({
  token: z.string(),
  expiresAt: dateSchema,
});
export type AuthTokenType = z.infer<typeof authTokenSchema>;

/**
 * WebSocket User Schema
 * Defines the structure of WebSocket user data
 */
export const webSocketUserSchema = z.object({
  id: z.uuid(),
});
export type WebSocketUserType = z.infer<typeof webSocketUserSchema>;

/**
 * WebSocket Error Code Enum
 * Defines error codes for WebSocket authentication
 */
export const webSocketErrorCodeEnum = z.enum(WebSocketErrorCode);
export type WebSocketErrorCodeType = z.infer<typeof webSocketErrorCodeEnum>;

/**
 * Auth Verification Result Schema
 * Defines the structure of authentication verification results
 */
export const authVerificationResultSchema = z.object({
  isValid: z.boolean(),
  payload: jwtPayloadSchema.optional(),
  error: z.string().optional(),
});
export type AuthVerificationResultType = z.infer<
  typeof authVerificationResultSchema
>;
