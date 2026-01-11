/**
 * Test ObjectField assignability to UnifiedField
 */

import type { z } from "zod";

import type { WidgetConfig } from "../../widgets/configs";
import type { ObjectField, PrimitiveField, UnifiedField } from "../endpoint";
import type { FieldUsageConfig } from "../endpoint";

// Test: Can a specific ObjectField be assigned to generic UnifiedField?
type SpecificObjectField = ObjectField<
  {
    file: PrimitiveField<z.ZodString, FieldUsageConfig, "app.test", WidgetConfig<"app.test">>;
  },
  FieldUsageConfig,
  "app.test",
  WidgetConfig<"app.test">
>;

type GenericUnifiedField = UnifiedField<string, z.ZodTypeAny>;

type Test1_Result = SpecificObjectField extends GenericUnifiedField ? "PASS" : "FAIL";
const test1: Test1_Result = "PASS"; // Should PASS with variance annotations

export { test1 };
