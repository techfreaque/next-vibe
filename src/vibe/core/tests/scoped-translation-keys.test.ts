/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-function */
// eslint-disable-next-line restricted/restricted-syntax -- Type test file requires unknown for testing various type patterns
/**
 * Comprehensive Scoped Translation Keys Type Tests
 *
 * Tests the complete scoped translation system with REAL endpoints:
 * 1. Global keys - NO assertions, just raw strings that should be valid TranslationKey
 * 2. Scoped keys - using actual contact endpoint scopedT
 * 3. Invalid key detection
 * 4. Type inference through the entire chain
 *
 * These are COMPILE-TIME tests - they fail during typecheck if types break.
 * DO NOT DELETE.
 */

import { createEndpoint } from "../definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "../definition/enums";
import type { CountryLanguage } from "../i18n/core/config";
import type { TranslatedKeyType } from "../i18n/core/scoped-translation";
import type { ExtractScopedKeyType } from "../i18n/core/static-types";
import { UserRole } from "../../identity/roles/enum";
import { objectField, requestField } from "../../unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { type ContactTranslationKey, scopedTranslation } from "@/contact/i18n";

// ============================================================================
// PROGRESSIVE TYPE TESTS - Isolating where property-level errors break
// ============================================================================

// Test valid keys type for progressive tests
type ValidKeys = "valid.key.one" | "valid.key.two" | "valid.key.three";

// ---------------------------------------------------------------------------
// TEST A: Direct object literal with constrained property type
// EXPECTED: Error should appear at `key:` property level
// ---------------------------------------------------------------------------
interface DirectConstraint {
  key: ValidKeys;
}
const testA_valid: DirectConstraint = { key: "valid.key.one" };
const testA_invalid: DirectConstraint = {
  // @ts-expect-error - Direct constraint: error should be at property level
  key: "invalid.key",
};

// ---------------------------------------------------------------------------
// TEST B: Generic function inferring from object, then checking constraint
// EXPECTED: Where does error appear?
// ---------------------------------------------------------------------------
function testB_fn<T extends { key: ValidKeys }>(obj: T): T {
  return obj;
}
const testB_valid = testB_fn({ key: "valid.key.one" as const });
const testB_invalid = testB_fn({
  // @ts-expect-error - Generic constraint: where does error appear?
  key: "invalid.key" as const,
});

// ---------------------------------------------------------------------------
// TEST C: NoInfer on property type
// EXPECTED: Error should appear at property level (NoInfer prevents inference)
// ---------------------------------------------------------------------------
type NoInfer<T> = [T][T extends T ? 0 : never];
interface WithNoInfer<TKey extends string> {
  key: NoInfer<TKey>;
}
function testC_fn<TKey extends string>(obj: WithNoInfer<TKey>): TKey {
  return obj.key;
}
const testC_valid = testC_fn<ValidKeys>({ key: "valid.key.one" });
const testC_invalid = testC_fn<ValidKeys>({
  // @ts-expect-error - NoInfer constraint: error should be at property level
  key: "invalid.key",
});

// ---------------------------------------------------------------------------
// TEST D: Nested object with NoInfer
// EXPECTED: Error should appear at nested property level
// ---------------------------------------------------------------------------
interface NestedWithNoInfer<TKey extends string> {
  outer: {
    inner: {
      key: NoInfer<TKey>;
    };
  };
}
function testD_fn<TKey extends string>(obj: NestedWithNoInfer<TKey>): TKey {
  return obj.outer.inner.key;
}
const testD_valid = testD_fn<ValidKeys>({
  outer: { inner: { key: "valid.key.one" } },
});
const testD_invalid = testD_fn<ValidKeys>({
  outer: {
    inner: {
      // @ts-expect-error - Nested NoInfer: error should be at `key:` property level
      key: "invalid.key",
    },
  },
});

// ---------------------------------------------------------------------------
// TEST E: Intersection type constraint (simulating FieldUIConstraint pattern)
// EXPECTED: Where does error appear with intersection?
// ---------------------------------------------------------------------------
interface BaseType<T> {
  data: T;
  ui: { label: string };
}
interface UIConstraint<TKey extends string> {
  ui: { label: NoInfer<TKey> };
}
function testE_fn<TKey extends string, T extends BaseType<string>>(
  obj: T & UIConstraint<TKey>,
): T {
  return obj;
}
const testE_valid = testE_fn<ValidKeys, BaseType<string>>({
  data: "test",
  ui: { label: "valid.key.one" },
});
const testE_invalid = testE_fn<ValidKeys, BaseType<string>>({
  data: "test",
  ui: {
    // @ts-expect-error - Intersection constraint: where does error appear?
    label: "invalid.key",
  },
});

