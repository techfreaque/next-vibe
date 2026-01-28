import type { ResponseType } from "next-vibe/shared/types/response.schema";
import type { z } from "zod";

import type { CreateApiEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";

import type {
  AnyChildrenConstrain,
  ConstrainedChildUsage,
  FieldUsageConfig,
} from "../../../unified-interface/unified-ui/widgets/_shared/types";

/**
 * Options for testing an API endpoint
 */
export interface TestEndpointOptions<
  TMethod extends Methods,
  TUserRoleValue extends readonly UserRoleValue[],
  TScopedTranslationKey extends string,
  TFields extends UnifiedField<
    TScopedTranslationKey,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<
      TScopedTranslationKey,
      ConstrainedChildUsage<FieldUsageConfig>
    >
  >,
> {
  /**
   * Custom test cases to run in addition to (or instead of) example tests
   */
  customTests?: {
    [testName: string]: (
      test: TestRunner<TMethod, TUserRoleValue, TScopedTranslationKey, TFields>,
    ) => Promise<void> | void;
  };

  /**
   * Whether to skip automatic tests based on endpoint examples
   * @default false
   */
  skipExampleTests?: boolean;
}

/**
 * Test runner for executing API endpoint tests
 */
export interface TestRunner<
  TMethod extends Methods,
  TUserRoleValue extends readonly UserRoleValue[],
  TScopedTranslationKey extends string,
  TFields extends UnifiedField<
    TScopedTranslationKey,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<
      TScopedTranslationKey,
      ConstrainedChildUsage<FieldUsageConfig>
    >
  >,
> {
  /**
   * Execute the endpoint with the given data and URL params
   * User is optional - if not provided, creates default user based on endpoint roles
   */
  executeWith: (options: {
    data: CreateApiEndpoint<
      TMethod,
      TUserRoleValue,
      TScopedTranslationKey,
      AnyChildrenConstrain<
        TScopedTranslationKey,
        ConstrainedChildUsage<FieldUsageConfig>
      >,
      TFields
    >["types"]["RequestOutput"];
    urlPathParams: CreateApiEndpoint<
      TMethod,
      TUserRoleValue,
      TScopedTranslationKey,
      AnyChildrenConstrain<
        TScopedTranslationKey,
        ConstrainedChildUsage<FieldUsageConfig>
      >,
      TFields
    >["types"]["UrlVariablesOutput"];
    user: JwtPayloadType;
  }) => Promise<
    ResponseType<
      CreateApiEndpoint<
        TMethod,
        TUserRoleValue,
        TScopedTranslationKey,
        AnyChildrenConstrain<
          TScopedTranslationKey,
          ConstrainedChildUsage<FieldUsageConfig>
        >,
        TFields
      >["types"]["ResponseOutput"]
    >
  >;

  /**
   * The endpoint being tested
   */
  endpoint: CreateApiEndpoint<
    TMethod,
    TUserRoleValue,
    TScopedTranslationKey,
    AnyChildrenConstrain<
      TScopedTranslationKey,
      ConstrainedChildUsage<FieldUsageConfig>
    >,
    TFields
  >;
}
