import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { describe, expect, it } from "vitest";
import type z from "zod";

import type { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import type { UnifiedField } from "../../../unified-ui/cli/vibe/endpoints/endpoint-types/core/types";
import type { CreateApiEndpoint } from "../../../unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import { sendTestRequest } from "./send-test-request";
import type { TestEndpointOptions, TestRunner } from "./types";

/**
 * Type for example entry
 */
type ExampleEntry<T> = [string, T];

/**
 * Generate tests for an API endpoint based on its examples and configuration
 *
 * @example
 * // Simple usage
 * testEndpoint(myEndpoint, myHandler);
 *
 * @example
 * // With custom tests
 * testEndpoint(myEndpoint, myHandler, {
 *   mockUser: { id: 'user1' },
 *   customTests: {
 *     'should reject invalid data': async (test) => {
 *       const response = await test.executeWith({
 *         data: { invalid: 'data' }
 *       });
 *       expect(response.success).toBe(false);
 *     }
 *   }
 * });
 */
export function testEndpoint<
  TRequestInput,
  TRequestOutput,
  TResponseInput,
  TResponseOutput,
  TUrlVariablesInput,
  TUrlVariablesOutput,
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
  TFields extends UnifiedField<z.ZodTypeAny>,
>(
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
  >,
  options: TestEndpointOptions<
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
  > = {},
): void {
  const { customTests = {}, skipExampleTests = false } = options;

  // eslint-disable-next-line i18next/no-literal-string
  describe(`API: ${endpoint.method} ${endpoint.path.join("/")}`, () => {
    // Create a test runner that can be reused
    const testRunner: TestRunner<
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
    > = {
      endpoint,
      executeWith: async ({ data, urlParams, user }) => {
        return await sendTestRequest<
          TRequestOutput,
          TResponseInput,
          TResponseOutput,
          TUrlVariablesOutput,
          TExampleKey,
          TMethod,
          TUserRoleValue,
          TFields
        >({
          endpoint,
          data,
          urlParams,
          user,
        });
      },
    };

    // Run custom tests if provided
    const customTestEntries = Object.entries(customTests);

    customTestEntries.forEach(([testName, testFn]) => {
      it(testName, async () => {
        await testFn(testRunner);
      });
    });

    // Skip example tests if requested or if there are no examples
    if (skipExampleTests) {
      return;
    }

    // Group tests for payload examples
    const payloads = endpoint.ui.examples.payloads;
    const urlPathVariables = endpoint.examples.urlPathVariables;
    if (payloads) {
      describe("Payload Examples", () => {
        // Test each example payload
        const payloadEntries = Object.entries(
          payloads,
        ) as ExampleEntry<TRequestOutput>[];

        payloadEntries.forEach(([exampleName, payload]) => {
          it(`should handle ${exampleName} example`, async () => {
            const urlParams = urlPathVariables
              ? (urlPathVariables as Record<string, TUrlVariablesOutput>)[
                  exampleName
                ]
              : undefined;

            // Create a default user with permissions for the endpoint
            const defaultUser: JwtPayloadType =
              endpoint.requiresAuthentication()
                ? {
                    isPublic: false,
                    id: "test-user-id",
                  }
                : { isPublic: true };

            const response = await testRunner.executeWith({
              data: payload,
              urlParams: urlParams as TUrlVariablesOutput,
              user: defaultUser,
            });

            // Expect success
            expect(response.success).toBe(true);

            // Validate response data against schema
            if (response.success && response.data) {
              const validation = endpoint.responseSchema.safeParse(
                response.data,
              );
              expect(validation.success).toBe(true);
            }
          });
        });
      });
    }

    // Test with different user roles if endpoint requires authentication
    if (endpoint.requiresAuthentication()) {
      describe("Authentication & Authorization", () => {
        // Test with unauthorized user
        it("should reject unauthorized users", async () => {
          // Create a user with no roles
          const unauthorizedUser: JwtPayloadType = { isPublic: true };

          const exampleKey = payloads
            ? (Object.keys(payloads)[0] as keyof typeof payloads)
            : undefined;
          const response = await testRunner.executeWith({
            data:
              exampleKey && payloads
                ? (payloads[exampleKey] as TRequestOutput)
                : (undefined as TRequestOutput),
            urlParams:
              exampleKey && urlPathVariables
                ? (urlPathVariables[exampleKey] as TUrlVariablesOutput)
                : (undefined as TUrlVariablesOutput),
            user: unauthorizedUser,
          });

          // Expect unauthorized response
          if (response.success) {
            expect(response.success).toBe(false);
          } else {
            expect(response.errorType).toBe(ErrorResponseTypes.AUTH_ERROR);
          }
        });

        // Test with valid roles
        if (endpoint.allowedRoles.length > 0) {
          it("should accept users with valid roles", async () => {
            // Use a user with the first allowed role that's not PUBLIC
            const validRoles = endpoint.allowedRoles.filter(
              (role) => role !== UserRoleValue.PUBLIC,
            );

            if (validRoles.length > 0) {
              // Test is only relevant if there are non-public roles
              const exampleKey = payloads
                ? (Object.keys(payloads)[0] as keyof typeof payloads)
                : undefined;

              // Create an authorized user with the first valid role
              const authorizedUser: JwtPayloadType = {
                isPublic: false,
                id: "authorized-test-user-id",
              };

              const response = await testRunner.executeWith({
                data:
                  exampleKey && payloads
                    ? (payloads[exampleKey] as TRequestOutput)
                    : (undefined as TRequestOutput),
                urlParams:
                  exampleKey && urlPathVariables
                    ? (urlPathVariables[exampleKey] as TUrlVariablesOutput)
                    : (undefined as TUrlVariablesOutput),
                user: authorizedUser,
              });

              // Should succeed with proper authorization
              expect(response.success).toBe(true);
            }
          });
        }
      });
    }
  });
}