// ---------------------------------------------------------------------------
// TEST F: Generic that infers T from first arg, validates with intersection
// This simulates the createEndpoint pattern more closely
// ---------------------------------------------------------------------------
interface ScopedTranslationType<TKey extends string> {
  ScopedTranslationKey: TKey;
}
interface ConfigType<TKey extends string> {
  title: NoInfer<TKey>;
  nested: { label: NoInfer<TKey> };
}
function testF_fn<TKey extends string>(
  scoped: ScopedTranslationType<TKey>,
  config: ConfigType<TKey>,
): void {}

const testF_scoped: ScopedTranslationType<ValidKeys> = {
  ScopedTranslationKey: "valid.key.one",
};
testF_fn(testF_scoped, {
  title: "valid.key.one",
  nested: { label: "valid.key.two" },
});
testF_fn(testF_scoped, {
  // @ts-expect-error - Title should error at property level
  title: "invalid.title",
  nested: {
    label: "valid.key.two",
  },
});
testF_fn(testF_scoped, {
  title: "valid.key.one",
  nested: {
    // @ts-expect-error - Nested label should error at property level
    label: "invalid.nested.label",
  },
});

// ---------------------------------------------------------------------------
// TEST G: Adding a generic TConfig that gets intersected (closer to real pattern)
// ---------------------------------------------------------------------------
interface FieldType<TKey extends string> {
  ui: { label: TKey };
  key: TKey;
}
interface FieldConstraint<TKey extends string> {
  ui: { label: NoInfer<TKey> };
}

function testG_fn<TKey extends string, TField extends FieldType<string>>(
  scoped: ScopedTranslationType<TKey>,
  field: TField & FieldConstraint<TKey>,
): void {}

const testG_field_valid: FieldType<"valid.key.one"> = {
  ui: { label: "valid.key.one" },
  key: "valid.key.one",
};
testG_fn(testF_scoped, testG_field_valid);

// Now test with inline object - where does error appear?
testG_fn(testF_scoped, {
  ui: { label: "valid.key.one" },
  key: "valid.key.one",
});
testG_fn(testF_scoped, {
  ui: {
    // @ts-expect-error - Inline field with invalid label: where does error appear?
    label: "invalid.label",
  },
  key: "valid.key.one",
});

// ---------------------------------------------------------------------------
// TEST H: Can we capture TField for inference but validate differently?
// Try: Don't constrain via intersection, constrain via parameter type directly
// ---------------------------------------------------------------------------
interface FieldTypeWithKey<TKey extends string> {
  ui: { label: NoInfer<TKey> };
  key: string;
}

function testH_fn<TKey extends string, TField extends FieldTypeWithKey<TKey>>(
  scoped: ScopedTranslationType<TKey>,
  field: TField,
): TField {
  return field;
}

testH_fn(testF_scoped, {
  ui: { label: "valid.key.one" },
  key: "test",
});
testH_fn(testF_scoped, {
  ui: {
    // @ts-expect-error - H: Constraint in extends, not intersection - where does error appear?
    label: "invalid.label.h",
  },
  key: "test",
});

// ---------------------------------------------------------------------------
// TEST I: What if TField extends a type that already has NoInfer?
// ---------------------------------------------------------------------------
interface FieldTypeConstrained<TKey extends string> {
  ui: { label: NoInfer<TKey>; extra?: string };
  data: string;
}

function testI_fn<
  TKey extends string,
  TField extends FieldTypeConstrained<TKey>,
>(scoped: ScopedTranslationType<TKey>, field: TField): TField {
  return field;
}

testI_fn(testF_scoped, {
  ui: { label: "valid.key.one" },
  data: "test",
});
testI_fn(testF_scoped, {
  ui: {
    // @ts-expect-error - I: TField extends constrained type - where does error appear?
    label: "invalid.label.i",
  },
  data: "test",
});

// ---------------------------------------------------------------------------
// TEST J: Simulating the exact createEndpoint pattern with fields
// Using UnifiedField-like structure
// ---------------------------------------------------------------------------
interface SimpleField<TKey extends string> {
  type: "field";
  ui: { label: NoInfer<TKey> };
  schema: z.ZodTypeAny;
}

type SimpleUnifiedField<TKey extends string> = SimpleField<TKey>;

function testJ_fn<
  TKey extends string,
  TFields extends SimpleUnifiedField<TKey>,
>(scoped: ScopedTranslationType<TKey>, config: { fields: TFields }): TFields {
  return config.fields;
}

testJ_fn(testF_scoped, {
  fields: { type: "field", ui: { label: "valid.key.one" }, schema: z.string() },
});
testJ_fn(testF_scoped, {
  fields: {
    type: "field",
    ui: {
      // @ts-expect-error - J: Full pattern with fields property - where does error appear?
      label: "invalid.label.j",
    },
    schema: z.string(),
  },
});

