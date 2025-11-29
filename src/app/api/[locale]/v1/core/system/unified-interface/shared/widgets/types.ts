import type React from "react";

import type { WidgetType } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { Platform } from "../types/platform";
import type { UnifiedField } from "../types/endpoint";

export type WidgetData =
  | string
  | number
  | boolean
  | null
  | undefined
  | string[]
  | number[]
  | WidgetData[]
  | { [key: string]: WidgetData };

export interface WidgetInput {
  field: UnifiedField;
  value: WidgetData;
  context: WidgetRenderContext;
}

export type WidgetActionType =
  | "click"
  | "edit"
  | "delete"
  | "create"
  | "navigate"
  | "refresh"
  | "retry"
  | "cancel"
  | "submit";

export type WidgetActionPayload =
  | { type: "click"; fieldName: string; value?: string | number | boolean }
  | { type: "edit"; fieldName: string; oldValue: string; newValue: string }
  | { type: "delete"; id: string }
  | { type: "create"; data: Record<string, string | number | boolean> }
  | { type: "navigate"; url: string }
  | { type: "refresh" }
  | { type: "retry" }
  | { type: "cancel" }
  | { type: "submit"; data: Record<string, string | number | boolean> };

export interface WidgetAction {
  type: WidgetActionType;
  payload: WidgetActionPayload;
  metadata?: {
    fieldName?: string;
    fieldPath?: string;
    timestamp?: number;
  };
}

export interface WidgetRenderContext {
  locale: CountryLanguage;
  isInteractive: boolean;
  permissions: readonly UserRoleValue[];
  onNavigate?: (url: string) => void;
  onAction?: (action: WidgetAction) => void | Promise<void>;
  platform?:
    | typeof Platform.TRPC
    | typeof Platform.NEXT_PAGE
    | typeof Platform.NEXT_API
    | typeof Platform.CLI;
  theme?: "light" | "dark" | "system";
  endpointFields?: Record<string, unknown>; // Original endpoint fields for nested path lookup
  disabled?: boolean; // Disable all form inputs
}

export interface WidgetComponentProps {
  field: UnifiedField;
  fieldName?: string; // Field name for form fields (e.g., "email", "password")
  value: WidgetData;
  context: WidgetRenderContext;
  onAction?: (action: WidgetAction) => void | Promise<void>;
  className?: string;
  form?: unknown;
}

export type WidgetRenderer = (
  props: WidgetComponentProps,
) => React.ReactElement | string | null;

export interface WidgetRegistryEntry {
  type: WidgetType;
  component: React.ComponentType<WidgetComponentProps> | WidgetRenderer;
  platforms?: Array<
    | typeof Platform.TRPC
    | typeof Platform.NEXT_PAGE
    | typeof Platform.NEXT_API
    | typeof Platform.CLI
  >;
  supportsEditing?: boolean;
  supportsCRUD?: boolean;
}

export interface WidgetErrorBoundaryProps {
  children: React.ReactNode;
  locale: CountryLanguage;
  fallback?: React.ReactElement;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export interface WidgetLoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export interface WidgetEmptyStateProps {
  message: string;
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
