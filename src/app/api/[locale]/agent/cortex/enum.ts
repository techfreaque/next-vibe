/**
 * Cortex Enums
 * Node types and view types for the virtual filesystem
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Cortex Node Type: file or directory
 */
export const {
  enum: CortexNodeType,
  options: CortexNodeTypeOptions,
  Value: CortexNodeTypeValue,
} = createEnumOptions(scopedTranslation, {
  FILE: "enums.nodeType.file",
  DIR: "enums.nodeType.dir",
} as const);

export type CortexNodeTypeValue = typeof CortexNodeTypeValue;

export const CortexNodeTypeDB = [
  CortexNodeType.FILE,
  CortexNodeType.DIR,
] as const;

/**
 * Cortex View Type: controls how a directory renders in the web UI
 */
export const {
  enum: CortexViewType,
  options: CortexViewTypeOptions,
  Value: CortexViewTypeValue,
} = createEnumOptions(scopedTranslation, {
  LIST: "enums.viewType.list",
  KANBAN: "enums.viewType.kanban",
  CALENDAR: "enums.viewType.calendar",
  GRID: "enums.viewType.grid",
  WIKI: "enums.viewType.wiki",
} as const);

export type CortexViewTypeValue = typeof CortexViewTypeValue;

export const CortexViewTypeDB = [
  CortexViewType.LIST,
  CortexViewType.KANBAN,
  CortexViewType.CALENDAR,
  CortexViewType.GRID,
  CortexViewType.WIKI,
] as const;

/**
 * Cortex Sync Policy: controls whether a directory syncs to remote instances
 */
export const {
  enum: CortexSyncPolicy,
  options: CortexSyncPolicyOptions,
  Value: CortexSyncPolicyValue,
} = createEnumOptions(scopedTranslation, {
  SYNC: "enums.syncPolicy.sync",
  LOCAL: "enums.syncPolicy.local",
} as const);

export type CortexSyncPolicyValue = typeof CortexSyncPolicyValue;

export const CortexSyncPolicyDB = [
  CortexSyncPolicy.SYNC,
  CortexSyncPolicy.LOCAL,
] as const;

/**
 * Cortex Credit Feature: identifies which cortex operation triggered a credit deduction
 */
export const {
  enum: CortexCreditFeature,
  options: CortexCreditFeatureOptions,
  Value: CortexCreditFeatureValue,
} = createEnumOptions(scopedTranslation, {
  WRITE: "enums.creditFeature.write",
  EDIT: "enums.creditFeature.edit",
  SEARCH: "enums.creditFeature.search",
  EMBEDDING: "enums.creditFeature.embedding",
} as const);

export type CortexCreditFeatureValue = typeof CortexCreditFeatureValue;
