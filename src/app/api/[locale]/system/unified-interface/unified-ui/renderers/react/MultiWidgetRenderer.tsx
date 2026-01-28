"use client";

import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import type { Path } from "react-hook-form";
import type z from "zod";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { WidgetType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import {
  isRequestField,
  isResponseField,
} from "../../widgets/_shared/type-guards";
import { isPrimitiveField } from "../../widgets/_shared/type-guards";
import type {
  AnyChildrenConstrain,
  ArrayChildConstraint,
  BaseWidgetContext,
  BaseWidgetFieldProps,
  FieldUsageConfig,
  ObjectChildrenConstraint,
  UnionObjectWidgetConfigConstrain,
} from "../../widgets/_shared/types";
import { WidgetRenderer } from "./WidgetRenderer";

/**
 * Props for rendering a Record of named fields
 */
interface ObjectChildrenRendererProps<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TChildren extends ObjectChildrenConstraint<TKey, TUsage>,
  TEndpoint extends CreateApiEndpointAny,
> {
  childrenSchema: TChildren;
  value: Record<string, z.ZodTypeAny> | null | undefined;
  fieldName: string | undefined;
  context: BaseWidgetContext<TEndpoint>;
}

/**
 * Props for rendering array items
 */
interface ArrayChildRendererProps<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TChild extends AnyChildrenConstrain<TKey, TUsage>,
  TEndpoint extends CreateApiEndpointAny,
> {
  childSchema: TChild;
  value: Array<z.ZodTypeAny> | null | undefined;
  fieldName: string | undefined;
  context: BaseWidgetContext<TEndpoint>;
}

/**
 * Props for rendering union variants
 */
interface UnionObjectRendererProps<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TVariants extends UnionObjectWidgetConfigConstrain<TKey, TUsage>,
  TEndpoint extends CreateApiEndpointAny,
> {
  variantSchemas: TVariants;
  value: Record<string, z.ZodTypeAny> | null | undefined;
  fieldName: string | undefined;
  discriminator: string | undefined;
  watchedDiscriminatorValue: string | undefined;
  context: BaseWidgetContext<TEndpoint>;
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
  context,
}: ObjectChildrenRendererProps<
  TKey,
  TUsage,
  TChildren,
  TEndpoint
>): JSX.Element {
  if (!childrenSchema) {
    return <></>;
  }

  const childrenToRender = Object.entries(childrenSchema);

  const getChildData = (childName: string): z.ZodTypeAny | null => {
    if (!value) {
      return null;
    }
    return value[childName as keyof typeof value] ?? null;
  };

  const renderChildren = (): (JSX.Element | null)[] => {
    const result: (JSX.Element | null)[] = [];
    let inlineGroup: Array<{
      name: string;
      field: (typeof childrenToRender)[number][1];
      data: ReturnType<typeof getChildData>;
    }> = [];

    const flushInlineGroup = (): void => {
      if (inlineGroup.length === 0) {
        return;
      }

      if (inlineGroup.length === 1) {
        // Single inline field - render normally
        const { name, field, data } = inlineGroup[0];
        const childFieldName = fieldName ? `${fieldName}.${name}` : name;

        result.push(
          <WidgetRenderer
            key={name}
            fieldName={
              childFieldName as Path<TEndpoint["types"]["RequestOutput"]>
            }
            field={
              { ...field, value: data } as BaseWidgetFieldProps<typeof field>
            }
            context={context}
          />,
        );
      } else {
        // Multiple inline fields - wrap in flex container
        result.push(
          <Div
            key={`inline-group-${inlineGroup[0].name}`}
            className="flex items-center gap-2"
          >
            {inlineGroup.map(({ name, field, data }) => {
              const childFieldName = fieldName ? `${fieldName}.${name}` : name;

              return (
                <WidgetRenderer
                  key={name}
                  fieldName={
                    childFieldName as Path<TEndpoint["types"]["RequestOutput"]>
                  }
                  field={
                    { ...field, value: data } as BaseWidgetFieldProps<
                      typeof field
                    >
                  }
                  context={context}
                />
              );
            })}
          </Div>,
        );
      }

      inlineGroup = [];
    };

    for (const [childName, childField] of childrenToRender) {
      // Type-safe checks on all union members via BaseWidgetConfig properties
      const { hidden = false, inline = false, schemaType } = childField;

      // Skip hidden fields
      if (hidden) {
        context.logger.debug(
          `ObjectChildrenRenderer: Skipping hidden field "${childName}"`,
        );
        continue;
      }

      const childData = getChildData(childName);

      // Check if this is a widget field or widget-only object container
      const isWidgetField = schemaType === "widget";
      const isWidgetOnlyObject =
        schemaType === "widget-object" &&
        "children" in childField &&
        childField.children !== undefined &&
        typeof childField.children === "object" &&
        Object.values(childField.children).every(
          (child) =>
            child &&
            typeof child === "object" &&
            "schemaType" in child &&
            child.schemaType === "widget",
        );

      // Skip response-only fields that don't have data
      const hasRequest = isRequestField(childField);
      if (
        !isWidgetField &&
        !isWidgetOnlyObject &&
        isResponseField(childField) &&
        !hasRequest &&
        (childData === null || childData === undefined)
      ) {
        context.logger.debug(
          `ObjectChildrenRenderer: Skipping response-only field without data "${childName}"`,
        );
        continue;
      }

      context.logger.debug(
        `ObjectChildrenRenderer: Rendering child "${childName}"`,
      );

      // Check if this field should be inline
      if (inline) {
        // Add to inline group
        inlineGroup.push({
          name: childName,
          field: childField,
          data: childData,
        });
      } else {
        // Flush any pending inline group
        flushInlineGroup();

        // Render this field normally
        const childFieldName = fieldName
          ? `${fieldName}.${childName}`
          : childName;

        // For NAVIGATE_BUTTON widgets, pass parent value
        const dataToPass =
          childField.type === WidgetType.NAVIGATE_BUTTON ? value : childData;

        result.push(
          <WidgetRenderer
            key={childName}
            fieldName={
              childFieldName as Path<TEndpoint["types"]["RequestOutput"]>
            }
            field={
              { ...childField, value: dataToPass } as BaseWidgetFieldProps<
                typeof childField
              >
            }
            context={context}
          />,
        );
      }
    }

    // Flush any remaining inline group
    flushInlineGroup();

    return result;
  };

  return <Div className="flex flex-col gap-4">{renderChildren()}</Div>;
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
  context,
}: ArrayChildRendererProps<TKey, TUsage, TChild, TEndpoint>): JSX.Element {
  if (!childSchema || !value || !Array.isArray(value)) {
    return <></>;
  }

  return (
    <Div className="space-y-4">
      {value.map((itemData, index) => {
        const itemFieldName = fieldName
          ? `${fieldName}.${index}`
          : String(index);

        return (
          <WidgetRenderer
            key={index}
            fieldName={
              itemFieldName as Path<TEndpoint["types"]["RequestOutput"]>
            }
            field={
              { ...childSchema, value: itemData } as BaseWidgetFieldProps<
                typeof childSchema
              >
            }
            context={context}
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
  TEndpoint extends CreateApiEndpointAny,
>({
  variantSchemas: variants,
  value,
  fieldName,
  discriminator,
  context,
  watchedDiscriminatorValue,
}: UnionObjectRendererProps<TKey, TUsage, TVariants, TEndpoint>): JSX.Element {
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
    if (isPrimitiveField(variantDiscriminator)) {
      // Type guard narrowed to primitive, check if it has schema property
      const schemaOrUndefined = (
        variantDiscriminator as { schema?: z.ZodTypeAny }
      ).schema;
      if (schemaOrUndefined !== undefined) {
        const schema = schemaOrUndefined;
        // Zod stores literal values in schema._def.values array
        if ("_def" in schema && "values" in schema._def) {
          const values = (schema._def as Record<string, z.ZodTypeAny>).values;
          if (Array.isArray(values) && values.length > 0) {
            const literalValue = values[0];
            return literalValue === discriminatorValue;
          }
        }
      }
      return false;
    }

    return false;
  });

  // Build children from selected variant or first variant (for discriminator)
  const childrenToRender: ObjectChildrenConstraint<TKey, TUsage> = {};

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
      context={context}
    />
  );
}

UnionObjectRenderer.displayName = "UnionObjectRenderer";

interface MultiWidgetRendererProps<
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TEndpoint extends CreateApiEndpointAny,
> {
  children:
    | ObjectChildrenConstraint<TKey, TUsage>
    | ArrayChildConstraint<TKey, TUsage>
    | UnionObjectWidgetConfigConstrain<TKey, TUsage>
    | undefined;
  value: Record<string, z.ZodTypeAny> | Array<z.ZodTypeAny> | null | undefined;
  fieldName: string | undefined;
  context: BaseWidgetContext<TEndpoint>;
  discriminator?: string;
  watchedDiscriminatorValue?: string;
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
  TEndpoint extends CreateApiEndpointAny,
>({
  children,
  value,
  fieldName,
  context,
  discriminator,
  watchedDiscriminatorValue,
}: MultiWidgetRendererProps<TKey, TUsage, TEndpoint>): JSX.Element {
  if (!children) {
    return <></>;
  }

  // Check for union variants first
  if (isUnionVariants<TKey, TUsage>(children)) {
    return (
      <UnionObjectRenderer
        variantSchemas={children}
        value={value as Record<string, z.ZodTypeAny> | null | undefined}
        fieldName={fieldName}
        discriminator={discriminator}
        context={context}
        watchedDiscriminatorValue={watchedDiscriminatorValue}
      />
    );
  }

  // Check for array child constraint
  if (isArrayChild<TKey, TUsage>(children)) {
    return (
      <ArrayChildRenderer
        childSchema={children}
        value={value as Array<z.ZodTypeAny> | null | undefined}
        fieldName={fieldName}
        context={context}
      />
    );
  }

  // ObjectChildrenConstraint is a Record<string, ...>
  // After checking for union variants and array child, remaining type must be ObjectChildrenConstraint
  const objectChildren: ObjectChildrenConstraint<TKey, TUsage> = children;
  return (
    <ObjectChildrenRenderer
      childrenSchema={objectChildren}
      value={value as Record<string, z.ZodTypeAny> | null | undefined}
      fieldName={fieldName}
      context={context}
    />
  );
}

MultiWidgetRenderer.displayName = "MultiWidgetRenderer";
