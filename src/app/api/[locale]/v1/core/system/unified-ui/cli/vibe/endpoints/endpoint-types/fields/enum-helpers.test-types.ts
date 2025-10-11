/**
 * Type Testing File for createEnumOptions
 *
 * This file tests that the createEnumOptions function properly infers types
 * and that the enum, options, dbEnum, and Value properties have the correct types.
 */

import { createEnumOptions } from "./enum-helpers";

// Test enum definition using real translation keys
const TestEnum = {
  COMPLETED: "admin.dashboard.cron.actions.completed" as const,
  FAILED: "admin.dashboard.cron.actions.failed" as const,
  CREATE_TASK: "admin.dashboard.cron.buttons.createTask" as const,
} as const;

// Create enum options
const {
  enum: TestEnumValues,
  options: TestEnumOptions,
  Value: TestValue,
} = createEnumOptions(TestEnum);

// Create DB enum array for testing
const TestDbEnum = [
  TestEnumResult.OPTION_A,
  TestEnumResult.OPTION_B,
  TestEnumResult.OPTION_C,
] as const;

// Type tests - these should all pass without errors

// Test 1: enum should have the correct key-to-value mapping
type TestEnumType = typeof TestEnumValues;
interface ExpectedEnumType {
  readonly COMPLETED: "admin.dashboard.cron.actions.completed";
  readonly FAILED: "admin.dashboard.cron.actions.failed";
  readonly CREATE_TASK: "admin.dashboard.cron.buttons.createTask";
}

// This should not error - enum type should match expected
const enumTypeTest: ExpectedEnumType = TestEnumValues;

// Test 2: options should be an array of objects with value and label
type TestOptionsType = typeof TestEnumOptions;
type ExpectedOptionsType = Array<
  | {
      value: "admin.dashboard.cron.actions.completed";
      label: "admin.dashboard.cron.actions.completed";
    }
  | {
      value: "admin.dashboard.cron.actions.failed";
      label: "admin.dashboard.cron.actions.failed";
    }
  | {
      value: "admin.dashboard.cron.buttons.createTask";
      label: "admin.dashboard.cron.buttons.createTask";
    }
>;

// This should not error - options type should match expected
const optionsTypeTest: ExpectedOptionsType = TestEnumOptions;

// Test 3: dbEnum should be an array of the translation values
type TestDbEnumType = typeof TestDbEnum;
type ExpectedDbEnumType = readonly (
  | "admin.dashboard.cron.actions.completed"
  | "admin.dashboard.cron.actions.failed"
  | "admin.dashboard.cron.buttons.createTask"
)[];

// This should not error - dbEnum type should match expected
const dbEnumTypeTest: ExpectedDbEnumType = TestDbEnum;

// Test 4: Value should be one of the translation values
type TestValueType = typeof TestValue;
type ExpectedValueType =
  | "admin.dashboard.cron.actions.completed"
  | "admin.dashboard.cron.actions.failed"
  | "admin.dashboard.cron.buttons.createTask";

// This should not error - Value type should match expected
const valueTypeTest: ExpectedValueType = TestValue;

// Test 5: Enum values should be accessible and have correct types
const completedValue: "admin.dashboard.cron.actions.completed" =
  TestEnumValues.COMPLETED;
const failedValue: "admin.dashboard.cron.actions.failed" =
  TestEnumValues.FAILED;
const createTaskValue: "admin.dashboard.cron.buttons.createTask" =
  TestEnumValues.CREATE_TASK;

// Test 6: Options should have the correct structure
const firstOption = TestEnumOptions[0];
const optionValue:
  | "admin.dashboard.cron.actions.completed"
  | "admin.dashboard.cron.actions.failed"
  | "admin.dashboard.cron.buttons.createTask" = firstOption.value;
const optionLabel:
  | "admin.dashboard.cron.actions.completed"
  | "admin.dashboard.cron.actions.failed"
  | "admin.dashboard.cron.buttons.createTask" = firstOption.label;

// Test 7: dbEnum should contain the translation values
const firstDbValue:
  | "admin.dashboard.cron.actions.completed"
  | "admin.dashboard.cron.actions.failed"
  | "admin.dashboard.cron.buttons.createTask" = TestDbEnum[0];

// Export for verification
export {
  completedValue,
  createTaskValue,
  dbEnumTypeTest,
  enumTypeTest,
  failedValue,
  firstDbValue,
  firstOption,
  optionLabel,
  optionsTypeTest,
  optionValue,
  TestDbEnum,
  TestEnumOptions,
  TestEnumValues,
  TestValue,
  valueTypeTest,
};

export type { TestDbEnumType, TestEnumType, TestOptionsType, TestValueType };

// Additional test with different enum structure
const StatusEnum = {
  REFRESH: "admin.dashboard.cron.buttons.refresh" as const,
  TASK_EXECUTED: "tasks.success.taskExecuted" as const,
  TASK_CREATED: "tasks.success.taskCreated" as const,
} as const;

const {
  enum: StatusValues,
  options: StatusOptions,
  dbEnum: StatusDbEnum,
  Value: StatusValue,
} = createEnumOptions(StatusEnum);

// Verify status enum types
const refreshType: "admin.dashboard.cron.buttons.refresh" =
  StatusValues.REFRESH;
const taskExecutedType: "tasks.success.taskExecuted" =
  StatusValues.TASK_EXECUTED;
const taskCreatedType: "tasks.success.taskCreated" = StatusValues.TASK_CREATED;

const statusOption = StatusOptions[0];
const statusValue:
  | "admin.dashboard.cron.buttons.refresh"
  | "tasks.success.taskExecuted"
  | "tasks.success.taskCreated" = statusOption.value;
const statusLabel:
  | "admin.dashboard.cron.buttons.refresh"
  | "tasks.success.taskExecuted"
  | "tasks.success.taskCreated" = statusOption.label;

// Test with invalid translation keys - this should cause a compile error
const InvalidEnum = {
  INVALID_A: "this.is.not.a.valid.translation.key" as const,
  INVALID_B: "another.invalid.key" as const,
} as const;

// This should cause a TypeScript error
// @ts-expect-error - Invalid translation keys should cause a compile error
const invalidEnumResult = createEnumOptions(InvalidEnum);

export {
  // Export the invalid test to verify it fails
  invalidEnumResult,
  refreshType,
  StatusDbEnum,
  statusLabel,
  statusOption,
  StatusOptions,
  StatusValue,
  statusValue,
  StatusValues,
  taskCreatedType,
  taskExecutedType,
};
