"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import { useMemo } from "react";
import type { Path } from "react-hook-form";
import { useWatch } from "react-hook-form";
import type z from "zod";

import type { InferResponseOutput } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/widget-data";

import { withValue } from "../../widgets/_shared/field-helpers";
import type {
  AnyChildrenConstrain,
  ArrayChildConstraint,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
  UnionObjectWidgetConfigConstrain,
} from "../../widgets/_shared/types";
import { useWidgetForm } from "../../widgets/_shared/use-widget-context";
import {
  ChildrenDataRenderer,
  type ProcessedChildren,
} from "./ChildrenDataRenderer";
import { WidgetRenderer } from "./WidgetRenderer";

/**
 * Get grid column span class from columns property
 * Maps columns number to Tailwind col-span classes
 * IMPORTANT: FULL class strings for Tailwind purge!
 */
function getColumnSpanClass(columns: number | undefined): string {
  if (!columns || columns <= 0) {
    return "";
  }

  // JIT-safe col-span classes mapping
  const colSpanMap: Record<number, string> = {
    1: "col-span-1",
    2: "col-span-2",
    3: "col-span-3",
    4: "col-span-4",
    5: "col-span-5",
    6: "col-span-6",
    7: "col-span-7",
    8: "col-span-8",
    9: "col-span-9",
    10: "col-span-10",
    11: "col-span-11",
    12: "col-span-12",
  };

  return colSpanMap[columns] ?? "";
}

/**
 * Render a processed child inline group as flex container
 */
