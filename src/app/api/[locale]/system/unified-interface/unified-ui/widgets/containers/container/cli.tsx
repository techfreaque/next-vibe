/**
 * Container Widget - Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/widget-data";
import {
  useInkWidgetResponseOnly,
  useInkWidgetShowLabels,
  useInkWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import { InkWidgetRenderer } from "../../../renderers/cli/CliWidgetRenderer";
import type {
  FieldUsageConfig,
  InkWidgetProps,
  InkWidgetRendererProps,
} from "../../_shared/cli-types";
import { withValueNonStrict } from "../../_shared/field-helpers";
import {
  hasChild,
  hasChildren,
  isObject,
  isResponseField,
} from "../../_shared/type-guards";
import type {
  AnyChildrenConstrain,
  ArrayChildConstraint,
  ConstrainedChildUsage,
  ObjectChildrenConstraint,
  SchemaTypes,
  UnionObjectWidgetConfigConstrain,
} from "../../_shared/types";
import type {
  ContainerArrayWidgetConfig,
  ContainerObjectWidgetConfig,
  ContainerUnionWidgetConfig,
} from "./types";

/**
 * Helper to safely get a value from field.value after hasChildren guard
 * The type guard narrows to Record but TypeScript can't track this through
 * the union, so we use isObject runtime check
 */
function getChildValue(
  value: WidgetData,
  key: string,
): WidgetData | null | undefined {
  if (!isObject(value)) {
    return null;
  }
  return value[key];
}

/**
 * Dispatch boundary helpers for container widgets.
 * Container widgets render heterogeneous children whose Zod output types
 * are structurally compatible with WidgetData but can't be proven at the
 * generic level. These helpers bridge the gap (same pattern as React
 * MultiWidgetRenderer which uses `as never`).
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- dispatch boundary coercion
function coerceToWidgetData(value: any): WidgetData {
  return value;
}

function toWidgetDataArray(value: WidgetData): WidgetData[] {
  return Array.isArray(value) ? value : [];
}

function dispatchChildField(
  child: AnyChildrenConstrain<string, FieldUsageConfig>,
  item: WidgetData,
  parentValue: WidgetData,
): InkWidgetRendererProps["field"] {
  const augmented = withValueNonStrict(child, item, parentValue);
  // Dispatch boundary: the child template + value is structurally a DispatchField
  // but TypeScript can't prove it across the container generic boundary.
  // The switch-discriminant in CliWidgetRenderer guarantees runtime safety.
  return augmented as InkWidgetRendererProps["field"];
}

export function ContainerWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends TEndpoint extends CreateApiEndpointAny
    ? TEndpoint["scopedTranslation"]["ScopedTranslationKey"]
    : never,
  TUsage extends FieldUsageConfig,
  TSchemaType extends
    | "object"
    | "object-optional"
    | "object-union"
    | "array"
    | "array-optional",
  TChildren extends
    | ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>
    | UnionObjectWidgetConfigConstrain<TKey, ConstrainedChildUsage<TUsage>>
    | ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>,
>({
  field,
  fieldName,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  | ContainerObjectWidgetConfig<
      TKey,
      TUsage,
      Extract<TSchemaType, "object" | "object-optional" | "widget-object">,
      Extract<
        TChildren,
        ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>
      >
    >
  | ContainerArrayWidgetConfig<
      TKey,
      TUsage,
      Extract<TSchemaType, "array" | "array-optional">,
      Extract<
        TChildren,
        ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>
      >
    >
  | ContainerUnionWidgetConfig<
      TKey,
      TUsage,
      Extract<
        TChildren,
        UnionObjectWidgetConfigConstrain<TKey, ConstrainedChildUsage<TUsage>>
      >
    >
>): JSX.Element {
  const t = useInkWidgetTranslation<TEndpoint>();
  const responseOnly = useInkWidgetResponseOnly();
  const showLabels = useInkWidgetShowLabels();
  const { title: titleKey, description: descriptionKey } = field;

  // Get translated title and description
  const title = showLabels && titleKey ? t(titleKey) : undefined;
  const description =
    showLabels && descriptionKey ? t(descriptionKey) : undefined;

  // Container can have children (object) or child (array)
  // Handle array containers — render each item using the child template
  const structField: { schemaType: SchemaTypes } = field;
  if (hasChild(structField)) {
    const parentValue = coerceToWidgetData(field.value);
    const items = toWidgetDataArray(parentValue);
    if (items.length === 0) {
      return <></>;
    }

    return (
      <Box flexDirection="column">
        {title && (
          <Box marginBottom={1}>
            <Text bold>{title}</Text>
          </Box>
        )}
        {description && (
          <Box marginBottom={1}>
            <Text dimColor>{description}</Text>
          </Box>
        )}
        {items.map((item: WidgetData, index: number) => {
          const itemFieldName = fieldName
            ? `${fieldName}[${String(index)}]`
            : `[${String(index)}]`;
          return (
            <Box key={String(index)} marginBottom={1}>
              <InkWidgetRenderer
                field={dispatchChildField(structField.child, item, parentValue)}
                fieldName={itemFieldName}
              />
            </Box>
          );
        })}
      </Box>
    );
  }

  // Object containers with children
  if (!hasChildren(field)) {
    return <></>;
  }

  const children = Object.entries(field.children);

  // Filter and render children - avoid type predicate in destructure
  const childElements: JSX.Element[] = [];
  for (const [childName, childField] of children) {
    // Skip hidden fields
    const hidden = "hidden" in childField && childField.hidden === true;
    if (hidden) {
      continue;
    }

    // In responseOnly mode, only show response fields with data
    if (responseOnly) {
      if (!isResponseField(childField)) {
        continue;
      }
      const childData = getChildValue(field.value, childName);
      const hasData = childData !== null && childData !== undefined;
      if (!hasData) {
        continue;
      }
    } else {
      // In interactive mode, show all fields but filter response fields without data
      if (isResponseField(childField)) {
        const childData = getChildValue(field.value, childName);
        if (childData === null || childData === undefined) {
          continue;
        }
      }
    }

    const childData = getChildValue(field.value, childName) ?? null;
    const childFieldName = fieldName ? `${fieldName}.${childName}` : childName;
    childElements.push(
      <Box key={childName}>
        <InkWidgetRenderer
          field={
            withValueNonStrict(
              childField,
              childData ?? null,
              field.value,
            ) as never
          }
          fieldName={childFieldName}
        />
      </Box>,
    );
  }

  return (
    <Box flexDirection="column">
      {title && (
        <Box marginBottom={1}>
          <Text bold>{title}</Text>
        </Box>
      )}
      {description && (
        <Box marginBottom={1}>
          <Text dimColor>{description}</Text>
        </Box>
      )}
      {childElements}
    </Box>
  );
}
