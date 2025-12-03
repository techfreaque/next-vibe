/**
 * Widget Logic Index
 * Central export for all widget data extraction and processing logic
 * Used by both React and CLI widget implementations
 */

export * from "./accordion";
export * from "./avatar";
export * from "./badge";
export * from "./code-output";
export {
  extractCodeQualityListData,
  groupCodeQualityItems,
  sortBySeverity,
  countCodeQualityBySeverity,
  type CodeQualityItem,
  type ProcessedCodeQualityList,
} from "./code-quality-list";
export * from "./container";
export * from "./data-card";
export * from "./data-cards";
export * from "./data-list";
export * from "./data-table";
export * from "./editable-text";
export * from "./empty-state";
export * from "./errors";
export * from "./grouped-list";
export * from "./link";
export * from "./link-card";
export * from "./link-list";
export * from "./loading";
export * from "./markdown";
export * from "./metric-card";
export * from "./section";
export * from "./stats-grid";
export * from "./tabs";
export * from "./text";
export * from "./title";
