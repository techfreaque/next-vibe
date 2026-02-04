/**
 * Container Widget - Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import {
  useInkWidgetResponseOnly,
  useInkWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import { InkWidgetRenderer } from "../../../renderers/cli/CliWidgetRenderer";
import type { FieldUsageConfig, InkWidgetProps } from "../../_shared/cli-types";
import { withValue } from "../../_shared/field-helpers";
import { hasChildren, isResponseField } from "../../_shared/type-guards";
import type {
  ArrayChildConstraint,
  ConstrainedChildUsage,
  ObjectChildrenConstraint,
  UnionObjectWidgetConfigConstrain,
} from "../../_shared/types";
import type { ContainerWidgetConfig } from "./types";

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
  ContainerWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
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
  const valueRecord = field.value;

  // Filter and render children - avoid type predicate in destructure
  const childElements: JSX.Element[] = [];
  for (const entry of children) {
    const childName = entry[0];
    const childField = entry[1];

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
      const childData = valueRecord[childName];
      const hasData = childData !== null && childData !== undefined;
      if (!hasData) {
        continue;
      }
    } else {
      // In interactive mode, show all fields but filter response fields without data
      if (isResponseField(childField)) {
        const childData = valueRecord[childName];
        if (childData === null || childData === undefined) {
          continue;
        }
      }
    }

    const childData = valueRecord[childName] ?? null;
    const childFieldName = fieldName ? `${fieldName}.${childName}` : childName;
    childElements.push(
      <Box key={childName}>
        <InkWidgetRenderer
          field={withValue(childField, childData, valueRecord)}
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
