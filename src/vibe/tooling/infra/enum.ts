/**
 * Infra Module Enums
 */

import { scopedTranslation } from "./i18n";
import { createEnumOptions } from "../../unified-ui/_shared/enum";

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
