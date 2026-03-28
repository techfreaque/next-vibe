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

import { scopedTranslation as leadsStatsScopedTranslation } from "@/app/api/[locale]/leads/stats/i18n";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { createEndpoint } from "../../endpoints/definition/create";
import {
  objectField,
  objectFieldNew,
  requestField,
  requestResponseField,
} from "../../field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "../../types/enums";

// ============================================================================
// HELPER: All error types for test endpoints
// ============================================================================

const allGlobalErrorTypes = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "app.api.leads.stats.timePeriod.day" as const,
    description: "app.api.leads.stats.timePeriod.week" as const,
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "app.api.leads.stats.timePeriod.month" as const,
    description: "app.api.leads.stats.timePeriod.quarter" as const,
  },
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title: "app.api.leads.stats.timePeriod.year" as const,
    description: "app.api.leads.stats.dateRange.today" as const,
  },
  [EndpointErrorTypes.FORBIDDEN]: {
    title: "app.api.leads.stats.dateRange.yesterday" as const,
    description: "app.api.leads.stats.dateRange.last7Days" as const,
  },
  [EndpointErrorTypes.NOT_FOUND]: {
    title: "app.api.leads.stats.dateRange.last30Days" as const,
    description: "app.api.leads.stats.dateRange.thisWeek" as const,
  },
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "app.api.leads.stats.dateRange.lastWeek" as const,
    description: "app.api.leads.stats.dateRange.thisMonth" as const,
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "app.api.leads.stats.dateRange.lastMonth" as const,
    description: "app.api.leads.stats.dateRange.custom" as const,
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "app.api.leads.stats.timePeriod.hour" as const,
    description: "app.api.leads.stats.dateRange.thisWeek" as const,
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "app.api.leads.stats.dateRange.lastWeek" as const,
    description: "app.api.leads.stats.dateRange.thisMonth" as const,
  },
};

// ============================================================================
// HELPER: Scoped error types (short keys) for leads stats scoped endpoints
// ============================================================================

const allLeadsStatsErrorTypes = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "errors.validation.title" as const,
    description: "errors.validation.description" as const,
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "errors.network.title" as const,
    description: "errors.network.description" as const,
  },
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title: "errors.unauthorized.title" as const,
    description: "errors.unauthorized.description" as const,
  },
  [EndpointErrorTypes.FORBIDDEN]: {
    title: "errors.forbidden.title" as const,
    description: "errors.forbidden.description" as const,
  },
  [EndpointErrorTypes.NOT_FOUND]: {
    title: "errors.notFound.title" as const,
    description: "errors.notFound.description" as const,
  },
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "errors.server.title" as const,
    description: "errors.server.description" as const,
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "errors.unknown.title" as const,
    description: "errors.unknown.description" as const,
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "errors.unsavedChanges.title" as const,
    description: "errors.unsavedChanges.description" as const,
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "errors.conflict.title" as const,
    description: "errors.conflict.description" as const,
  },
};

// ============================================================================
// PART 1: VALID GLOBAL KEYS
// ============================================================================

/**
 * Test 1: Valid scoped keys should be accepted (using leadsStatsScopedTranslation)
 * Uses objectField + requestField for proper type checking.
 */
const globalEndpointValid = createEndpoint({
  scopedTranslation: leadsStatsScopedTranslation,
  method: Methods.POST,
  path: ["test", "global", "valid"],
  title: "timePeriod.day",
  description: "timePeriod.week",
  category: "endpointCategories.leads",
  icon: "check",
  tags: ["tags.leads"] as const,
  allowedRoles: [UserRole.PUBLIC],

  fields: objectField(leadsStatsScopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "container.title",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      name: requestField(leadsStatsScopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "dateRange.today",
        placeholder: "dateRange.yesterday",
        columns: 12,
        schema: z.string(),
      }),
    },
  }),

  examples: {
    requests: { basic: { name: "Test" } },
  },

  errorTypes: allLeadsStatsErrorTypes,

  successTypes: {
    title: "success.title",
    description: "success.description",
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
  description: "app.api.leads.stats.timePeriod.day",
  category: "app.api.leads.stats.timePeriod.week",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectFieldNew({
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {},
  }),
  examples: {},
  errorTypes: allGlobalErrorTypes,
  successTypes: {
    title: "app.api.leads.stats.timePeriod.month",
    description: "app.api.leads.stats.timePeriod.quarter",
  },
});

