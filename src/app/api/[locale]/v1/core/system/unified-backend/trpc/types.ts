/**
 * tRPC Types
 * Core types for tRPC integration - moved from unified-ui to backend
 */

import "server-only";

import type { NextRequest } from "next/server";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";
import type { EndpointLogger } from "../shared/endpoint-logger";

/**
 * Infer JWT payload type from user roles
 */
export type InferJwtPayloadTypeFromRoles<
  TUserRoleValue extends readonly string[],
> = TUserRoleValue extends readonly [typeof UserRole.PUBLIC]
  ? { isPublic: true }
  : JwtPayloadType;

/**
 * tRPC Context Interface
 * Contains all the data needed for tRPC procedures
 */
export interface TRPCContext<
  TUrlParams,
  TUserRoleValue extends readonly string[],
> {
  user: InferJwtPayloadTypeFromRoles<TUserRoleValue> | null;
  locale: CountryLanguage;
  t: TFunction;
  request: NextRequest;
  urlPathParams: TUrlParams;
  userRoles: TUserRoleValue;
  logger: EndpointLogger;
}

/**
 * tRPC Handler Return Type
 */
export type TrpcHandlerReturnType<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
> = (
  input: TRequestOutput & { urlPathParams?: TUrlVariablesOutput },
  ctx: TRPCContext<Record<string, string>, readonly string[]>,
) => Promise<TResponseOutput>;

