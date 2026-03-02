/**
 * Lazy Widget Renderer
 *
 * Wraps WidgetRenderer in React.lazy so its large dependency tree
 * (all widget components) is only loaded when actually needed.
 *
 * When an endpoint uses a custom widget at the root (customWidgetObject with render),
 * EndpointRenderer renders the custom component directly, and this module
 * is never imported — avoiding the cost of loading every widget type.
 */

"use client";

import React, { Suspense } from "react";
import type { z } from "zod";

import type { InlineButtonInfo } from "../../widgets/_shared/field-helpers";
import type {
  AnyChildrenConstrain,
  ConstrainedChildUsage,
  DispatchField,
  FieldUsageConfig,
} from "../../widgets/_shared/types";

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

// oxlint-disable-next-line typescript/no-explicit-any
const LazyWidget: React.ComponentType<WidgetRendererProps> = React.lazy(
  () =>
    import("./WidgetRenderer").then((mod) => ({
      default: mod.WidgetRenderer as React.ComponentType<WidgetRendererProps>,
    })) as Promise<{
      default: React.ComponentType<WidgetRendererProps>;
    }>,
);

/**
 * Lazy-loaded WidgetRenderer wrapper.
 * Same props as WidgetRenderer, loaded on demand.
 */
export function LazyWidgetRenderer(
  props: WidgetRendererProps,
): React.JSX.Element {
  return (
    <Suspense>
      <LazyWidget {...props} />
    </Suspense>
  );
}

LazyWidgetRenderer.displayName = "LazyWidgetRenderer";
