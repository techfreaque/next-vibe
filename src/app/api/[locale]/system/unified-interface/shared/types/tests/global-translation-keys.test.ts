/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-function */
/**
 * Global Translation Keys Type Tests
 *
 * Tests that global TranslationKey validation works correctly:
 * 1. Valid global keys are accepted
 * 2. Invalid keys are rejected when translationsKeyTypesafety = true
 * 3. Scoped keys are rejected when no scopedTranslation is provided
 *
 * These are COMPILE-TIME tests - they fail during typecheck if types break.
 */

import { z } from "zod";

import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

import { createEndpoint } from "../../endpoints/definition/create";
import {
  objectField,
  requestDataField,
  requestResponseField,
} from "../../field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "../../types/enums";
import type { UnifiedField } from "../endpoint";

// ============================================================================
// HELPER: All error types for test endpoints
// ============================================================================

const allGlobalErrorTypes = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "app.api.shared.stats.timePeriod.day" as const,
    description: "app.api.shared.stats.timePeriod.week" as const,
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "app.api.shared.stats.timePeriod.month" as const,
    description: "app.api.shared.stats.timePeriod.quarter" as const,
  },
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title: "app.api.shared.stats.timePeriod.year" as const,
    description: "app.api.shared.stats.dateRange.today" as const,
  },
  [EndpointErrorTypes.FORBIDDEN]: {
    title: "app.api.shared.stats.dateRange.yesterday" as const,
    description: "app.api.shared.stats.dateRange.last7Days" as const,
  },
  [EndpointErrorTypes.NOT_FOUND]: {
    title: "app.api.shared.stats.dateRange.last30Days" as const,
    description: "app.api.shared.stats.dateRange.thisWeek" as const,
  },
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "app.api.shared.stats.dateRange.lastWeek" as const,
    description: "app.api.shared.stats.dateRange.thisMonth" as const,
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "app.api.shared.stats.dateRange.lastMonth" as const,
    description: "app.api.shared.stats.dateRange.custom" as const,
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "app.api.shared.stats.chartType.line" as const,
    description: "app.api.shared.stats.chartType.bar" as const,
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "app.api.shared.stats.chartType.area" as const,
    description: "app.api.shared.stats.chartType.pie" as const,
  },
};

// ============================================================================
// PART 1: VALID GLOBAL KEYS
// ============================================================================

/**
 * Test 1: Valid global keys should be accepted
 */
const globalEndpointValid = createEndpoint({
  method: Methods.POST,
  path: ["test", "global", "valid"],
  title: "app.api.shared.stats.timePeriod.day",
  description: "app.api.shared.stats.timePeriod.week",
  category: "app.api.shared.stats.timePeriod.month",
  icon: "check",
  tags: ["app.api.shared.stats.timePeriod.quarter"] as const,
  allowedRoles: [UserRole.PUBLIC],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.shared.stats.timePeriod.year",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      name: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.shared.stats.dateRange.today",
          placeholder: "app.api.shared.stats.dateRange.yesterday",
          columns: 12,
        },
        z.string(),
      ),
    },
  ),

  examples: {
    requests: { basic: { name: "Test" } },
    responses: { basic: {} },
  },

  errorTypes: allGlobalErrorTypes,

  successTypes: {
    title: "app.api.shared.stats.dateRange.last7Days",
    description: "app.api.shared.stats.dateRange.last30Days",
  },
});

// ============================================================================
// PART 2: INVALID GLOBAL KEYS (when translationsKeyTypesafety = true)
// ============================================================================

/**
 * Test 2: Invalid title key should be rejected
 */