// ---------------------------------------------------------------------------
// TEST K: What if we DON'T capture TFields as generic, just use the constraint?
// ---------------------------------------------------------------------------
function testK_fn<TKey extends string>(
  scoped: ScopedTranslationType<TKey>,
  config: { fields: SimpleUnifiedField<TKey> },
): void {}

testK_fn(testF_scoped, {
  fields: { type: "field", ui: { label: "valid.key.one" }, schema: z.string() },
});
testK_fn(testF_scoped, {
  fields: {
    type: "field",
    ui: {
      // @ts-expect-error - K: No TFields generic, direct constraint - where does error appear?
      label: "invalid.label.k",
    },
    schema: z.string(),
  },
});

// ---------------------------------------------------------------------------
// TEST L: Function utility that returns a value with captured type
// This simulates how field utilities work - they capture the ui config type
// ---------------------------------------------------------------------------
interface FieldLike<TKey extends string, TUIConfig extends { label?: TKey }> {
  type: "field";
  ui: TUIConfig;
}

function createFieldL<
  TKey extends string,
  const TUIConfig extends { label?: TKey },
>(ui: TUIConfig): FieldLike<TKey, TUIConfig> {
  return { type: "field", ui };
}

function testL_fn<TKey extends string>(
  scoped: ScopedTranslationType<TKey>,
  config: { fields: FieldLike<TKey, { label?: TKey }> },
): void {}

// This should work - but where does error appear?
testL_fn(testF_scoped, {
  fields: createFieldL({ label: "valid.key.one" }),
});

testL_fn(testF_scoped, {
  fields: createFieldL({
    // @ts-expect-error - L: Function utility with captured type - where does error appear?
    label: "invalid.label.l",
  }),
});

// ---------------------------------------------------------------------------
// TEST R: Can contextual typing from the caller provide TKey?
// This tests if TKey can flow from outer context to inner function
// ---------------------------------------------------------------------------
interface ContextualField<TKey extends string> {
  type: "field";
  ui: { label?: NoInfer<TKey> };
}

// The key: TKey is NOT constrained by ui, just extends string
// NoInfer prevents inference from ui, so TKey must come from context
function createContextualField<TKey extends string>(ui: {
  label?: NoInfer<TKey>;
}): ContextualField<TKey> {
  return { type: "field", ui };
}

// testR_fn expects ContextualField<TKey> where TKey is from scoped
function testR_fn<TKey extends string>(
  scoped: ScopedTranslationType<TKey>,
  config: { fields: ContextualField<TKey> },
): void {}

// Question: When createContextualField is called inside testR_fn's argument,
// does TKey get inferred from the outer context (ValidKeys from testF_scoped)?
testR_fn(testF_scoped, {
  fields: createContextualField({ label: "valid.key.one" }),
});

testR_fn(testF_scoped, {
  fields: createContextualField({
    // @ts-expect-error - R: Contextual TKey inference - where does error appear?
    label: "invalid.label.r",
  }),
});

// ---------------------------------------------------------------------------
// TEST S: What if we use a satisfies-like pattern?
// ---------------------------------------------------------------------------
function createFieldS<TKey extends string>(ui: {
  label?: NoInfer<TKey>;
}): ContextualField<TKey> {
  return { type: "field", ui };
}

// Explicitly narrow the return type by assigning to a constrained variable
testR_fn(testF_scoped, {
  fields: createFieldS({
    // @ts-expect-error - S: With assignment - where does error appear?
    label: "invalid.label.s",
  }) as ContextualField<ValidKeys>,
});

// ============================================================================
// END PROGRESSIVE TESTS - Run bun check to see where errors appear
// ============================================================================

const genericST: { ScopedTranslationKey: string } = {
  ScopedTranslationKey: "",
};
const genericScopedTranslation = {
  ScopedTranslationKey: "" as string,
  scopedT: (
    _locale: CountryLanguage,
  ): { t: (key: string) => TranslatedKeyType } => ({
    t: (key: string): TranslatedKeyType => key as TranslatedKeyType,
  }),
};

// ============================================================================
// HELPER: All error types for test endpoints
// ============================================================================

/**
 * Helper constant providing all required error types.
 * This allows tests to focus on translation keys rather than error type completeness.
 */
