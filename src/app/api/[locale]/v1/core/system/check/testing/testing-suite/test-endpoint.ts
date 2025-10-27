/* eslint-disable i18next/no-literal-string */
// Testing infrastructure - test descriptions are for developers, not end users

import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { describe, expect, it } from "vitest";
import type z from "zod";

import type { CreateApiEndpoint } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-endpoint";
import type { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import type { UnifiedField } from "@/app/api/[locale]/v1/core/system/unified-ui/shared/types";
import {
  UserRole,
  type UserRoleValue,
} from "@/app/api/[locale]/v1/core/user/user-roles/enum";

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
      executeWith: async ({ data, urlPathParams, user }) => {
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
          urlPathParams,
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
    const payloads = endpoint.examples.requests;
    const urlPathParams = endpoint.examples.urlPathParams;
    if (payloads) {
      describe("Payload Examples", () => {
        // Test each example payload
        const payloadEntries = Object.entries(
          payloads,
        ) as ExampleEntry<TRequestOutput>[];

        payloadEntries.forEach(([exampleName, payload]) => {
          it(`should handle ${exampleName} example`, async () => {
            const urlPathParams = urlPathParams
              ? (urlPathParams as Record<string, TUrlVariablesOutput>)[
                  exampleName
                ]
              : undefined;

            // Test with a user that has the endpoint's allowed roles
            const response = await testRunner.executeWith({
              data: payload,
              urlPathParams: urlPathParams as TUrlVariablesOutput,
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
          const exampleKey = payloads
            ? (Object.keys(payloads)[0] as keyof typeof payloads)
            : undefined;
          const response = await testRunner.executeWith({
            data:
              exampleKey && payloads
                ? (payloads[exampleKey] as TRequestOutput)
                : (undefined as TRequestOutput),
            urlPathParams:
              exampleKey && urlPathParams
                ? (urlPathParams[exampleKey] as TUrlVariablesOutput)
                : (undefined as TUrlVariablesOutput),
            // Use public user (unauthorized) for this test
            user: {
              isPublic: true,
              leadId: "test-lead-id",
            },
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
              (role) => role !== UserRole.PUBLIC,
            );

            if (validRoles.length > 0) {
              // Test is only relevant if there are non-public roles
              const exampleKey = payloads
                ? (Object.keys(payloads)[0] as keyof typeof payloads)
                : undefined;

              const response = await testRunner.executeWith({
                data:
                  exampleKey && payloads
                    ? (payloads[exampleKey] as TRequestOutput)
                    : (undefined as TRequestOutput),
                urlPathParams:
                  exampleKey && urlPathParams
                    ? (urlPathParams[exampleKey] as TUrlVariablesOutput)
                    : (undefined as TUrlVariablesOutput),
                // Use authorized private user for this test
                user: {
                  isPublic: false,
                  id: "authorized-test-user-id",
                  leadId: "test-lead-id",
                },
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