const globalEndpointInvalidTitle = createEndpoint({
  method: Methods.POST,
  path: ["test", "global", "invalid", "title"],
  // @ts-expect-error - Invalid global key
  title: "this.key.does.not.exist.in.global.translations",
  description: "app.api.shared.stats.timePeriod.day",
  category: "app.api.shared.stats.timePeriod.week",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(
    { type: WidgetType.CONTAINER, layoutType: LayoutType.GRID, columns: 12 },
    { request: "data", response: true },
    {},
  ),
  examples: { requests: {}, responses: {} },
  errorTypes: allGlobalErrorTypes,
  successTypes: {
    title: "app.api.shared.stats.timePeriod.month",
    description: "app.api.shared.stats.timePeriod.quarter",
  },
});

/**
 * Test 3: Invalid description key should be rejected
 */
const globalEndpointInvalidDescription = createEndpoint({
  method: Methods.POST,
  path: ["test", "global", "invalid", "description"],
  title: "app.api.shared.stats.timePeriod.day",
  // @ts-expect-error - Invalid global key
  description: "invalid.description.key",
  category: "app.api.shared.stats.timePeriod.week",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(
    { type: WidgetType.CONTAINER, layoutType: LayoutType.GRID, columns: 12 },
    { request: "data", response: true },
    {},
  ),
  examples: { requests: {}, responses: {} },
  errorTypes: allGlobalErrorTypes,
  successTypes: {
    title: "app.api.shared.stats.timePeriod.month",
    description: "app.api.shared.stats.timePeriod.quarter",
  },
});

/**
 * Test 4: Invalid category key should be rejected
 */
const globalEndpointInvalidCategory = createEndpoint({
  method: Methods.POST,
  path: ["test", "global", "invalid", "category"],
  title: "app.api.shared.stats.timePeriod.day",
  description: "app.api.shared.stats.timePeriod.week",
  // @ts-expect-error - Invalid global key
  category: "invalid.category.key",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(
    { type: WidgetType.CONTAINER, layoutType: LayoutType.GRID, columns: 12 },
    { request: "data", response: true },
    {},
  ),
  examples: { requests: {}, responses: {} },
  errorTypes: allGlobalErrorTypes,
  successTypes: {
    title: "app.api.shared.stats.timePeriod.month",
    description: "app.api.shared.stats.timePeriod.quarter",
  },
});

/**
 * Test 5: Invalid tag key should be rejected
 */
const globalEndpointInvalidTag = createEndpoint({
  method: Methods.POST,
  path: ["test", "global", "invalid", "tag"],
  title: "app.api.shared.stats.timePeriod.day",
  description: "app.api.shared.stats.timePeriod.week",
  category: "app.api.shared.stats.timePeriod.month",
  icon: "check",
  // @ts-expect-error - Invalid global key in tags
  tags: ["invalid.tag.key"] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(
    { type: WidgetType.CONTAINER, layoutType: LayoutType.GRID, columns: 12 },
    { request: "data", response: true },
    {},
  ),
  examples: { requests: {}, responses: {} },
  errorTypes: allGlobalErrorTypes,
  successTypes: {
    title: "app.api.shared.stats.timePeriod.quarter",
    description: "app.api.shared.stats.timePeriod.year",
  },
});

/**
 * Test 6: Invalid error title key should be rejected
 */
const globalEndpointInvalidErrorTitle = createEndpoint({
  method: Methods.POST,
  path: ["test", "global", "invalid", "error", "title"],
  title: "app.api.shared.stats.timePeriod.day",
  description: "app.api.shared.stats.timePeriod.week",
  category: "app.api.shared.stats.timePeriod.month",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(
    { type: WidgetType.CONTAINER, layoutType: LayoutType.GRID, columns: 12 },
    { request: "data", response: true },
    {},
  ),
  examples: { requests: {}, responses: {} },
  errorTypes: {
    ...allGlobalErrorTypes,
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      // @ts-expect-error - Invalid global key in error title
      title: "invalid.error.title.key",
      description: "app.api.shared.stats.timePeriod.quarter",
    },
  },
  successTypes: {
    title: "app.api.shared.stats.timePeriod.year",
    description: "app.api.shared.stats.dateRange.today",
  },
});

/**
 * Test 7: Invalid success title key should be rejected
 */
