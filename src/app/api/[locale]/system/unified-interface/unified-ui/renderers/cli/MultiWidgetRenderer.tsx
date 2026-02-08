import { Box } from "ink";
import type { ReactElement } from "react";
import { useMemo } from "react";
import type z from "zod";

import type { InferResponseOutput } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";

import { withValue } from "../../widgets/_shared/field-helpers";
import type {
  AnyChildrenConstrain,
  ArrayChildConstraint,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
  UnionObjectWidgetConfigConstrain,
} from "../../widgets/_shared/types";
import {
  ChildrenDataRenderer,
  type ProcessedChildren,
} from "./ChildrenDataRenderer";
import { InkWidgetRenderer } from "./CliWidgetRenderer";

/**
 * Render a processed child inline group
 */
function renderInlineGroup<TEndpoint extends CreateApiEndpointAny>(
  group: ProcessedChildren["inlineGroups"] extends Map<string, infer G>
    ? G
    : never,
  fieldName: string | undefined,
): ReactElement {
  return (
    <Box gap={1}>
      {group.fields.map(({ name, field, data }) => {
        const childFieldName = fieldName ? `${fieldName}.${name}` : name;

        return (
          <InkWidgetRenderer<TEndpoint>
            key={name}
            fieldName={childFieldName}
            field={withValue(field, data, undefined)}
          />
        );
      })}
    </Box>
  );
}

/**
 * Props for rendering a Record of named fields
 */
interface ObjectChildrenRendererProps<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TChildren extends ObjectChildrenConstraint<TKey, TUsage>,
> {
  childrenSchema: TChildren;
  value:
    | {
        [K in keyof TChildren]: InferResponseOutput<TChildren[K]>;
      }
    | null
    | undefined;
  fieldName: string | undefined;
}

/**
 * Props for rendering array items
 */
interface ArrayChildRendererProps<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TChild extends AnyChildrenConstrain<TKey, TUsage>,
> {
  childSchema: TChild;
  value: Array<InferResponseOutput<TChild>> | null | undefined;
  fieldName: string | undefined;
  /** Optional render callback to customize how each item is rendered */
  renderItem?: (props: {
    itemData: InferResponseOutput<TChild>;
    index: number;
    itemFieldName: string;
    childSchema: TChild;
  }) => ReactElement | null;
}

/**
 * Props for rendering union variants
 */
interface UnionObjectRendererProps<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TVariants extends UnionObjectWidgetConfigConstrain<TKey, TUsage>,
> {
  variantSchemas: TVariants;
  value:
    | {
        [K in keyof ObjectChildrenConstraint<
          TKey,
          ConstrainedChildUsage<TUsage>
        >]: InferResponseOutput<
          ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>[K]
        >;
      }
    | null
    | undefined;
  fieldName: string | undefined;
  discriminator: string | undefined;
  watchedDiscriminatorValue: string | undefined;
}

/**
 * ObjectChildrenRenderer - Renders a Record of named fields
 * Handles layout and field grouping for inline fields
 */
export function ObjectChildrenRenderer<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TChildren extends ObjectChildrenConstraint<TKey, TUsage>,
  TEndpoint extends CreateApiEndpointAny,
>({
  childrenSchema,
  value,
  fieldName,
}: ObjectChildrenRendererProps<TKey, TUsage, TChildren>): ReactElement {
  const processed = useMemo(() => {
    if (!childrenSchema) {
      return undefined;
    }
    const extracted = ChildrenDataRenderer.extractChildren(
      childrenSchema,
      value,
    );
    const sorted = ChildrenDataRenderer.sortChildren(extracted);
    const groupResult = ChildrenDataRenderer.groupInlineFields(sorted);
    return {
      children: sorted,
      inlineGroups: groupResult.groups,
      inlineGroupMembers: groupResult.members,
    };
  }, [childrenSchema, value]);

  if (!processed || processed.children.length === 0) {
    return <></>;
  }

  const result: ReactElement[] = [];

  for (const child of processed.children) {
    // Skip if part of inline group (will be rendered as group)
    if (processed.inlineGroupMembers.has(child.name)) {
      // Only render once per group (at first child)
      const group = [...processed.inlineGroups.values()].find((g) =>
        g.fields.some((f) => f.name === child.name),
      );
      if (group && group.fields[0].name === child.name) {
        const groupElement = renderInlineGroup<TEndpoint>(group, fieldName);
        result.push(groupElement);
      }
      continue;
    }

    // Regular non-inline child
    const childFieldName = fieldName
      ? `${fieldName}.${child.name}`
      : child.name;

    const element = (
      <InkWidgetRenderer<TEndpoint>
        key={child.name}
        fieldName={childFieldName}
        field={withValue(child.field, child.data, value ?? null)}
      />
    );

    result.push(element);
  }

  return <>{result}</>;
}

ObjectChildrenRenderer.displayName = "ObjectChildrenRenderer";

