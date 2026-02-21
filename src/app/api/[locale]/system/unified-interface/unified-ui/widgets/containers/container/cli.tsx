/**
 * Container Widget - Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/widget-data";
import {
  useInkWidgetResponseOnly,
  useInkWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import { InkWidgetRenderer } from "../../../renderers/cli/CliWidgetRenderer";
import type { FieldUsageConfig, InkWidgetProps } from "../../_shared/cli-types";
import { withValueNonStrict } from "../../_shared/field-helpers";
import {
  hasChildren,
  isObject,
  isResponseField,
} from "../../_shared/type-guards";
import type {
  ArrayChildConstraint,
  ConstrainedChildUsage,
  ObjectChildrenConstraint,
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

export function ContainerWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
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
  const t = useInkWidgetTranslation();
  const responseOnly = useInkWidgetResponseOnly();
  const { title: titleKey, description: descriptionKey } = field;

  // Get translated title and description
  const title = titleKey ? t(titleKey) : undefined;
  const description = descriptionKey ? t(descriptionKey) : undefined;

  // Container can have children (object), child (array), or variants (union)
  // Only object containers with children are rendered here
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