const globalEndpointInvalidSuccessTitle = createEndpoint({
  method: Methods.POST,
  path: ["test", "global", "invalid", "success", "title"],
  title: "app.api.shared.stats.timePeriod.day",
  description: "app.api.shared.stats.timePeriod.week",
  category: "app.api.shared.stats.timePeriod.month",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(
    { type: WidgetType.CONTAINER, layoutType: LayoutType.GRID, columns: 12 },
    { request: "data", response: true },
    {},
  ),
  examples: { requests: {}, responses: {} },
  errorTypes: allGlobalErrorTypes,
  successTypes: {
    // @ts-expect-error - Invalid global key in success title
    title: "invalid.success.title.key",
    description: "app.api.shared.stats.timePeriod.quarter",
  },
});

/**
 * Test 8: Invalid field label key should be rejected
 */
const globalEndpointInvalidFieldLabel = createEndpoint({
  method: Methods.POST,
  path: ["test", "global", "invalid", "field", "label"],
  title: "app.api.shared.stats.timePeriod.day",
  description: "app.api.shared.stats.timePeriod.week",
  category: "app.api.shared.stats.timePeriod.month",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(
    { type: WidgetType.CONTAINER, layoutType: LayoutType.GRID, columns: 12 },
    { request: "data", response: true },
    {
      name: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          // @ts-expect-error - Invalid global key in field label
          label: "invalid.field.label.key",
          columns: 12,
        },
        z.string(),
      ),
    },
  ),
  examples: { requests: { basic: { name: "Test" } }, responses: { basic: {} } },
  errorTypes: allGlobalErrorTypes,
  successTypes: {
    title: "app.common.refresh",
    description: "app.common.required",
  },
});

/**
 * Test 8B: Test requestDataField standalone with contextual typing
 */
const test8b_requestDataFieldStandalone: UnifiedField<
  TranslationKey,
  z.ZodTypeAny
> = requestDataField(
  {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    // @ts-expect-error - Invalid global key in field label
    label: "invalid.field.label.key",
    columns: 12,
  },
  z.string(),
);

/**
 * Test 8C: Test requestResponseField standalone with contextual typing
 */
const test8c_requestResponseFieldStandalone: UnifiedField<
  TranslationKey,
  z.ZodTypeAny
> = requestResponseField(
  {
    type: WidgetType.FORM_FIELD,
    fieldType: FieldDataType.TEXT,
    // @ts-expect-error - Invalid global key in field label
    label: "invalid.field.label.key",
    columns: 12,
  },
  z.string(),
);

/**
 * Test 8D: Test objectField standalone with contextual typing
 */
const test8d_objectFieldStandalone: UnifiedField<TranslationKey, z.ZodTypeAny> =
  objectField(
    {
      type: WidgetType.CONTAINER,
      // @ts-expect-error - Invalid global key in container title
      title: "invalid.container.title.key",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {},
  );

/**
 * Test 9A: Invalid container title key should be rejected (without children)
 */
const globalEndpointInvalidContainerTitleSimple = createEndpoint({
  method: Methods.POST,
  path: ["test", "global", "invalid", "container", "title", "simple"],
  title: "app.common.active",
  description: "app.common.filter",
  category: "app.common.cancel",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      // @ts-expect-error - Invalid global key in container title
      title: "invalid.container.title.key",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      name: requestResponseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.shared.stats.timePeriod.quarter",
          columns: 12,
        },
        z.string(),
      ),
      name2: requestResponseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          // @ts-expect-error - Invalid global key in field label
          label: "another.non.existent.key",
          columns: 12,
        },
        z.string(),
      ),
    },
  ),
  examples: {
    requests: { basic: { name: "Test", name2: "Test" } },
    responses: { basic: { name: "Test", name2: "Test" } },
  },
  errorTypes: allGlobalErrorTypes,
  successTypes: {
    title: "app.common.refresh",
    description: "app.common.required",
  },
});

/**
 * Test 9B: Invalid container title key should be rejected (with children)
 */
