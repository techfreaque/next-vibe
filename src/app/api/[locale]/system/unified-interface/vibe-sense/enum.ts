/**
 * Vibe Sense — Shared Enums
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

export const {
  enum: GraphResolution,
  options: GraphResolutionOptions,
  Value: GraphResolutionValue,
} = createEnumOptions(scopedTranslation, {
  ONE_MINUTE: "enums.resolution.1m",
  THREE_MINUTES: "enums.resolution.3m",
  FIVE_MINUTES: "enums.resolution.5m",
  FIFTEEN_MINUTES: "enums.resolution.15m",
  THIRTY_MINUTES: "enums.resolution.30m",
  ONE_HOUR: "enums.resolution.1h",
  FOUR_HOURS: "enums.resolution.4h",
  ONE_DAY: "enums.resolution.1d",
  ONE_WEEK: "enums.resolution.1w",
  ONE_MONTH: "enums.resolution.1M",
} as const);

export type GraphResolutionType = typeof GraphResolutionValue;

export const GraphResolutionDB = [
  GraphResolution.ONE_MINUTE,
  GraphResolution.THREE_MINUTES,
  GraphResolution.FIVE_MINUTES,
  GraphResolution.FIFTEEN_MINUTES,
  GraphResolution.THIRTY_MINUTES,
  GraphResolution.ONE_HOUR,
  GraphResolution.FOUR_HOURS,
  GraphResolution.ONE_DAY,
  GraphResolution.ONE_WEEK,
  GraphResolution.ONE_MONTH,
] as const;

export const {
  enum: RunStatus,
  options: RunStatusOptions,
  Value: RunStatusValue,
} = createEnumOptions(scopedTranslation, {
  RUNNING: "enums.runStatus.running",
  COMPLETED: "enums.runStatus.completed",
  FAILED: "enums.runStatus.failed",
} as const);

export type RunStatusType = typeof RunStatusValue;

export const RunStatusDB = [
  RunStatus.RUNNING,
  RunStatus.COMPLETED,
  RunStatus.FAILED,
] as const;

export const {
  enum: BacktestActionMode,
  options: BacktestActionModeOptions,
  Value: BacktestActionModeValue,
} = createEnumOptions(scopedTranslation, {
  SIMULATE: "enums.backtestActionMode.simulate",
  EXECUTE: "enums.backtestActionMode.execute",
} as const);

export type BacktestActionModeType = typeof BacktestActionModeValue;

export const BacktestActionModeDB = [
  BacktestActionMode.SIMULATE,
  BacktestActionMode.EXECUTE,
] as const;

export const {
  enum: GraphOwnerType,
  options: GraphOwnerTypeOptions,
  Value: GraphOwnerTypeValue,
} = createEnumOptions(scopedTranslation, {
  SYSTEM: "enums.graphOwnerType.system",
  ADMIN: "enums.graphOwnerType.admin",
  USER: "enums.graphOwnerType.user",
} as const);

export type GraphOwnerTypeType = typeof GraphOwnerTypeValue;

export const GraphOwnerTypeDB = [
  GraphOwnerType.SYSTEM,
  GraphOwnerType.ADMIN,
  GraphOwnerType.USER,
] as const;

export const {
  enum: TriggerType,
  options: TriggerTypeOptions,
  Value: TriggerTypeValue,
} = createEnumOptions(scopedTranslation, {
  MANUAL: "enums.triggerType.manual",
  CRON: "enums.triggerType.cron",
} as const);

export type TriggerTypeType = typeof TriggerTypeValue;