/**
 * Test 3: Invalid description key should be rejected
 */
const globalEndpointInvalidDescription = createEndpoint({
  method: Methods.POST,
  path: ["test", "global", "invalid", "description"],
  title: "app.api.leads.stats.timePeriod.day",
  // @ts-expect-error - Invalid global key
  description: "invalid.description.key",
  category: "app.api.leads.stats.timePeriod.week",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectFieldNew({
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {},
  }),
  examples: {},
  errorTypes: allGlobalErrorTypes,
  successTypes: {
    title: "app.api.leads.stats.timePeriod.month",
    description: "app.api.leads.stats.timePeriod.quarter",
  },
});

/**
 * Test 4: Invalid category key should be rejected
 */
const globalEndpointInvalidCategory = createEndpoint({
  method: Methods.POST,
  path: ["test", "global", "invalid", "category"],
  title: "app.api.leads.stats.timePeriod.day",
  description: "app.api.leads.stats.timePeriod.week",
  // @ts-expect-error - Invalid global key
  category: "invalid.category.key",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectFieldNew({
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {},
  }),
  examples: {},
  errorTypes: allGlobalErrorTypes,
  successTypes: {
    title: "app.api.leads.stats.timePeriod.month",
    description: "app.api.leads.stats.timePeriod.quarter",
  },
});

/**
 * Test 5: Invalid tag key should be rejected
 */
const globalEndpointInvalidTag = createEndpoint({
  method: Methods.POST,
  path: ["test", "global", "invalid", "tag"],
  title: "app.api.leads.stats.timePeriod.day",
  description: "app.api.leads.stats.timePeriod.week",
  category: "app.api.leads.stats.timePeriod.month",
  icon: "check",
  // @ts-expect-error - Invalid global key in tags
  tags: ["invalid.tag.key"] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectFieldNew({
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {},
  }),
  examples: {},
  errorTypes: allGlobalErrorTypes,
  successTypes: {
    title: "app.api.leads.stats.timePeriod.quarter",
    description: "app.api.leads.stats.timePeriod.year",
  },
});

/**
 * Test 6: Invalid error title key should be rejected
 */
const globalEndpointInvalidErrorTitle = createEndpoint({
  method: Methods.POST,
  path: ["test", "global", "invalid", "error", "title"],
  title: "app.api.leads.stats.timePeriod.day",
  description: "app.api.leads.stats.timePeriod.week",
  category: "app.api.leads.stats.timePeriod.month",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectFieldNew({
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {},
  }),
  examples: {},
  errorTypes: {
    ...allGlobalErrorTypes,
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      // @ts-expect-error - Invalid global key in error title
      title: "invalid.error.title.key",
      description: "app.api.leads.stats.timePeriod.quarter",
    },
  },
  successTypes: {
    title: "app.api.leads.stats.timePeriod.year",
    description: "app.api.leads.stats.dateRange.today",
  },
});

/**
 * Test 7: Invalid success title key should be rejected
 */
const globalEndpointInvalidSuccessTitle = createEndpoint({
  method: Methods.POST,
  path: ["test", "global", "invalid", "success", "title"],
  title: "app.api.leads.stats.timePeriod.day",
  description: "app.api.leads.stats.timePeriod.week",
  category: "app.api.leads.stats.timePeriod.month",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectFieldNew({
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {},
  }),
  examples: {},
  errorTypes: allGlobalErrorTypes,
  successTypes: {
    // @ts-expect-error - Invalid global key in success title
    title: "invalid.success.title.key",
    description: "app.api.leads.stats.timePeriod.quarter",
  },
});

