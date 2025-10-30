/**
 * Zod Internal Type Guards
 * Type guard functions for checking Zod schema types
 * These functions provide type-safe checks for Zod's internal schema types
 */

import { z } from "zod";

/**
 * Type guard for ZodObject
 */
export function isZodObject(schema: z.ZodTypeAny): schema is z.ZodObject<
  // eslint-disable-next-line no-restricted-syntax -- Infrastructure: Generic object shape requires any
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Infrastructure: Generic object shape requires any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
> {
  return schema instanceof z.ZodObject;
}

/**
 * Type guard for ZodArray
 */
export function isZodArray(
  schema: z.ZodTypeAny,
): schema is z.ZodArray<z.ZodTypeAny> {
  return schema instanceof z.ZodArray;
}

/**
 * Type guard for ZodOptional
 */
export function isZodOptional(
  schema: z.ZodTypeAny,
): schema is z.ZodOptional<z.ZodTypeAny> {
  return schema instanceof z.ZodOptional;
}

/**
 * Type guard for ZodNullable
 */
export function isZodNullable(
  schema: z.ZodTypeAny,
): schema is z.ZodNullable<z.ZodTypeAny> {
  return schema instanceof z.ZodNullable;
}

/**
 * Type guard for ZodDefault
 */
export function isZodDefault(
  schema: z.ZodTypeAny,
): schema is z.ZodDefault<z.ZodTypeAny> {
  return schema instanceof z.ZodDefault;
}

/**
 * Type guard for ZodEffects (transforms, refinements, preprocessors)
 * Note: Uses duck typing because ZodEffects may not be available in all Zod versions
 */
export function isZodEffects(
  schema: z.ZodTypeAny,
): schema is z.ZodTypeAny & { _def: { schema: z.ZodTypeAny } } {
  return (
    "_def" in schema &&
    typeof schema._def === "object" &&
    schema._def !== null &&
    "schema" in schema._def
  );
}

/**
 * Type guard for ZodUnion
 */
export function isZodUnion(
  schema: z.ZodTypeAny,
): schema is z.ZodUnion<[z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]]> {
  return schema instanceof z.ZodUnion;
}

/**
 * Type guard for ZodIntersection
 */
export function isZodIntersection(
  schema: z.ZodTypeAny,
): schema is z.ZodIntersection<z.ZodTypeAny, z.ZodTypeAny> {
  return schema instanceof z.ZodIntersection;
}

/**
 * Type guard for ZodString
 */
export function isZodString(schema: z.ZodTypeAny): schema is z.ZodString {
  return schema instanceof z.ZodString;
}

/**
 * Type guard for ZodNumber
 */
export function isZodNumber(schema: z.ZodTypeAny): schema is z.ZodNumber {
  return schema instanceof z.ZodNumber;
}

/**
 * Type guard for ZodBoolean
 */
export function isZodBoolean(schema: z.ZodTypeAny): schema is z.ZodBoolean {
  return schema instanceof z.ZodBoolean;
}

/**
 * Type guard for ZodDate
 */
export function isZodDate(schema: z.ZodTypeAny): schema is z.ZodDate {
  return schema instanceof z.ZodDate;
}

/**
 * Type guard for ZodEnum
 */
// eslint-disable-next-line no-restricted-syntax -- Infrastructure: ZodEnum requires any for generic enum values
// eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Infrastructure: ZodEnum requires any for generic enum values
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isZodEnum(schema: z.ZodTypeAny): schema is z.ZodEnum<any> {
  return schema instanceof z.ZodEnum;
}

/**
 * Type guard for ZodLiteral
 */
export function isZodLiteral(
  schema: z.ZodTypeAny,
): schema is z.ZodLiteral<string | number | boolean> {
  return schema instanceof z.ZodLiteral;
}

/**
 * Type guard for ZodNever
 */
export function isZodNever(schema: z.ZodTypeAny): schema is z.ZodNever {
  return schema instanceof z.ZodNever;
}

/**
 * Type guard for ZodUndefined
 */
export function isZodUndefined(schema: z.ZodTypeAny): schema is z.ZodUndefined {
  return schema instanceof z.ZodUndefined;
}

/**
 * Type guard for ZodNull
 */
export function isZodNull(schema: z.ZodTypeAny): schema is z.ZodNull {
  return schema instanceof z.ZodNull;
}

/**
 * Type guard for ZodVoid
 */
export function isZodVoid(schema: z.ZodTypeAny): schema is z.ZodVoid {
  return schema instanceof z.ZodVoid;
}

/**
 * Type guard for ZodAny
 */
export function isZodAny(schema: z.ZodTypeAny): schema is z.ZodAny {
  return schema instanceof z.ZodAny;
}

/**
 * Type guard for ZodUnknown
 */
export function isZodUnknown(schema: z.ZodTypeAny): schema is z.ZodUnknown {
  return schema instanceof z.ZodUnknown;
}

/**
 * Type guard for ZodRecord
 */
export function isZodRecord(
  schema: z.ZodTypeAny,
): schema is z.ZodRecord<z.ZodString, z.ZodTypeAny> {
  return schema instanceof z.ZodRecord;
}

/**
 * Type guard for ZodMap
 */
export function isZodMap(
  schema: z.ZodTypeAny,
): schema is z.ZodMap<z.ZodTypeAny, z.ZodTypeAny> {
  return schema instanceof z.ZodMap;
}

/**
 * Type guard for ZodSet
 */
export function isZodSet(
  schema: z.ZodTypeAny,
): schema is z.ZodSet<z.ZodTypeAny> {
  return schema instanceof z.ZodSet;
}

/**
 * Type guard for ZodTuple
 */
export function isZodTuple(
  schema: z.ZodTypeAny,
): schema is z.ZodTuple<[z.ZodTypeAny, ...z.ZodTypeAny[]]> {
  return schema instanceof z.ZodTuple;
}

/**
 * Type guard for ZodPromise
 */
export function isZodPromise(
  schema: z.ZodTypeAny,
): schema is z.ZodPromise<z.ZodTypeAny> {
  return schema instanceof z.ZodPromise;
}

/**
 * Type guard for ZodFunction
 */
export function isZodFunction(
  schema: z.ZodTypeAny,
): schema is z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodTypeAny> {
  return schema instanceof z.ZodFunction;
}

/**
 * Type guard for ZodLazy
 */
export function isZodLazy(
  schema: z.ZodTypeAny,
): schema is z.ZodLazy<z.ZodTypeAny> {
  return schema instanceof z.ZodLazy;
}

/**
 * Type guard for ZodBranded
 * Note: Uses duck typing because ZodBranded may not be available in all Zod versions
 */
export function isZodBranded(
  schema: z.ZodTypeAny,
  // eslint-disable-next-line no-restricted-syntax -- Infrastructure: Brand checking requires string type
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Infrastructure: Brand checking requires string type
): schema is z.ZodTypeAny & { unwrap: () => z.ZodTypeAny } {
  return "unwrap" in schema && typeof (schema as { unwrap?: unknown }).unwrap === "function";
}

/**
 * Type guard for ZodPipeline
 * Note: Uses duck typing because ZodPipeline may not be available in all Zod versions
 */
export function isZodPipeline(
  schema: z.ZodTypeAny,
): schema is z.ZodTypeAny & { _def: { in: z.ZodTypeAny; out: z.ZodTypeAny } } {
  return (
    "_def" in schema &&
    typeof schema._def === "object" &&
    schema._def !== null &&
    "in" in schema._def &&
    "out" in schema._def
  );
}
