/**
 * Widget Renderer wrapper.
 *
 * Previously used React.lazy to defer loading WidgetRenderer's large dependency
 * tree. Removed lazy loading because the empty <Suspense> fallback caused a
 * visible blank flash during SSR→client hydration on any page with a widget.
 */

"use client";

import React from "react";
import type { z } from "zod";

import type { InlineButtonInfo } from "../../widgets/_shared/field-helpers";
import type {
  AnyChildrenConstrain,
  ConstrainedChildUsage,
  DispatchField,
  FieldUsageConfig,
} from "../../widgets/_shared/types";
import { WidgetRenderer } from "./WidgetRenderer";

/** Props accepted by the WidgetRenderer (type-only, no runtime cost) */
interface WidgetRendererProps {
  fieldName: string;
  field: DispatchField<
    string,
    z.ZodTypeAny,
    FieldUsageConfig,
    AnyChildrenConstrain<string, ConstrainedChildUsage<FieldUsageConfig>>
  >;
  inlineButtonInfo?: InlineButtonInfo;
}

/**
 * WidgetRenderer wrapper - same props, no lazy loading.
 */
export function LazyWidgetRenderer(
  props: WidgetRendererProps,
): React.JSX.Element {
  return <WidgetRenderer {...props} />;
}

LazyWidgetRenderer.displayName = "LazyWidgetRenderer";