/**
 * Test 8: Invalid field label key should be rejected (using scoped translation)
 * requestField validates against LeadsStatsTranslationKey,
 * so "invalid.field.label.key" is rejected at the property level.
 */
const globalEndpointInvalidFieldLabel = createEndpoint({
  scopedTranslation: leadsStatsScopedTranslation,
  method: Methods.POST,
  path: ["test", "global", "invalid", "field", "label"],
  title: "timePeriod.day",
  description: "timePeriod.week",
  category: "endpointCategories.leads",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(leadsStatsScopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      name: requestField(leadsStatsScopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        // @ts-expect-error - Invalid scoped key in field label
        label: "invalid.field.label.key",
        columns: 12,
        schema: z.string(),
      }),
    },
  }),
  examples: { requests: { basic: { name: "Test" } } },
  errorTypes: allLeadsStatsErrorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

/**
 * Test 8B: Test requestField standalone with invalid label key
 * NOTE: requestField/requestResponseField do NOT enforce translation key validation
 * at the property level when used standalone (inference is too permissive).
 * Key validation happens when assigned to createEndpoint's fields parameter.
 */
const test8b_requestFieldStandalone = requestField({
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.TEXT,
  label: "invalid.field.label.key",
  columns: 12,
  schema: z.string(),
});

/**
 * Test 8C: Test requestResponseField standalone with invalid label key
 * NOTE: requestResponseField DOES enforce key validation at the property level
 * (unlike requestField). This is because it uses FormFieldWidgetConfig which
 * has stricter constraints.
 */
const test8c_requestResponseFieldStandalone = requestResponseField({
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.TEXT,
  // @ts-expect-error - Invalid global key in field label (requestResponseField enforces this)
  label: "invalid.field.label.key",
  columns: 12,
  schema: z.string(),
});

/**
 * Test 8D: Test objectFieldNew standalone with container title key
 * NOTE: objectFieldNew does NOT enforce TranslationKey validation on title at the
 * standalone call site (TKey is inferred as string, not pinned to TranslationKey).
 * Key validation for object containers happens when assigned to createEndpoint's
 * fields parameter. This mirrors the behaviour documented for requestField in 8B.
 */
const test8d_objectFieldStandalone = objectFieldNew({
  type: WidgetType.CONTAINER,
  title: "invalid.container.title.key",
  layoutType: LayoutType.GRID,
  columns: 12,
  usage: { request: "data", response: true },
  children: {},
});

/**
 * Tests 9A/9B/9C: Container title key - standalone objectFieldNew tests.
 *
 * NOTE: objectFieldNew does NOT enforce global TranslationKey on title at the
 * standalone call site. Key validation happens when the result is assigned to
 * createEndpoint's fields parameter (TKey gets pinned to TranslationKey there).
 */
const test9a_invalidContainerTitleStandalone = objectFieldNew({
  type: WidgetType.CONTAINER,
  title: "invalid.container.title.key",
  layoutType: LayoutType.GRID,
  columns: 12,
  usage: { request: "data", response: true },
  children: {},
});

const test9b_invalidContainerTitle = objectFieldNew({
  type: WidgetType.CONTAINER,
  title: "invalid.container.title.key",
  layoutType: LayoutType.GRID,
  columns: 12,
  usage: { request: "data", response: true },
  children: {},
});

const test9c_invalidContainerTitle = objectFieldNew({
  type: WidgetType.CONTAINER,
  title: "invalid.container.title.key",
  layoutType: LayoutType.GRID,
  columns: 12,
  usage: { request: "data", response: true },
  children: {},
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
  description: "app.api.leads.stats.timePeriod.day",
  category: "app.api.leads.stats.timePeriod.week",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectFieldNew({
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {},
  }),
  examples: {},
  errorTypes: allGlobalErrorTypes,
  successTypes: {
    title: "app.api.leads.stats.timePeriod.month",
    description: "app.api.leads.stats.timePeriod.quarter",
  },
});
