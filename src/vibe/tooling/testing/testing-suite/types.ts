import type {
  CreateApiEndpoint,
  InferRequestOutput,
  InferResponseOutput,
  InferUrlVariablesOutput,
} from "../../../core/definition/create";
import type { Methods } from "../../../core/definition/enums";
import type { ResponseType } from "../../../core/route/response.schema";
import type { JwtPayloadType } from "../../../identity/auth/types";
import type { UserRoleValue } from "../../../identity/roles/enum";
import type { EndpointEventsMap } from "../../../realtime/core/structured-events";
import type { UnifiedField } from "../../../unified-ui/_shared/configs";
import type {
  AnyChildrenConstrain,
  FieldUsageConfig,
} from "../../../unified-ui/_shared/types";
import type { z } from "zod";

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
    AnyChildrenConstrain<TScopedTranslationKey, FieldUsageConfig>
  >,
  TEvents extends EndpointEventsMap<
    InferResponseOutput<TFields>,
    InferRequestOutput<TFields>,
    InferUrlVariablesOutput<TFields>
  >,
> {
  /**
   * Custom test cases to run in addition to (or instead of) example tests
   */
  customTests?: {
    [testName: string]: (
      test: TestRunner<
        TMethod,
        TUserRoleValue,
        TScopedTranslationKey,
        TFields,
        TEvents
      >,
    ) => Promise<void> | void;
  };

  /**
   * Whether to skip automatic tests based on endpoint examples
   * @default false
   */
  skipExampleTests?: boolean;

  /**
   * Timeout in ms for example payload tests (default: vitest default 5000ms)
   * Use for slow endpoints like embedding backfill.
   */
  testTimeout?: number;
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
    AnyChildrenConstrain<TScopedTranslationKey, FieldUsageConfig>
  >,
  TEvents extends EndpointEventsMap<
    InferResponseOutput<TFields>,
    InferRequestOutput<TFields>,
    InferUrlVariablesOutput<TFields>
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
      TFields,
      TEvents
    >["types"]["RequestOutput"];
    urlPathParams: CreateApiEndpoint<
      TMethod,
      TUserRoleValue,
      TScopedTranslationKey,
      TFields,
      TEvents
    >["types"]["UrlVariablesOutput"];
    user: JwtPayloadType;
  }) => Promise<
    ResponseType<
      CreateApiEndpoint<
        TMethod,
        TUserRoleValue,
        TScopedTranslationKey,
        TFields,
        TEvents
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
    TFields,
    TEvents
  >;
}