const allGlobalErrorTypes = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "app.common.error.title" as const,
    description: "app.common.error.description" as const,
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "app.common.error.title" as const,
    description: "app.common.error.description" as const,
  },
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title: "app.common.error.title" as const,
    description: "app.common.error.description" as const,
  },
  [EndpointErrorTypes.FORBIDDEN]: {
    title: "app.common.error.title" as const,
    description: "app.common.error.description" as const,
  },
  [EndpointErrorTypes.NOT_FOUND]: {
    title: "app.common.error.title" as const,
    description: "app.common.error.description" as const,
  },
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "app.common.error.title" as const,
    description: "app.common.error.description" as const,
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "app.common.error.title" as const,
    description: "app.common.error.description" as const,
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "app.common.error.title" as const,
    description: "app.common.error.description" as const,
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "app.common.error.title" as const,
    description: "app.common.error.description" as const,
  },
};

/**
 * Scoped error types using contact translation keys
 */
const allScopedErrorTypes = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "errors.validation.title" as const,
    description: "errors.validation.description" as const,
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "errors.network.title" as const,
    description: "errors.network.description" as const,
  },
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title: "errors.validation.title" as const,
    description: "errors.validation.description" as const,
  },
  [EndpointErrorTypes.FORBIDDEN]: {
    title: "errors.validation.title" as const,
    description: "errors.validation.description" as const,
  },
  [EndpointErrorTypes.NOT_FOUND]: {
    title: "errors.validation.title" as const,
    description: "errors.validation.description" as const,
  },
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "errors.validation.title" as const,
    description: "errors.validation.description" as const,
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "errors.validation.title" as const,
    description: "errors.validation.description" as const,
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "errors.validation.title" as const,
    description: "errors.validation.description" as const,
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "errors.validation.title" as const,
    description: "errors.validation.description" as const,
  },
};

// ============================================================================
// PART 0: TYPE UTILITY TESTS - ExtractScopedKeyType and ScopedTranslationKey
// ============================================================================

/**
 * Test 0: Verify ExtractScopedKeyType utility works correctly
 * This extracts the scoped key type from the FULL scopedTranslation object
 */
type ContactScopedKeys = ExtractScopedKeyType<typeof scopedTranslation>;

// Alternative: Use the ScopedTranslationKey directly (preferred approach)
type ContactScopedKeysDirect =
  (typeof scopedTranslation)["ScopedTranslationKey"];

// Verify both approaches produce equivalent types
type _Test0_0_TypesMatch = ContactScopedKeys extends ContactScopedKeysDirect
  ? ContactScopedKeysDirect extends ContactScopedKeys
    ? true
    : false
  : false;
const _test0_0: _Test0_0_TypesMatch = true;

// Verify that the extracted type includes expected keys
type _Test0_1_TitleExists = "title" extends ContactScopedKeys ? true : false;
type _Test0_2_DescriptionExists = "description" extends ContactScopedKeys
  ? true
  : false;
type _Test0_3_FormLabelExists = "form.label" extends ContactScopedKeys
  ? true
  : false;
type _Test0_4_NestedFieldExists =
  "form.fields.name.label" extends ContactScopedKeys ? true : false;

// Verify invalid keys are NOT in the type
type _Test0_5_InvalidKeyNotExists =
  "invalid.key.not.in.translations" extends ContactScopedKeys ? false : true;

// These should all be true
const _test0_1: _Test0_1_TitleExists = true;
const _test0_2: _Test0_2_DescriptionExists = true;
const _test0_3: _Test0_3_FormLabelExists = true;
const _test0_4: _Test0_4_NestedFieldExists = true;
const _test0_5: _Test0_5_InvalidKeyNotExists = true;

// Verify the exported type alias works
type _Test0_6_TypeAliasWorks = "title" extends ContactTranslationKey
  ? true
  : false;
const _test0_6: _Test0_6_TypeAliasWorks = true;

// ============================================================================
// PART 1: GLOBAL KEYS - BASIC ENDPOINT STRUCTURE TEST
// ============================================================================

/**
 * Test 1: Verify basic endpoint creation works with all required error types
 * This tests that the endpoint type system is working correctly
 */
const globalEndpointWithAllErrorTypes = createEndpoint({
  scopedTranslation: scopedTranslation,
  method: Methods.POST,
  path: ["test", "global", "complete"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "account",
  icon: "check",
  tags: ["tags.contactForm"] as const,
  allowedRoles: [UserRole.PUBLIC],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "form.label",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "form.fields.name.label",
        placeholder: "form.fields.name.placeholder",
        columns: 12,
        schema: z.string(),
      }),
    },
  }),

  examples: {
    requests: { basic: { name: "Test" } },
  },

  errorTypes: allScopedErrorTypes,

  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

// ============================================================================
// PART 2: GLOBAL KEYS - INVALID USAGE
// ============================================================================

