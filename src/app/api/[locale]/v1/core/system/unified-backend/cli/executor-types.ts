import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { CountryLanguage } from "@/i18n/core/config";

import type { InferJwtPayloadTypeFromRoles } from "../shared/handler-types";

export type CliHandlerReturnType<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TUserRoleValue extends readonly string[],
> = (
  data: TRequestOutput,
  urlPathParams: TUrlVariablesOutput,
  user: InferJwtPayloadTypeFromRoles<TUserRoleValue>,
  locale: CountryLanguage,
  verbose?: boolean,
) => Promise<ResponseType<TResponseOutput>>;