/**
 * ArrayChildRenderer - Renders array items with a single child type
 */
export function ArrayChildRenderer<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TChild extends AnyChildrenConstrain<TKey, TUsage>,
  TEndpoint extends CreateApiEndpointAny,
>({
  childSchema,
  value,
  fieldName,
  renderItem,
}: ArrayChildRendererProps<TKey, TUsage, TChild>): ReactElement {
  if (!childSchema || !value || !Array.isArray(value)) {
    return <></>;
  }

  // If custom renderItem provided, use it
  if (renderItem) {
    return (
      <>
        {value.map((itemData, index) => {
          const itemFieldName = fieldName
            ? `${fieldName}.${index}`
            : String(index);

          return renderItem({
            itemData,
            index,
            itemFieldName,
            childSchema,
          });
        })}
      </>
    );
  }

  // Default rendering
  return (
    <Box flexDirection="column" gap={1}>
      {value.map((itemData, index) => {
        const itemFieldName = fieldName
          ? `${fieldName}.${index}`
          : String(index);

        return (
          <InkWidgetRenderer<TEndpoint>
            key={index}
            fieldName={itemFieldName}
            field={withValue(childSchema, itemData, null)}
          />
        );
      })}
    </Box>
  );
}

ArrayChildRenderer.displayName = "ArrayChildRenderer";

/**
 * UnionObjectRenderer - Renders discriminated union variants
 * Selects the correct variant based on discriminator value
 */
export function UnionObjectRenderer<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TVariants extends UnionObjectWidgetConfigConstrain<TKey, TUsage>,
>({
  variantSchemas: variants,
  value,
  fieldName,
  discriminator,
  watchedDiscriminatorValue,
}: UnionObjectRendererProps<TKey, TUsage, TVariants>): ReactElement {
  if (!variants || variants.length === 0 || !discriminator) {
    return <></>;
  }

  // Get discriminator value from watch or value prop
  let discriminatorValue: string | undefined;
  if (watchedDiscriminatorValue !== undefined) {
    discriminatorValue = watchedDiscriminatorValue;
  } else if (value && discriminator && discriminator in value) {
    const val = value[discriminator];
    if (typeof val === "string") {
      discriminatorValue = val;
    }
  }

  // Find matching variant based on discriminator value
  const selectedVariant = variants.find((variant) => {
    if (!discriminator || !("children" in variant) || !variant.children) {
      return false;
    }

    const variantDiscriminator = variant.children[discriminator];

    if (!variantDiscriminator) {
      return false;
    }

    // For primitive fields with literals, check the schema value
    if (
      "schemaType" in variantDiscriminator &&
      variantDiscriminator.schemaType === "primitive" &&
      "schema" in variantDiscriminator
    ) {
      const schema = variantDiscriminator.schema as z.ZodTypeAny;

      // Zod stores literal values in schema._def.values array for z.literal()
      if ("_def" in schema && "values" in schema._def) {
        const def = schema._def as {
          values?: Array<string | number | bigint | boolean | null | undefined>;
        };
        if (def.values && def.values.length > 0) {
          const literalValue = def.values[0];
          const matches = literalValue === discriminatorValue;

          return matches;
        }
      }

      return false;
    }

    return false;
  });

  // Build children from selected variant or first variant (for discriminator)
  const childrenToRender: ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  > = {};

  // Get reference variant for discriminator field
  const referenceVariant = selectedVariant || variants[0];

  if (
    referenceVariant &&
    discriminator &&
    "children" in referenceVariant &&
    referenceVariant.children
  ) {
    // Add discriminator field first from reference variant
    const refChildren = referenceVariant.children;
    if (discriminator in refChildren) {
      const discriminatorField = refChildren[discriminator];
      if (discriminatorField) {
        childrenToRender[discriminator] = discriminatorField;
      }
    }

    // Then add other fields from selected variant (if it differs from reference)
    if (
      selectedVariant &&
      "children" in selectedVariant &&
      selectedVariant.children
    ) {
      const selectedChildren = selectedVariant.children;
      for (const key in selectedChildren) {
        if (Object.prototype.hasOwnProperty.call(selectedChildren, key)) {
          if (key !== discriminator) {
            const field = selectedChildren[key];
            if (field) {
              childrenToRender[key] = field;
            }
          }
        }
      }
    }
  }

  // Render using ObjectChildrenRenderer
  return (
    <ObjectChildrenRenderer
      childrenSchema={childrenToRender}
      value={value ?? undefined}
      fieldName={fieldName}
    />
  );
}

UnionObjectRenderer.displayName = "UnionObjectRenderer";

/**
 * Helper type to infer value type from children schema
 */
export interface MultiWidgetRendererProps<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TChildrenSchema extends
    | ObjectChildrenConstraint<TKey, TUsage>
    | ArrayChildConstraint<TKey, TUsage>
    | UnionObjectWidgetConfigConstrain<TKey, TUsage>
    | undefined = undefined,
