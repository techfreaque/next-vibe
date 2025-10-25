/**
 * React Widget Components
 * Platform-specific implementations for web
 */

// Text widgets
export { MarkdownWidget } from "./MarkdownWidget";
export { TextWidget } from "./TextWidget";

// Link widgets
export { type LinkCardData, LinkCardWidget } from "./LinkCardWidget";
export { type LinkListData, LinkListWidget } from "./LinkListWidget";
export { LinkWidget } from "./LinkWidget";

// Code widgets
export { CodeOutputWidget } from "./CodeOutputWidget";

// Data widgets
export { DataCardsWidget, type DataCardsWidgetData } from "./DataCardsWidget";
export { DataTableWidget } from "./DataTableWidget";
export { GroupedListWidget } from "./GroupedListWidget";

// Metric widgets
export { MetricCardWidget } from "./MetricCardWidget";
export { StatsGridWidget } from "./StatsGridWidget";

// Layout widgets
export { ContainerWidget } from "./ContainerWidget";

// Editable widgets
export { EditableTextWidget } from "./EditableTextWidget";

// Widget renderer
export { WidgetRenderer, type WidgetRendererProps } from "./WidgetRenderer";

// CRUD operations
export {
  ToolActionHandler,
  type ToolActionHandlerProps,
  useWidgetActions,
} from "./ToolActionHandler";

// Error handling
export { WidgetErrorBoundary } from "./WidgetErrorBoundary";

// Widget states
export {
  WidgetEmptyState,
  WidgetLoading,
  WidgetSkeleton,
} from "./WidgetStates";
