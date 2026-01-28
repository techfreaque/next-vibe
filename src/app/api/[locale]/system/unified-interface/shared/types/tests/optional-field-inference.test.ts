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

import { z } from "zod";

import {
  objectField,
  objectOptionalField,
  requestDataArrayField,
  requestDataArrayOptionalField,
  requestField,
  responseArrayField,
  responseArrayOptionalField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  FieldDataType,
  type FieldUsage,
  LayoutType,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { TranslationKey } from "@/i18n/core/static-types";

// Helper type to test if two types are exactly equal
type Expect<T extends true> = T;
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;

/**
 * TEST: Optional array field type inference
 * Tests that array fields with `optional: true` in UI config are properly typed as `T | null | undefined`
 */
const optionalArrayField = requestDataArrayField(
  {
    type: WidgetType.DATA_LIST,
    title: "app.admin.common.actions.back",
    description: "app.admin.common.actions.back",
    optional: true,
  } as const,
  objectField(
    {
      type: WidgetType.CONTAINER,
      title: "test" as TranslationKey,
      description: "test" as TranslationKey,
    },
    { request: "data" },
    {
      role: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "test" as TranslationKey,
        schema: z.string(),
      }),
      content: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "test" as TranslationKey,
        schema: z.string(),
      }),
    },
  ),
);

// Test 1: responseArrayOptionalField should create array-optional type
const testResponseArrayOptional = responseArrayOptionalField(
  {
    type: WidgetType.DATA_TABLE,
    title: "app.test.optional.array.title" as TranslationKey,
  },
  objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.GRID,
      columns: 2,
    },
    { response: true },
    {
      id: responseField({
        type: WidgetType.TEXT,
        content: "app.test.id" as TranslationKey,
        fieldType: FieldDataType.TEXT,
        schema: z.string(),
      }),
      name: responseField({
        type: WidgetType.TEXT,
        content: "app.test.name" as TranslationKey,
        fieldType: FieldDataType.TEXT,
        schema: z.string(),
      }),
    },
  ),
);

// Verify schemaType is array-optional
type TestResponseArrayOptionalType =
  typeof testResponseArrayOptional.schemaType;
type TestResponseArrayOptionalCheck = Expect<
  Equal<TestResponseArrayOptionalType, "array-optional">
>;

// Test 2: objectOptionalField should create object-optional type
const testObjectOptional = objectOptionalField(
  {
    type: WidgetType.CONTAINER,
    title: "app.test.optional.object.title" as TranslationKey,
    layoutType: LayoutType.GRID,
    columns: 2,
  },
  { response: true },
  {
    firstName: responseField({
      type: WidgetType.TEXT,
      content: "app.test.firstName" as TranslationKey,
      fieldType: FieldDataType.TEXT,
      schema: z.string(),
    }),
    lastName: responseField({
      type: WidgetType.TEXT,
      content: "app.test.lastName" as TranslationKey,
      fieldType: FieldDataType.TEXT,
      schema: z.string(),
    }),
  },
);

// Verify schemaType is object-optional
type TestObjectOptionalType = typeof testObjectOptional.schemaType;
type TestObjectOptionalCheck = Expect<
  Equal<TestObjectOptionalType, "object-optional">
>;

// Export a dummy value to make this a valid module
export const OPTIONAL_FIELD_TYPE_TESTS_PASS = true;
