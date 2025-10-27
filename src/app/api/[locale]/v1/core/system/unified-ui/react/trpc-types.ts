import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import type { TRPCContext } from "./trpc-trpc-context";

/**
 * Infer JWT payload type from user roles
 */
export type InferJwtPayloadTypeFromRoles<
  TUserRoleValue extends readonly string[],
> = TUserRoleValue extends readonly [typeof UserRole.PUBLIC]
  ? { isPublic: true }
  : JwtPayloadType;

export type TrpcHandlerReturnType<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
> = (
  input: TRequestOutput & { urlPathParams?: TUrlVariablesOutput },
  ctx: TRPCContext<Record<string, string>, readonly string[]>,
) => Promise<TResponseOutput>;