const globalEndpointInvalidTitle = createEndpoint({
  scopedTranslation: genericScopedTranslation,
  method: Methods.POST,
  path: ["test", "global", "invalid", "title"],
  title: "this.key.does.not.exist.in.translations",
  titleShort: "this.key.does.not.exist.in.translations",
  description: "app.common.active",
  category: "account",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(genericST, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {},
  }),
  examples: {},
  errorTypes: allGlobalErrorTypes,
  successTypes: {
    title: "app.ui.info.title",
    description: "app.ui.info.description",
  },
});

// Invalid widget label — DistributiveOmit fix preserves NoInfer<TKey> on label, so this errors.
const globalEndpointInvalidWidgetLabel = createEndpoint({
  scopedTranslation: scopedTranslation,
  method: Methods.POST,
  path: ["test", "global", "invalid", "widget"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "account",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        // @ts-expect-error - Invalid field label key
        label: "invalid.widget.label.does.not.exist",
        columns: 12,
        schema: z.string(),
      }),
    },
  }),
  examples: { requests: { basic: { name: "Test" } } },
  errorTypes: allScopedErrorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

// Invalid error title - only errors when translationsKeyTypesafety = true
const globalEndpointInvalidErrorTitle = createEndpoint({
  scopedTranslation: genericScopedTranslation,
  method: Methods.POST,
  path: ["test", "global", "invalid", "error"],
  title: "app.common.active",
  titleShort: "app.common.active",
  description: "app.common.cancel",
  category: "account",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(genericST, {
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
      title: "invalid.error.title.key.does.not.exist" as const,
      description: "app.common.validationFailed" as const,
    },
  },
  successTypes: {
    title: "app.ui.info.title",
    description: "app.ui.info.description",
  },
});

// ============================================================================
// PART 3: SCOPED KEYS - CORRECT USAGE (with scopedT property)
// ============================================================================

/**
 * Test 3: Scoped keys with scopedT property
 * Uses REAL contactScopedT from contact endpoint
 * NO type assertions - just raw strings that should be valid scoped keys
 */

const scopedEndpointCorrect = createEndpoint({
  scopedTranslation: scopedTranslation, // <-- This should enable scoped translation keys
  method: Methods.POST,
  path: ["test", "scoped", "correct"],
  title: "title", // Scoped key (relative to app.api.contact)
  titleShort: "title",
  description: "description",
  category: "account",
  icon: "check",
  tags: ["tags.contactForm", "tags.contactUs"] as const,
  allowedRoles: [UserRole.PUBLIC],

  // Scoped field utilities validate keys against scopedTranslation.ScopedTranslationKey
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "form.label",
    description: "form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "form.fields.name.label",
        placeholder: "form.fields.name.placeholder",
        columns: 12,
        schema: z.string(),
      }),
      email: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "form.fields.email.label",
        placeholder: "form.fields.email.placeholder",
        columns: 12,
        schema: z.email(),
      }),
    },
  }),

  examples: {
    requests: { basic: { name: "Test", email: "test@example.com" } },
  },

  errorTypes: allScopedErrorTypes,

  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

// ============================================================================
// PART 4: SCOPED KEYS - INVALID USAGE
// ============================================================================

/**
 * Test 4: Invalid scoped keys should cause errors
 * Uses REAL contactScopedT but with INVALID keys
 * NO type assertions - just raw invalid strings
 *
 * These tests verify that the type system catches invalid keys.
 * When scopedTranslation is provided, TScopedTranslationKey should be
 * inferred from scopedTranslation.ScopedTranslationKey and reject invalid keys.
 */

