import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type { InferJwtPayloadTypeFromRoles } from "../shared/handler-types";

export type CliHandlerReturnType<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
> = (
  data: TRequestOutput,
  urlPathParams: TUrlVariablesOutput,
  user: InferJwtPayloadTypeFromRoles<TUserRoleValue>,
  locale: CountryLanguage,
  verbose?: boolean,
) => Promise<ResponseType<TResponseOutput>>;