> {
  childrenSchema: TChildrenSchema;
  value:
    | {
        [K in keyof ObjectChildrenConstraint<
          TKey,
          TUsage
        >]: InferResponseOutput<ObjectChildrenConstraint<TKey, TUsage>[K]>;
      }
    | {
        [K in keyof ObjectChildrenConstraint<
          TKey,
          ConstrainedChildUsage<TUsage>
        >]: InferResponseOutput<
          ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>[K]
        >;
      }
    | Array<InferResponseOutput<AnyChildrenConstrain<TKey, TUsage>>>
    | null
    | undefined;
  fieldName: string | undefined;
  discriminator?: string;
  watchedDiscriminatorValue?: string;
  /** Optional render callback for array items to customize rendering */
  renderItem?: (props: {
    itemData: InferResponseOutput<AnyChildrenConstrain<TKey, TUsage>>;
    index: number;
    itemFieldName: string;
    childSchema: AnyChildrenConstrain<TKey, TUsage>;
  }) => ReactElement | null;
}

/**
 * Type guard to check if children is a union of variants
 */
function isUnionVariants<TKey extends string, TUsage extends FieldUsageConfig>(
  children:
    | ObjectChildrenConstraint<TKey, TUsage>
    | ArrayChildConstraint<TKey, TUsage>
    | UnionObjectWidgetConfigConstrain<TKey, TUsage>
    | undefined,
): children is UnionObjectWidgetConfigConstrain<TKey, TUsage> {
  return (
    Array.isArray(children) &&
    children.length > 0 &&
    children[0] &&
    "children" in children[0]
  );
}

/**
 * Type guard to check if children is a single child constraint (array element)
 */
function isArrayChild<TKey extends string, TUsage extends FieldUsageConfig>(
  children:
    | ObjectChildrenConstraint<TKey, TUsage>
    | ArrayChildConstraint<TKey, TUsage>
    | UnionObjectWidgetConfigConstrain<TKey, TUsage>
    | undefined,
): children is ArrayChildConstraint<TKey, TUsage> {
  return (
    children !== undefined &&
    !Array.isArray(children) &&
    children !== null &&
    "type" in children
  );
}

/**
 * MultiWidgetRenderer - Main component that routes to appropriate sub-renderer
 * Automatically detects constraint type and delegates rendering
 */
export function MultiWidgetRenderer<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TChildrenSchema extends
    | ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>
    | ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>
    | UnionObjectWidgetConfigConstrain<TKey, ConstrainedChildUsage<TUsage>>
    | undefined = undefined,
  TEndpoint extends CreateApiEndpointAny = CreateApiEndpointAny,
>({
  childrenSchema,
  value,
  fieldName,
  discriminator,
  watchedDiscriminatorValue,
  renderItem,
}: MultiWidgetRendererProps<TKey, TUsage, TChildrenSchema>): ReactElement {
  if (!childrenSchema) {
    return <></>;
  }

  // Check for union variants first
  const isUnion = isUnionVariants<TKey, TUsage>(childrenSchema);

  if (isUnion) {
    const objectValue:
      | InferChildrenOutput<
          ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>
        >
      | null
      | undefined = (!Array.isArray(value) ? value : null) as
      | InferChildrenOutput<
          ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>
        >
      | null
      | undefined;
    return (
      <UnionObjectRenderer<TKey, TUsage, typeof childrenSchema>
        variantSchemas={childrenSchema}
        value={objectValue}
        fieldName={fieldName}
        discriminator={discriminator}
        watchedDiscriminatorValue={watchedDiscriminatorValue}
      />
    );
  }

  // Check for array child constraint
  if (isArrayChild<TKey, TUsage>(childrenSchema)) {
    const arrayValue:
      | InferChildOutput<typeof childrenSchema>[]
      | null
      | undefined = Array.isArray(value)
      ? (value as InferChildOutput<typeof childrenSchema>[])
      : null;
    return (
      <ArrayChildRenderer<TKey, TUsage, typeof childrenSchema, TEndpoint>
        childSchema={childrenSchema}
        value={arrayValue}
        fieldName={fieldName}
        renderItem={renderItem}
      />
    );
  }

  // ObjectChildrenConstraint is a Record<string, ...>
  const objectChildren: ObjectChildrenConstraint<TKey, TUsage> = childrenSchema;
  const objectValue:
    | InferChildrenOutput<typeof objectChildren>
    | null
    | undefined = (!Array.isArray(value) ? value : null) as
    | InferChildrenOutput<typeof objectChildren>
    | null
    | undefined;
  return (
    <ObjectChildrenRenderer<TKey, TUsage, typeof objectChildren, TEndpoint>
      childrenSchema={objectChildren}
      value={objectValue}
      fieldName={fieldName}
    />
  );
}

MultiWidgetRenderer.displayName = "MultiWidgetRenderer";