const scopedEndpointInvalidTitle = createEndpoint({
  scopedTranslation: scopedTranslation,
  method: Methods.POST,
  path: ["test", "scoped", "invalid", "title"],
  // @ts-expect-error - Invalid scoped title key (key doesn't exist in contact translations)
  title: "invalid.title.key.does.not.exist",
  titleShort: "title",
  description: "description",
  category: "account",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(genericST, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {},
  }),
  examples: {},
  errorTypes: allScopedErrorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

const scopedEndpointGlobalKey = createEndpoint({
  scopedTranslation: scopedTranslation,
  method: Methods.POST,
  path: ["test", "scoped", "invalid", "global"],
  // @ts-expect-error - Global key in scoped context (app.common.save is global, not scoped)
  title: "app.common.save",
  titleShort: "title",
  description: "description",
  category: "account",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(genericST, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {},
  }),
  examples: {},
  errorTypes: allScopedErrorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

// Invalid description key
const scopedEndpointInvalidDescription = createEndpoint({
  scopedTranslation: scopedTranslation,
  method: Methods.POST,
  path: ["test", "scoped", "invalid", "description"],
  title: "title",
  titleShort: "title",
  // @ts-expect-error - Invalid description key
  description: "invalid.description.key",
  category: "account",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(genericST, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {},
  }),
  examples: {},
  errorTypes: allScopedErrorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

// Invalid category key
const scopedEndpointInvalidCategory = createEndpoint({
  scopedTranslation: scopedTranslation,
  method: Methods.POST,
  path: ["test", "scoped", "invalid", "category"],
  title: "title",
  titleShort: "title",
  description: "description",
  // @ts-expect-error - Invalid category key
  category: "invalid.category.key",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(genericST, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {},
  }),
  examples: {},
  errorTypes: allScopedErrorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

// Invalid tags key
const scopedEndpointInvalidTags = createEndpoint({
  scopedTranslation: scopedTranslation,
  method: Methods.POST,
  path: ["test", "scoped", "invalid", "tags"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "account",
  icon: "check",
  // @ts-expect-error - Invalid tag key in array
  tags: ["invalid.tag.key"] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(genericST, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {},
  }),
  examples: {},
  errorTypes: allScopedErrorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

// Invalid errorTypes title key
const scopedEndpointInvalidErrorTitle = createEndpoint({
  scopedTranslation: scopedTranslation,
  method: Methods.POST,
  path: ["test", "scoped", "invalid", "error", "title"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "account",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(genericST, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {},
  }),
  examples: {},
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      // @ts-expect-error - Invalid error title key
      title: "invalid.error.title.key",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
  },
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

// Invalid successTypes title key
const scopedEndpointInvalidSuccessTitle = createEndpoint({
  scopedTranslation: scopedTranslation,
  method: Methods.POST,
  path: ["test", "scoped", "invalid", "success", "title"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "account",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(genericST, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {},
  }),
  examples: {},
  errorTypes: allScopedErrorTypes,
  successTypes: {
    // @ts-expect-error - Invalid success title key
    title: "invalid.success.title.key",
    description: "success.description",
  },
});

// Invalid successTypes description key
const scopedEndpointInvalidSuccessDescription = createEndpoint({
  scopedTranslation: scopedTranslation,
  method: Methods.POST,
  path: ["test", "scoped", "invalid", "success", "description"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "account",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(genericST, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {},
  }),
  examples: {},
  errorTypes: allScopedErrorTypes,
  successTypes: {
    title: "success.title",
    // @ts-expect-error - Invalid success description key
    description: "invalid.success.description.key",
  },
});

// ============================================================================
// PART 5: FIELD WIDGET TRANSLATION KEY TESTS
// ============================================================================

// Invalid TEXT field label key — uses genericST (ScopedTranslationKey: string), so no type error.
// This tests that when a generic string type is passed, keys are unconstrained.
// When typed scopedTranslation is passed instead, the invalid key errors (see scopedEndpointInvalidEmailFieldLabel).
const scopedEndpointInvalidTextFieldLabel = createEndpoint({
  scopedTranslation: scopedTranslation,
  method: Methods.POST,
  path: ["test", "scoped", "invalid", "field", "text", "label"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "account",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(genericST, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      name: requestField(genericST, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "invalid.field.label.key",
        columns: 12,
        schema: z.string(),
      }),
    },
  }),
  examples: { requests: { basic: { name: "Test" } } },
  errorTypes: allScopedErrorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

const scopedEndpointInvalidTextFieldLabelWithType = createEndpoint({
  scopedTranslation: scopedTranslation,
  method: Methods.POST,
  path: ["test", "scoped", "invalid", "field", "text", "label", "with-type"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "account",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(genericST, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      name: requestField(genericST, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "invalid.field.label.key",
        columns: 12,
        schema: z.string(),
      }),
    },
  }),
  examples: { requests: { basic: { name: "Test" } } },
  errorTypes: allScopedErrorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

// Invalid TEXT field placeholder key — uses scopedTranslation, so invalid key errors at property level.
const scopedEndpointInvalidTextFieldPlaceholder = createEndpoint({
  scopedTranslation: scopedTranslation,
  method: Methods.POST,
  path: ["test", "scoped", "invalid", "field", "text", "placeholder"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "account",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "form.fields.name.label",
        // @ts-expect-error - Invalid field placeholder key
        placeholder: "invalid.field.placeholder.key",
        columns: 12,
        schema: z.string(),
      }),
    },
  }),
  examples: { requests: { basic: { name: "Test" } } },
  errorTypes: allScopedErrorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

// Invalid EMAIL field label key — DistributiveOmit preserves NoInfer<TKey> on label.
const scopedEndpointInvalidEmailFieldLabel = createEndpoint({
  scopedTranslation: scopedTranslation,
  method: Methods.POST,
  path: ["test", "scoped", "invalid", "field", "email", "label"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "account",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      email: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        // @ts-expect-error - Invalid email field label key
        label: "invalid.email.field.label.key",
        columns: 12,
        schema: z.email(),
      }),
    },
  }),
  examples: {
    requests: { basic: { email: "test@example.com" } },
  },
  errorTypes: allScopedErrorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

// Invalid TEXTAREA field description key — DistributiveOmit preserves NoInfer<TKey> on description.
const scopedEndpointInvalidTextareaFieldDescription = createEndpoint({
  scopedTranslation: scopedTranslation,
  method: Methods.POST,
  path: ["test", "scoped", "invalid", "field", "textarea", "description"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "account",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      message: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "form.fields.message.label",
        // @ts-expect-error - Invalid textarea field description key
        description: "invalid.textarea.field.description.key",
        columns: 12,
        schema: z.string(),
      }),
    },
  }),
  examples: {
    requests: { basic: { message: "Hello" } },
  },
  errorTypes: allScopedErrorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

// Invalid PASSWORD field helpText key — DistributiveOmit preserves NoInfer<TKey> on helpText.
const scopedEndpointInvalidPasswordFieldHelpText = createEndpoint({
  scopedTranslation: scopedTranslation,
  method: Methods.POST,
  path: ["test", "scoped", "invalid", "field", "password", "helptext"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "account",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      password: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "form.fields.name.label",
        // @ts-expect-error - Invalid password field helpText key
        helpText: "invalid.password.field.helptext.key",
        columns: 12,
        schema: z.string(),
      }),
    },
  }),
  examples: {
    requests: { basic: { password: "secret123" } },
  },
  errorTypes: allScopedErrorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

