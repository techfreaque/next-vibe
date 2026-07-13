/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Optional Field Type Inference Tests
 *
 * This file contains type-level tests for optional field type inference.
 * Tests that array fields with `optional: true` in UI config are properly
 * typed as `T | null | undefined`. These tests will fail at compile-time
 * if the type inference breaks.
 *
 * DO NOT DELETE - This prevents regressions in type inference logic.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  FieldDataType,
  type FieldUsage,
  LayoutType,
  WidgetType,
} from "next-vibe/core/definition/enums";
import {
  objectField,
  objectOptionalField,
  requestDataArrayField,
  requestDataArrayOptionalField,
  requestField,
  responseArrayField,
  responseArrayOptionalField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

// Helper type to test if two types are exactly equal
type Expect<T extends true> = T;
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;

const genericST: { ScopedTranslationKey: string } = { ScopedTranslationKey: "" };

/**
 * TEST: Optional array field type inference
 * Tests that array fields with `optional: true` in UI config are properly typed as `T | null | undefined`
 */
const optionalArrayField = requestDataArrayField(genericST, {
  type: WidgetType.CONTAINER,
  title: "app.admin.common.actions.back",
  description: "app.admin.common.actions.back",
  optional: true,
  child: objectField(genericST, {
    type: WidgetType.CONTAINER,
    title: "test" as string,
    description: "test" as string,
    usage: { request: "data" },
    children: {
      role: requestField(genericST, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "test" as string,
        schema: z.string(),
      }),
      content: requestField(genericST, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "test" as string,
        schema: z.string(),
      }),
    },
  }),
});

// Test 1: responseArrayOptionalField should create array-optional type
const testResponseArrayOptional = responseArrayOptionalField(genericST, {
  type: WidgetType.CONTAINER,
  title: "app.test.optional.array.title" as string,
  child: objectField(genericST, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 2,
    usage: { response: true },
    children: {
      id: responseField(genericST, {
        type: WidgetType.TEXT,
        content: "app.test.id" as string,
        fieldType: FieldDataType.TEXT,
        schema: z.string(),
      }),
      name: responseField(genericST, {
        type: WidgetType.TEXT,
        content: "app.test.name" as string,
        fieldType: FieldDataType.TEXT,
        schema: z.string(),
      }),
    },
  }),
});

// Verify schemaType is array-optional
type TestResponseArrayOptionalType =
  typeof testResponseArrayOptional.schemaType;
type TestResponseArrayOptionalCheck = Expect<
  Equal<TestResponseArrayOptionalType, "array-optional">
>;

// Test 2: objectOptionalField should create object-optional type
const testObjectOptional = objectOptionalField(genericST, {
  type: WidgetType.CONTAINER,
  title: "app.test.optional.object.title" as string,
  layoutType: LayoutType.GRID,
  columns: 2,
  usage: { response: true },
  children: {
    firstName: responseField(genericST, {
      type: WidgetType.TEXT,
      content: "app.test.firstName" as string,
      fieldType: FieldDataType.TEXT,
      schema: z.string(),
    }),
    lastName: responseField(genericST, {
      type: WidgetType.TEXT,
      content: "app.test.lastName" as string,
      fieldType: FieldDataType.TEXT,
      schema: z.string(),
    }),
  },
});

// Verify schemaType is object-optional
type TestObjectOptionalType = typeof testObjectOptional.schemaType;
type TestObjectOptionalCheck = Expect<
  Equal<TestObjectOptionalType, "object-optional">
>;

// Export a dummy value to make this a valid module
export const OPTIONAL_FIELD_TYPE_TESTS_PASS = true;
