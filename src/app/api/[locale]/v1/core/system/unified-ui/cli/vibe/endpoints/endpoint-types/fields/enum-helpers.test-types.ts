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
  TestEnumValues.COMPLETED,
  TestEnumValues.FAILED,
  TestEnumValues.CREATE_TASK,
] as const;

// Type tests - these should all pass without errors

// Test 1: enum should have the correct key-to-key mapping (keys map to themselves)
type TestEnumType = typeof TestEnumValues;
interface ExpectedEnumType {
  readonly COMPLETED: "COMPLETED";
  readonly FAILED: "FAILED";
  readonly CREATE_TASK: "CREATE_TASK";
}

// This should not error - enum type should match expected
const enumTypeTest: ExpectedEnumType = TestEnumValues;

// Test 2: options should be an array of objects with value (key) and label (translation)
type TestOptionsType = typeof TestEnumOptions;
type ExpectedOptionsType = Array<
  | {
      value: "COMPLETED";
      label: "admin.dashboard.cron.actions.completed";
    }
  | {
      value: "FAILED";
      label: "admin.dashboard.cron.actions.failed";
    }
  | {
      value: "CREATE_TASK";
      label: "admin.dashboard.cron.buttons.createTask";
    }
>;

// This should not error - options type should match expected
const optionsTypeTest: ExpectedOptionsType = TestEnumOptions;

// Test 3: dbEnum should be an array of the enum keys
type TestDbEnumType = typeof TestDbEnum;
type ExpectedDbEnumType = readonly ("COMPLETED" | "FAILED" | "CREATE_TASK")[];

// This should not error - dbEnum type should match expected
const dbEnumTypeTest: ExpectedDbEnumType = TestDbEnum;

// Test 4: Value should be one of the enum keys
type TestValueType = typeof TestValue;
type ExpectedValueType = "COMPLETED" | "FAILED" | "CREATE_TASK";

// This should not error - Value type should match expected
const valueTypeTest: ExpectedValueType = TestValue;

// Test 5: Enum values should be accessible and have correct types (keys map to themselves)
const completedValue: "COMPLETED" = TestEnumValues.COMPLETED;
const failedValue: "FAILED" = TestEnumValues.FAILED;
const createTaskValue: "CREATE_TASK" = TestEnumValues.CREATE_TASK;

// Test 6: Options should have the correct structure (value is key, label is translation)
const firstOption = TestEnumOptions[0];
const optionValue: "COMPLETED" | "FAILED" | "CREATE_TASK" = firstOption.value;
const optionLabel:
  | "admin.dashboard.cron.actions.completed"
  | "admin.dashboard.cron.actions.failed"
  | "admin.dashboard.cron.buttons.createTask" = firstOption.label;

// Test 7: dbEnum should contain the enum keys
const firstDbValue: "COMPLETED" | "FAILED" | "CREATE_TASK" = TestDbEnum[0];

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
  Value: StatusValue,
} = createEnumOptions(StatusEnum);

// Verify status enum types (keys map to themselves)
const refreshType: "REFRESH" = StatusValues.REFRESH;
const taskExecutedType: "TASK_EXECUTED" = StatusValues.TASK_EXECUTED;
const taskCreatedType: "TASK_CREATED" = StatusValues.TASK_CREATED;

const statusOption = StatusOptions[0];
const statusValue: "REFRESH" | "TASK_EXECUTED" | "TASK_CREATED" =
  statusOption.value;
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
const invalidEnumResult = createEnumOptions(InvalidEnum);

export {
  // Export the invalid test to verify it fails
  invalidEnumResult,
  refreshType,
  statusLabel,
  statusOption,
  StatusOptions,
  StatusValue,
  statusValue,
  StatusValues,
  taskCreatedType,
  taskExecutedType,
};
