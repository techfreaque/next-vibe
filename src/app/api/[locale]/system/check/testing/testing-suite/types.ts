import type { ResponseType } from "next-vibe/shared/types/response.schema";
import type { z } from "zod";

import type { CreateApiEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";

/**
 * Options for testing an API endpoint
 */
export interface TestEndpointOptions<
  TRequestInput,
  TRequestOutput,
  TResponseInput,
  TResponseOutput,
  TUrlVariablesInput,
  TUrlVariablesOutput,
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly UserRoleValue[],
  TFields extends UnifiedField<z.ZodTypeAny>,
> {
  /**
   * Custom test cases to run in addition to (or instead of) example tests
   */
  customTests?: {
    [testName: string]: (
      test: TestRunner<
        TRequestInput,
        TRequestOutput,
        TResponseInput,
        TResponseOutput,
        TUrlVariablesInput,
        TUrlVariablesOutput,
        TExampleKey,
        TMethod,
        TUserRoleValue,
        TFields
      >,
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
  TRequestInput,
  TRequestOutput,
  TResponseInput,
  TResponseOutput,
  TUrlVariablesInput,
  TUrlVariablesOutput,
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly UserRoleValue[],
  TFields extends UnifiedField<z.ZodTypeAny>,
> {
  /**
   * Execute the endpoint with the given data and URL params
   * User is optional - if not provided, creates default user based on endpoint roles
   */
  executeWith: (options: {
    data: TRequestOutput;
    urlPathParams: TUrlVariablesOutput;
    user: JwtPayloadType;
  }) => Promise<ResponseType<TResponseOutput>>;

  /**
   * The endpoint being tested
   */
  endpoint: CreateApiEndpoint<
    TExampleKey,
    TMethod,
    TUserRoleValue,
    TFields,
    TRequestInput,
    TRequestOutput,
    TResponseInput,
    TResponseOutput,
    TUrlVariablesInput,
    TUrlVariablesOutput
  >;
}
