import { z } from "zod";

import { type WidgetData, WidgetDataSchema } from "../../core/utils/json";

type FieldSpec = readonly string[] | Record<string, readonly string[] | true>;

const recordSchema = z.record(z.string(), WidgetDataSchema);

function isFieldList(spec: FieldSpec): spec is readonly string[] {
  return Array.isArray(spec);
}

function unwrapArrayElement(schema: z.ZodType): z.ZodType {
  if (schema instanceof z.ZodArray) {
    return schema.element instanceof z.ZodType ? schema.element : schema;
  }
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    const inner = schema.unwrap();
    return inner instanceof z.ZodType ? unwrapArrayElement(inner) : schema;
  }
  return schema;
}

function pickPartial(
  schema: z.ZodObject,
  fields: readonly string[],
): z.ZodType {
  const mask: Record<string, true> = {};
  for (const field of fields) {
    mask[field] = true;
  }
  return schema.pick(mask).partial();
}

/** Project an endpoint schema onto the partial fields an event can carry. */
export function buildEventFieldSchema(
  baseSchema: z.ZodType,
  fieldSpec: FieldSpec | undefined,
): z.ZodType<Record<string, WidgetData>> {
  if (fieldSpec === undefined || !(baseSchema instanceof z.ZodObject)) {
    return recordSchema.default({});
  }

  if (isFieldList(fieldSpec)) {
    return pickPartial(baseSchema, fieldSpec).pipe(recordSchema);
  }

  const shape: Record<string, z.ZodType> = {};
  const baseShape: z.ZodRawShape = baseSchema.shape;
  for (const [key, fields] of Object.entries(fieldSpec)) {
    const fieldSchema = baseShape[key];
    if (!(fieldSchema instanceof z.ZodType)) {
      continue;
    }
    if (fields === true) {
      shape[key] = fieldSchema.optional();
      continue;
    }
    const element = unwrapArrayElement(fieldSchema);
    shape[key] =
      element instanceof z.ZodObject
        ? z.array(pickPartial(element, fields)).optional()
        : fieldSchema.optional();
  }
  return z.object(shape).pipe(recordSchema);
}
