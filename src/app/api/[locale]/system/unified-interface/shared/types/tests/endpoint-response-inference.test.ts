/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Endpoint Response Type Inference Tests
 *
 * This file contains type-level tests to ensure response types are properly
 * inferred from endpoint definitions. These tests will fail at compile-time
 * if the type inference breaks.
 *
 * DO NOT DELETE - This prevents regressions in type inference logic.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

// Helper type to test if two types are exactly equal
type Expect<T extends true> = T;
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

/**
 * INTEGRATION TEST: Test actual endpoint creation
 */
const testPublicEndpoint = createEndpoint({
  method: Methods.GET,
  path: ["test"],
  title: "test" as any,
  description: "test" as any,
  category: "test" as any,
  icon: "test-tube",
  tags: [],
  allowedRoles: [UserRole.PUBLIC] as const,
  fields: objectField({ type: WidgetType.CONTAINER, layoutType: LayoutType.STACKED }, {}, {}),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "test" as any,
      description: "test" as any,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "test" as any,
      description: "test" as any,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "test" as any,
      description: "test" as any,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "test" as any,
      description: "test" as any,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "test" as any,
      description: "test" as any,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "test" as any,
      description: "test" as any,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "test" as any,
      description: "test" as any,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "test" as any,
      description: "test" as any,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "test" as any,
      description: "test" as any,
    },
  },
  successTypes: { title: "test" as any, description: "test" as any },
  examples: {
    requests: undefined,
    urlPathParams: undefined,
    responses: undefined,
  },
});

const testAdminEndpoint = createEndpoint({
  method: Methods.GET,
  path: ["test"],
  title: "test" as any,
  description: "test" as any,
  category: "test" as any,
  icon: "test-tube",
  tags: [],
  allowedRoles: [UserRole.ADMIN] as const,
  fields: objectField({ type: WidgetType.CONTAINER, layoutType: LayoutType.STACKED }, {}, {}),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "test" as any,
      description: "test" as any,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "test" as any,
      description: "test" as any,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "test" as any,
      description: "test" as any,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "test" as any,
      description: "test" as any,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "test" as any,
      description: "test" as any,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "test" as any,
      description: "test" as any,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "test" as any,
      description: "test" as any,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "test" as any,
      description: "test" as any,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "test" as any,
      description: "test" as any,
    },
  },
  successTypes: { title: "test" as any, description: "test" as any },
  examples: {
    requests: undefined,
    urlPathParams: undefined,
    responses: undefined,
  },
});

// Check what allowedRoles type is preserved as
type PublicEndpointRoles = (typeof testPublicEndpoint.GET)["allowedRoles"];
type AdminEndpointRoles = (typeof testAdminEndpoint.GET)["allowedRoles"];

// These should be readonly [typeof UserRole.PUBLIC] and readonly [typeof UserRole.ADMIN] respectively
type PublicRolesCheck = PublicEndpointRoles extends readonly [typeof UserRole.PUBLIC]
  ? true
  : false;
type AdminRolesCheck = AdminEndpointRoles extends readonly [typeof UserRole.ADMIN] ? true : false;

/**
 * RESPONSE TYPE INFERENCE TESTS
 * Test that response types are properly inferred from definitions
 */
const testResponseEndpoint = createEndpoint({
  method: Methods.GET,
  path: ["test", "response"],
  title: "test" as any,
  description: "test" as any,
  category: "test" as any,
  icon: "test-tube",
  tags: [],
  allowedRoles: [UserRole.PUBLIC] as const,
  fields: objectField(
    { type: WidgetType.CONTAINER, layoutType: LayoutType.STACKED },
    { response: true },
    {
      userId: responseField(
        { type: WidgetType.TEXT, content: "test" as TranslationKey },
        z.string(),
      ),
      count: responseField(
        { type: WidgetType.TEXT, content: "test" as TranslationKey },
        z.coerce.number(),
      ),
    },
  ),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "test" as any,
      description: "test" as any,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "test" as any,
      description: "test" as any,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "test" as any,
      description: "test" as any,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "test" as any,
      description: "test" as any,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "test" as any,
      description: "test" as any,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "test" as any,
      description: "test" as any,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "test" as any,
      description: "test" as any,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "test" as any,
      description: "test" as any,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "test" as any,
      description: "test" as any,
    },
  },
  successTypes: { title: "test" as any, description: "test" as any },
  examples: {
    requests: undefined,
    urlPathParams: undefined,
    responses: {
      default: { userId: "test-user-id", count: 42 },
    },
  },
});

type TestResponseType = (typeof testResponseEndpoint.GET)["types"]["ResponseOutput"];

// The response type should be: { userId: string; count: number }
interface ExpectedResponseType {
  userId: string;
  count: number;
}
type ResponseTypeCheck = Expect<Equal<TestResponseType, ExpectedResponseType>>;

// Export a dummy value to make this a valid module
export const ENDPOINT_RESPONSE_TYPE_TESTS_PASS = true;