const test9b_invalidContainerTitle: UnifiedField<TranslationKey, z.ZodTypeAny> =
  objectField(
    {
      type: WidgetType.CONTAINER,
      // @ts-expect-error - Invalid global key in container title
      title: "invalid.container.title.key",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {},
  );

/**
 * Test 9B: Invalid container title key should be rejected (with children)
 */
const globalEndpointInvalidContainerTitle12 = createEndpoint({
  method: Methods.POST,
  path: ["test", "global", "invalid", "container", "title"],
  title: "app.common.active",
  description: "app.common.filter",
  category: "app.common.cancel",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      // @ts-expect-error - Invalid global key in container title
      title: "invalid.container.title.key",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      name: requestResponseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.shared.stats.timePeriod.quarter",
          columns: 12,
        },
        z.string(),
      ),
    },
  ),
  examples: {
    requests: { basic: { name: "Test" } },
    responses: { basic: { name: "Test" } },
  },
  errorTypes: allGlobalErrorTypes,
  successTypes: {
    title: "app.api.shared.stats.timePeriod.quarter",
    description: "app.api.shared.stats.timePeriod.year",
  },
});

/**
 * Test 9C: Invalid container title key should be rejected (with children)
 */
const test9c_invalidContainerTitle = createEndpoint({
  method: Methods.POST,
  path: ["test", "global", "invalid", "container", "title"],
  title: "app.common.active",
  description: "app.common.filter",
  category: "app.common.cancel",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: requestResponseField(
    {
      type: WidgetType.CONTAINER,
      // @ts-expect-error - Invalid global key in container title
      title: "invalid.container.title.key",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    z.string(),
  ),
  examples: {
    requests: { basic: "Test" },
    responses: { basic: "Test" },
  },
  errorTypes: allGlobalErrorTypes,
  successTypes: {
    title: "app.api.shared.stats.timePeriod.quarter",
    description: "app.api.shared.stats.timePeriod.year",
  },
});

const globalEndpointInvalidContainerTitle = createEndpoint({
  method: Methods.POST,
  path: ["test", "global", "invalid", "container", "title"],
  title: "app.common.active",
  description: "app.common.filter",
  category: "app.common.cancel",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      // @ts-expect-error - Invalid global key in container title
      title: "invalid.container.title.key",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      name: objectField(
        {
          type: WidgetType.CONTAINER,
          // @ts-expect-error - Invalid global key in container title
          title: "invalid.container.title.key",
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { request: "data", response: true },
        {
          firstName: requestResponseField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.shared.stats.timePeriod.quarter",
              columns: 12,
            },
            z.string(),
          ),
        },
      ),
    },
  ),
  examples: {
    requests: { basic: { name: { firstName: "Test" } } },
    responses: { basic: { name: { firstName: "Test" } } },
  },
  errorTypes: allGlobalErrorTypes,
  successTypes: {
    title: "app.api.shared.stats.timePeriod.quarter",
    description: "app.api.shared.stats.timePeriod.year",
  },
});

// ============================================================================
// PART 3: SCOPED KEYS REJECTED WITHOUT scopedTranslation
// ============================================================================

/**
 * Test 10: Scoped keys should be rejected when no scopedTranslation is provided
 */
const globalEndpointRejectsScopedKey = createEndpoint({
  method: Methods.POST,
  path: ["test", "global", "rejects", "scoped"],
  // @ts-expect-error - Scoped key without scopedTranslation should fail
  title: "title",
  description: "app.api.shared.stats.timePeriod.day",
  category: "app.api.shared.stats.timePeriod.week",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(
    { type: WidgetType.CONTAINER, layoutType: LayoutType.GRID, columns: 12 },
    { request: "data", response: true },
    {},
  ),
  examples: { requests: {}, responses: {} },
  errorTypes: allGlobalErrorTypes,
  successTypes: {
    title: "app.api.shared.stats.timePeriod.month",
    description: "app.api.shared.stats.timePeriod.quarter",
  },
});
