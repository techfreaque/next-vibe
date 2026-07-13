/**
 * Field Assignability Tests
 *
 * Tests that specific field types are assignable to generic field types.
 */

import type {
  RequestResponseWidgetConfig,
  UnifiedField,
} from "next-vibe/unified-ui/_shared/configs";
import type { FieldUsageConfig } from "next-vibe/unified-ui/_shared/types";
import type { z } from "zod";

// Test: Can a specific RequestResponseWidgetConfig be assigned to generic UnifiedField?
type SpecificField = RequestResponseWidgetConfig<
  "app.test",
  z.ZodString,
  { request: "data" },
  "primitive"
>;

type GenericUnifiedField = UnifiedField<
  string,
  z.ZodTypeAny,
  FieldUsageConfig,
  never
>;

type Test1_Result = SpecificField extends GenericUnifiedField ? "PASS" : "FAIL";
const test1: Test1_Result = "PASS"; // Should PASS with variance annotations

export { test1 };
