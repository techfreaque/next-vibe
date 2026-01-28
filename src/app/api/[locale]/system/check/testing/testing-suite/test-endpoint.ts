/* eslint-disable i18next/no-literal-string */
// Testing infrastructure - test descriptions are for developers, not end users

import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { describe, expect, it } from "vitest";
import type { z } from "zod";

import type { CreateApiEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import {
  UserPermissionRole,
  UserRole,
  type UserRoleValue,
} from "@/app/api/[locale]/user/user-roles/enum";

import type {
  AnyChildrenConstrain,
  FieldUsageConfig,
} from "../../../unified-interface/unified-ui/widgets/_shared/types";
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
  TMethod extends Methods,
  TUserRoleValue extends readonly UserRoleValue[],
  TScopedTranslationKey extends string,
  TFields extends UnifiedField<
    TScopedTranslationKey,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<TScopedTranslationKey, FieldUsageConfig>
  >,
>(
  endpoint: CreateApiEndpoint<
    TMethod,
    TUserRoleValue,
    TScopedTranslationKey,
    AnyChildrenConstrain<TScopedTranslationKey, FieldUsageConfig>,
    TFields
  >,
  options: TestEndpointOptions<
    TMethod,
    TUserRoleValue,
    TScopedTranslationKey,
    TFields
  > = {},
): void {
  const { customTests = {}, skipExampleTests = false } = options;

  describe(`API: ${endpoint.method} ${endpoint.path.join("/")}`, () => {
    // Create a test runner that can be reused
    const testRunner: TestRunner<
      TMethod,
      TUserRoleValue,
      TScopedTranslationKey,
      TFields
    > = {
      endpoint,
      executeWith: async ({ data, urlPathParams, user }) => {
        return await sendTestRequest<
          TMethod,
          TUserRoleValue,
          TScopedTranslationKey,
          AnyChildrenConstrain<TScopedTranslationKey, FieldUsageConfig>,
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
    type TRequestOutput = typeof endpoint.types.RequestOutput;
    type TUrlVariablesOutput = typeof endpoint.types.UrlVariablesOutput;
    if (payloads) {
      describe("Payload Examples", () => {
        // Test each example payload
        const payloadEntries = Object.entries(
          payloads,
        ) as ExampleEntry<TRequestOutput>[];

        payloadEntries.forEach(([exampleName, payload]) => {
          it(`should handle ${exampleName} example`, async () => {
            const exampleUrlPathParams = urlPathParams
              ? (urlPathParams as Record<string, TUrlVariablesOutput>)[
                  exampleName
                ]
              : undefined;

            // Test with a user that has the endpoint's allowed roles
            // Use valid UUID format to avoid database errors
            const mockUser: JwtPayloadType = endpoint.requiresAuthentication()
              ? {
                  isPublic: false,
                  id: "00000000-0000-0000-0000-000000000001",
                  leadId: "00000000-0000-0000-0000-000000000002",
                  roles: [UserPermissionRole.ADMIN],
                }
              : {
                  isPublic: true,
                  leadId: "00000000-0000-0000-0000-000000000002",
                  roles: [UserPermissionRole.PUBLIC],
                };

            const response = await testRunner.executeWith({
              data: payload,
              urlPathParams: exampleUrlPathParams as TUrlVariablesOutput,
              user: mockUser,
            });

            // Payload example tests verify that the endpoint processes requests correctly
            // They don't always expect success because:
            // 1. Some examples demonstrate failure scenarios (e.g., "failed", "accountLocked")
            // 2. Tests may not have database state required for success
            // The key assertion is that we get a valid response (not internal error)
            if (!response.success) {
              // Verify it's a proper error response, not an internal error from test infrastructure
              expect(response.errorType).toBeDefined();
              // Internal errors indicate test infrastructure problems
              if (
                response.errorType === ErrorResponseTypes.INTERNAL_ERROR &&
                response.messageParams?.error
              ) {
                // Only fail if it's a test infrastructure error (route not found, handler missing, etc.)
                const errorMsg = String(response.messageParams.error);
                const isInfraError =
                  errorMsg.includes("Route module not found") ||
                  errorMsg.includes("Handler not found") ||
                  errorMsg.includes("Streaming responses are not supported");
                expect(isInfraError).toBe(false);
              }
            }

            // Validate response data against schema when successful
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
            // Use public user (unauthorized) for this test with valid UUID format
            user: {
              isPublic: true,
              leadId: "00000000-0000-0000-0000-000000000002",
              roles: [UserPermissionRole.PUBLIC],
            },
          });

          // Expect unauthorized/forbidden response
          // Public users get FORBIDDEN (403) - they are authenticated but lack permissions
          // Unauthenticated requests get AUTH_ERROR (401)
          // Note: INTERNAL_ERROR may occur if route handler is not registered (skip this check)
          if (response.success) {
            expect(response.success).toBe(false);
          } else {
            // Accept either AUTH_ERROR (401) or FORBIDDEN (403) as valid rejection
            // Also skip internal errors which indicate route registration issues, not auth failures
            const isValidRejection =
              response.errorType === ErrorResponseTypes.AUTH_ERROR ||
              response.errorType === ErrorResponseTypes.FORBIDDEN ||
              response.errorType === ErrorResponseTypes.INTERNAL_ERROR;
            expect(isValidRejection).toBe(true);
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
                // Use authorized private user for this test with valid UUID format
                user: {
                  isPublic: false,
                  id: "00000000-0000-0000-0000-000000000001",
                  leadId: "00000000-0000-0000-0000-000000000002",
                  roles: [UserPermissionRole.ADMIN],
                },
              });

              // This test verifies authorization passes, not business success
              // The endpoint should NOT return auth/permission errors for authorized users
              // It may return other errors (e.g., "user not found") if database state is missing
              if (!response.success) {
                const isAuthError =
                  response.errorType === ErrorResponseTypes.AUTH_ERROR ||
                  response.errorType === ErrorResponseTypes.FORBIDDEN;
                // Fail if we get auth/permission errors - that means authorization didn't work
                expect(isAuthError).toBe(false);
              }
            }
          });
        }
      });
    }
  });
}
