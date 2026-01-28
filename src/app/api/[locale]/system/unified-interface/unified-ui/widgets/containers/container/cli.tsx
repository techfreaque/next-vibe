/**
 * Container Widget - Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";
import type { ZodTypeAny } from "zod";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/widgets/configs";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/widget-data";

import { InkWidgetRenderer } from "../../../renderers/cli/CliWidgetRenderer";
import type { FieldUsageConfig, InkWidgetProps } from "../../_shared/cli-types";
import { isResponseField } from "../../_shared/type-guards";
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
  context,
  fieldName,
}: InkWidgetProps<
  TEndpoint,
  ContainerWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
>): JSX.Element {
  const { title: titleKey, description: descriptionKey } = field;

  // Get translated title and description
  const title = titleKey ? context.t(titleKey) : undefined;
  const description = descriptionKey ? context.t(descriptionKey) : undefined;

  // Container can have children (object), child (array), or variants (union)
  // Check which property exists and handle accordingly
  if (!("children" in field)) {
    // For array containers (with child) or union containers (with variants),
    // this should be handled differently
    return <></>;
  }

  // field.children is typed as TChildren (Record<string, UnifiedField>)
  // value is typed as InferChildrenOutput<TChildren> which is { [K in keyof TChildren]: InferFieldOutput<TChildren[K]> }
  // oxlint-disable-next-line typescript/no-explicit-any
  const children: Array<
    [
      string,
      UnifiedField<
        string,
        ZodTypeAny,
        FieldUsageConfig,
        // oxlint-disable-next-line typescript/no-explicit-any
        any
      >,
    ]
  > = Object.entries(field.children);

  // Type-safe value accessor
  const valueRecord = field.value as
    | Record<string, WidgetData>
    | null
    | undefined;

  // Filter children based on responseOnly mode
  const filteredChildren = children.filter(([childName, childField]) => {
    // In responseOnly mode, only show response fields with data
    if (context.responseOnly) {
      if (!isResponseField(childField)) {
        return false;
      }
      const childData = valueRecord?.[childName];
      return childData !== null && childData !== undefined;
    }
    // In interactive mode, show all fields but filter response fields without data
    if (isResponseField(childField)) {
      const childData = valueRecord?.[childName];
      return childData !== null && childData !== undefined;
    }
    return true;
  });

  // Render all filtered children
  const childElements: JSX.Element[] = [];
  for (let i = 0; i < filteredChildren.length; i++) {
    const [childName, childField] = filteredChildren[i];
    const childData = valueRecord?.[childName] ?? null;
    const childFieldName = fieldName ? `${fieldName}.${childName}` : childName;

    childElements.push(
      <Box key={childName}>
        <InkWidgetRenderer
          field={Object.assign({}, childField, { value: childData })}
          fieldName={childFieldName}
          context={context}
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