function renderInlineGroup<TEndpoint extends CreateApiEndpointAny>(
  group: ProcessedChildren["inlineGroups"] extends Map<string, infer G>
    ? G
    : never,
  fieldName: string | undefined,
): JSX.Element {
  return (
    <Div className="flex items-center gap-2">
      {group.fields.map(({ name, field, data, columns }) => {
        const childFieldName = fieldName ? `${fieldName}.${name}` : name;
        const columnSpanClass = getColumnSpanClass(columns);

        const element = (
          <WidgetRenderer<TEndpoint>
            key={name}
            fieldName={
              childFieldName as Path<TEndpoint["types"]["RequestOutput"]>
            }
            field={withValue(field, data, undefined)}
          />
        );

        return columnSpanClass ? (
          <Div key={name} className={columnSpanClass}>
            {element}
          </Div>
        ) : (
          element
        );
      })}
    </Div>
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
  value: Array<WidgetData> | null | undefined;
  fieldName: string | undefined;
  /** Optional render callback to customize how each item is rendered */
  renderItem?: (props: {
    itemData: WidgetData;
    index: number;
    itemFieldName: string;
    childSchema: TChild;
  }) => JSX.Element;
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
  value: Record<string, WidgetData> | null | undefined;
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
}: ObjectChildrenRendererProps<TKey, TUsage, TChildren>): JSX.Element {
  const form = useWidgetForm();

  // Check if any child has a hidden function (request fields need form data)
  const hasRequestFields =
    childrenSchema &&
    Object.values(childrenSchema).some(
      (field) => field && "usage" in field && field.usage?.request,
    );

  // Watch entire form root to get all form data
  const formDataRoot = useWatch({
    control: form?.control,
    disabled: !form || !hasRequestFields,
  }) as Record<string, WidgetData> | undefined;

  // Merge form data with response data
  const mergedValue = useMemo(() => {
    if (!formDataRoot) {
      return value;
    }
    // Deep merge: form data takes precedence over response data
    return { ...value, ...formDataRoot };
  }, [formDataRoot, value]);

  const processed = useMemo(() => {
    if (!childrenSchema) {
      return undefined;
    }
    const extracted = ChildrenDataRenderer.extractChildren(
      childrenSchema,
      mergedValue,
    );
    const sorted = ChildrenDataRenderer.sortChildren(extracted);
    const groupResult = ChildrenDataRenderer.groupInlineFields(sorted);
    return {
      children: sorted,
      inlineGroups: groupResult.groups,
      inlineGroupMembers: groupResult.members,
    };
  }, [childrenSchema, mergedValue]);

  if (!processed || processed.children.length === 0) {
    return <></>;
  }

  const result: JSX.Element[] = [];

  for (const child of processed.children) {
    // Skip if part of inline group (will be rendered as group)
    if (processed.inlineGroupMembers.has(child.name)) {
      // Only render once per group (at first child)
      const group = [...processed.inlineGroups.values()].find((g) =>
        g.fields.some((f) => f.name === child.name),
      );
      if (group && group.fields[0].name === child.name) {
        const groupColumnSpanClass = getColumnSpanClass(group.totalColumns);
        const groupElement = renderInlineGroup<TEndpoint>(group, fieldName);

        result.push(
          groupColumnSpanClass ? (
            <Div
              key={`inline-group-${child.name}`}
              className={groupColumnSpanClass}
            >
              {groupElement}
            </Div>
          ) : (
            groupElement
          ),
        );
      }
      continue;
    }

    // Regular non-inline child
    const childFieldName = fieldName
      ? `${fieldName}.${child.name}`
      : child.name;
    const columnSpanClass = getColumnSpanClass(child.columns);

    const element = (
      <WidgetRenderer<TEndpoint>
        key={child.name}
        fieldName={childFieldName as Path<TEndpoint["types"]["RequestOutput"]>}
        field={withValue(child.field, child.data, value ?? undefined)}
      />
    );

    result.push(
      columnSpanClass ? (
        <Div key={child.name} className={columnSpanClass}>
          {element}
        </Div>
      ) : (
        element
      ),
    );
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
}: ArrayChildRendererProps<TKey, TUsage, TChild>): JSX.Element {
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
    <Div className="space-y-4">
      {value.map((itemData, index) => {
        const itemFieldName = fieldName
          ? `${fieldName}.${index}`
          : String(index);

        return (
          <WidgetRenderer<TEndpoint>
            key={index}
            fieldName={
              itemFieldName as Path<TEndpoint["types"]["RequestOutput"]>
            }
            field={withValue(childSchema, itemData, null)}
          />
        );
      })}
    </Div>
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
}: UnionObjectRendererProps<TKey, TUsage, TVariants>): JSX.Element {
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

export interface MultiWidgetRendererProps<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TChildren extends
    | ObjectChildrenConstraint<TKey, TUsage>
    | ArrayChildConstraint<TKey, TUsage>
    | UnionObjectWidgetConfigConstrain<TKey, TUsage>
    | undefined,
> {
  childrenSchema: TChildren;
  value:
    | {
        [K in keyof TChildren]: InferResponseOutput<TChildren[K]>;
      }
    | Array<InferResponseOutput<ArrayChildConstraint<TKey, TUsage>>>
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
  }) => JSX.Element;
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
>({
  childrenSchema,
  value,
  fieldName,
  discriminator,
  watchedDiscriminatorValue,
  renderItem,
}: MultiWidgetRendererProps<TKey, TUsage>): JSX.Element {
  if (!childrenSchema) {
    return <></>;
  }

  // Check for union variants first
  const isUnion = isUnionVariants<TKey, TUsage>(childrenSchema);

  if (isUnion) {
    return (
      <UnionObjectRenderer
        variantSchemas={childrenSchema}
        value={value as Record<string, WidgetData> | null | undefined}
        fieldName={fieldName}
        discriminator={discriminator}
        watchedDiscriminatorValue={watchedDiscriminatorValue}
      />
    );
  }

  // Check for array child constraint
  if (isArrayChild<TKey, TUsage>(childrenSchema)) {
    return (
      <ArrayChildRenderer
        childSchema={childrenSchema}
        value={value as Array<WidgetData> | null | undefined}
        fieldName={fieldName}
        renderItem={renderItem}
      />
    );
  }

  // ObjectChildrenConstraint is a Record<string, ...>
  const objectChildren: ObjectChildrenConstraint<TKey, TUsage> = childrenSchema;
  return (
    <ObjectChildrenRenderer
      childrenSchema={objectChildren}
      value={value as Record<string, WidgetData> | null | undefined}
      fieldName={fieldName}
    />
  );
}

MultiWidgetRenderer.displayName = "MultiWidgetRenderer";
