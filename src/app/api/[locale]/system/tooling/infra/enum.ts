/**
 * Infra Module Enums
 */

import { scopedTranslation } from "next-vibe/tooling/infra/i18n";
import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

// ─── Infra Status ─────────────────────────────────────────────────────────────

export const {
  enum: InfraStatus,
  options: InfraStatusOptions,
  Value: InfraStatusValue,
} = createEnumOptions(scopedTranslation, {
  PENDING: "enums.infraStatus.pending",
  PROVISIONING: "enums.infraStatus.provisioning",
  READY: "enums.infraStatus.ready",
  DEGRADED: "enums.infraStatus.degraded",
  ERROR: "enums.infraStatus.error",
});

export const InfraStatusDB = [
  InfraStatus.PENDING,
  InfraStatus.PROVISIONING,
  InfraStatus.READY,
  InfraStatus.DEGRADED,
  InfraStatus.ERROR,
] as const;

export type InfraStatusType = typeof InfraStatusValue;

// ─── Component Status ─────────────────────────────────────────────────────────

export const {
  enum: ComponentStatus,
  options: ComponentStatusOptions,
  Value: ComponentStatusValue,
} = createEnumOptions(scopedTranslation, {
  UNKNOWN: "enums.componentStatus.unknown",
  HEALTHY: "enums.componentStatus.healthy",
  DEGRADED: "enums.componentStatus.degraded",
  DOWN: "enums.componentStatus.down",
});

export const ComponentStatusDB = [
  ComponentStatus.UNKNOWN,
  ComponentStatus.HEALTHY,
  ComponentStatus.DEGRADED,
  ComponentStatus.DOWN,
] as const;

export type ComponentStatusType = typeof ComponentStatusValue;

// ─── Scale Component ──────────────────────────────────────────────────────────

export const {
  enum: ScaleComponent,
  options: ScaleComponentOptions,
  Value: ScaleComponentValue,
} = createEnumOptions(scopedTranslation, {
  WEB: "enums.scaleComponent.web",
  TASKS: "enums.scaleComponent.tasks",
  STORAGE: "enums.scaleComponent.storage",
});

export const ScaleComponentDB = [
  ScaleComponent.WEB,
  ScaleComponent.TASKS,
  ScaleComponent.STORAGE,
] as const;

export type ScaleComponentType = typeof ScaleComponentValue;
