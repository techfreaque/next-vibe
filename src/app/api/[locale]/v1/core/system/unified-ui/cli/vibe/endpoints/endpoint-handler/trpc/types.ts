import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import type { TRPCContext } from "./trpc-context";

export type TrpcHandlerReturnType<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
> = (
  input: TRequestOutput & { urlVariables?: TUrlVariablesOutput },
  ctx: TRPCContext<Record<string, string>, readonly (typeof UserRoleValue)[]>,
) => Promise<TResponseOutput>;