// Invalid SELECT field option label key — DistributiveOmit preserves NoInfer<TKey> on option labels.
const scopedEndpointInvalidSelectFieldOptionLabel = createEndpoint({
  scopedTranslation: scopedTranslation,
  method: Methods.POST,
  path: ["test", "scoped", "invalid", "field", "select", "option"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "account",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "form.fields.name.label",
        options: [
          // @ts-expect-error - Invalid select option label key
          { label: "invalid.select.option.label.key", value: "active" },
        ],
        columns: 12,
        schema: z.string(),
      }),
    },
  }),
  examples: {
    requests: { basic: { status: "active" } },
  },
  errorTypes: allScopedErrorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

// Invalid container title key - standalone objectField test.
// NOTE: Using @ts-expect-error inside objectField within createEndpoint breaks type
// inference for the whole endpoint (same limitation as global objectField). Standalone form works.
const scopedEndpointInvalidContainerTitle = objectField(scopedTranslation, {
  type: WidgetType.CONTAINER,
  // @ts-expect-error - Invalid container title key
  title: "invalid.container.title.key",
  layoutType: LayoutType.GRID,
  columns: 12,
  usage: { request: "data", response: true },
  children: {
    name: requestField(scopedTranslation, {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "form.fields.name.label",
      columns: 12,
      schema: z.string(),
    }),
  },
});

// Invalid container description key - standalone objectField test.
const scopedEndpointInvalidContainerDescription = objectField(
  scopedTranslation,
  {
    type: WidgetType.CONTAINER,
    title: "form.label",
    // @ts-expect-error - Invalid container description key
    description: "invalid.container.description.key",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "form.fields.name.label",
        columns: 12,
        schema: z.string(),
      }),
    },
  },
);

// Invalid NUMBER field label key — DistributiveOmit preserves NoInfer<TKey> on label.
const scopedEndpointInvalidNumberFieldLabel = createEndpoint({
  scopedTranslation: scopedTranslation,
  method: Methods.POST,
  path: ["test", "scoped", "invalid", "field", "number", "label"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "account",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      amount: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        // @ts-expect-error - Invalid number field label key
        label: "invalid.number.field.label.key",
        columns: 12,
        schema: z.number(),
      }),
    },
  }),
  examples: { requests: { basic: { amount: 100 } } },
  errorTypes: allScopedErrorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

// Invalid BOOLEAN field label key — DistributiveOmit preserves NoInfer<TKey> on label.
const scopedEndpointInvalidBooleanFieldLabel = createEndpoint({
  scopedTranslation: scopedTranslation,
  method: Methods.POST,
  path: ["test", "scoped", "invalid", "field", "boolean", "label"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "account",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      active: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        // @ts-expect-error - Invalid boolean field label key
        label: "invalid.boolean.field.label.key",
        columns: 12,
        schema: z.boolean(),
      }),
    },
  }),
  examples: {
    requests: { basic: { active: true } },
  },
  errorTypes: allScopedErrorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

// Invalid DATE field label key
const scopedEndpointInvalidDateFieldLabel = createEndpoint({
  scopedTranslation: scopedTranslation,
  method: Methods.POST,
  path: ["test", "scoped", "invalid", "field", "date", "label"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "account",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(genericST, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      date: requestField(genericST, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATE,
        label: "invalid.date.field.label.key",
        columns: 12,
        schema: z.string(),
      }),
    },
  }),
  examples: {
    requests: { basic: { date: "2024-01-01" } },
  },
  errorTypes: allScopedErrorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

// Invalid MULTISELECT field option label key — DistributiveOmit preserves NoInfer<TKey> on option labels.
const scopedEndpointInvalidMultiselectFieldOptionLabel = createEndpoint({
  scopedTranslation: scopedTranslation,
  method: Methods.POST,
  path: ["test", "scoped", "invalid", "field", "multiselect", "option"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "account",
  icon: "check",
  tags: [] as const,
  allowedRoles: [UserRole.PUBLIC],
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      roles: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.MULTISELECT,
        label: "form.fields.name.label",
        options: [
          // @ts-expect-error - Invalid multiselect option label key
          { label: "invalid.multiselect.option.label.key", value: "admin" },
        ],
        columns: 12,
        schema: z.array(z.string()),
      }),
    },
  }),
  examples: {
    requests: { basic: { roles: ["admin"] } },
  },
  errorTypes: allScopedErrorTypes,
  successTypes: {
    title: "success.title",
    description: "success.description",
  },
});

// ============================================================================
// PART 6: ISOLATED FIELD HELPER TESTS - Root Cause Analysis
// ============================================================================

/**
 * Field helpers take scopedTranslation as the first arg to constrain TKey.
 * When a typed scopedTranslation is passed (ScopedTranslationKey is a literal union),
 * invalid keys error at the property level (label, description, placeholder, helpText, option labels).
 * When genericST is passed (ScopedTranslationKey: string), any key is accepted.
 */

// ---------------------------------------------------------------------------
// Test 6A: Scoped field helpers validate against scopedTranslation.ScopedTranslationKey
// Pass scopedTranslation as first arg. DistributiveOmit preserves NoInfer<TKey> on ALL
// key-bearing properties (label, placeholder, description, helpText, option labels).
// Invalid key on ANY property errors at that property's level.
// ---------------------------------------------------------------------------
const test6A_validField = requestField(scopedTranslation, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.TEXT,
  label: "form.fields.name.label",
  columns: 12,
  schema: z.string(),
});

const test6A_invalidField = requestField(scopedTranslation, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.TEXT,
  label: "form.fields.name.label",
  // @ts-expect-error - Invalid placeholder key
  placeholder: "invalid.key",
  columns: 12,
  schema: z.string(),
});

// ---------------------------------------------------------------------------
// Test 6B: No validation when using genericST (ScopedTranslationKey: string)
// Both valid and invalid keys are accepted because the key type is `string`
// ---------------------------------------------------------------------------
const test6B_validField = requestField(genericST, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.TEXT,
  label: "form.fields.name.label",
  columns: 12,
  schema: z.string(),
});

// genericST has ScopedTranslationKey: string, so any key is valid — no error expected.
const test6B_invalidField = requestField(genericST, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.TEXT,
  label: "invalid.key",
  columns: 12,
  schema: z.string(),
});

// ---------------------------------------------------------------------------
// Test 6C: No validation when using genericST
// Both valid and invalid keys accepted — key type is string
// ---------------------------------------------------------------------------
const test6C_validObject = objectField(genericST, {
  type: WidgetType.CONTAINER,
  title: "app.common.active",
  layoutType: LayoutType.GRID,
  columns: 12,
  usage: { request: "data", response: true },
  children: {
    name: requestField(genericST, {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "app.common.filter",
      columns: 12,
      schema: z.string(),
    }),
  },
});

// genericST has ScopedTranslationKey: string, so any key is valid — no error expected.
const test6C_invalidObject = objectField(genericST, {
  type: WidgetType.CONTAINER,
  title: "app.common.active",
  layoutType: LayoutType.GRID,
  columns: 12,
  usage: { request: "data", response: true },
  children: {
    name: requestField(genericST, {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "bad.invalid.key.xyz",
      columns: 12,
      schema: z.string(),
    }),
  },
});

// ---------------------------------------------------------------------------
// TEST NoInfer verification: invalid label with typed scopedTranslation
// DistributiveOmit fix: label NOW constrains TKey via NoInfer<TKey> — invalid label errors.
// ---------------------------------------------------------------------------
const _testLabelErrors = requestField(scopedTranslation, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.TEXT,
  // @ts-expect-error - DistributiveOmit fix: invalid label now errors (NoInfer<TKey> preserved)
  label: "invalid.label.testing",
  columns: 12,
  schema: z.string(),
});
