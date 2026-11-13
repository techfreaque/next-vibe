/**
 * Tool input schema → JSON Schema for AI providers.
 *
 * One conversion for every place that hands a tool's input schema to a model
 * (local AI SDK tools and relay tool specs), so every provider sees the same,
 * provider-safe shape.
 *
 * Provider safety: zod emits recursive schemas (e.g. `WidgetDataSchema`, the
 * JSON-value type behind execute-tool's `input`) as `definitions` + `$ref`
 * loops. Google Gemini rejects ref loops through required positions such as
 * `additionalProperties` ("ref loops are only supported if they include
 * optional or nullable property values"), which fails EVERY request that
 * carries such a tool. `inlineRecursiveRefs` inlines all definitions and cuts
 * each loop at the point where it would re-enter itself with a permissive
 * `{}` (any value). For a JSON-value type that is semantically identical; the
 * zod schema still validates the real tool call. Schemas without definitions
 * pass through untouched.
 */

import { type JSONSchema7 } from "ai";
import { z } from "zod";

type JSONSchema7Definition = NonNullable<JSONSchema7["additionalProperties"]>;
type DefinitionMap = NonNullable<JSONSchema7["definitions"]>;

const ROOT_REF = "#";
const DEFINITION_REF_PREFIXES = ["#/definitions/", "#/$defs/"] as const;

/**
 * Convert a tool input zod schema to a provider-safe draft-7 JSON Schema.
 */
export function toolInputToJsonSchema(schema: z.ZodType): JSONSchema7 {
  const converted = z.toJSONSchema(schema, {
    // draft-7 matches the AI SDK's JSONSchema7 type
    target: "draft-7",
    // the input side of transforms: what the AI should pass, not the output
    io: "input",
    // never throw on types JSON Schema can't express
    unrepresentable: "any",
    override: (ctx) => {
      // z.custom<T>() types: describe as a generic JSON object
      if (ctx.zodSchema._zod.def.type === "custom") {
        ctx.jsonSchema.type = "object";
      }
    },
  });
  // zod's JSONSchema type carries an `unknown` index signature; the emitted
  // draft-7 document is a JSONSchema7 by construction.
  return inlineRecursiveRefs(converted as JSONSchema7);
}

/**
 * Inline local `$ref`s and break recursion loops with `{}`.
 * Returns the input unchanged when it has no definitions and no root refs.
 */
export function inlineRecursiveRefs(schema: JSONSchema7): JSONSchema7 {
  const definitions: DefinitionMap = {
    ...schema.$defs,
    ...schema.definitions,
  };
  if (Object.keys(definitions).length === 0 && !hasRootRef(schema)) {
    return schema;
  }
  // Every definition gets inlined below, so the root no longer carries them.
  const root: JSONSchema7 = {
    ...schema,
    definitions: undefined,
    $defs: undefined,
  };
  const resolve = (name: string): JSONSchema7Definition | undefined =>
    name === ROOT_REF ? root : definitions[name];
  return inlineNode(root, resolve, new Set([ROOT_REF]));
}

function refName(ref: string): string | undefined {
  if (ref === ROOT_REF) {
    return ROOT_REF;
  }
  for (const prefix of DEFINITION_REF_PREFIXES) {
    if (ref.startsWith(prefix)) {
      return ref.slice(prefix.length);
    }
  }
  return undefined;
}

function hasRootRef(node: JSONSchema7Definition): boolean {
  if (typeof node === "boolean") {
    return false;
  }
  return node.$ref === ROOT_REF || childDefinitions(node).some(hasRootRef);
}

function childDefinitions(node: JSONSchema7): JSONSchema7Definition[] {
  const children: JSONSchema7Definition[] = [];
  const push = (value: JSONSchema7Definition | undefined): void => {
    if (value !== undefined) {
      children.push(value);
    }
  };
  for (const value of Object.values(node.properties ?? {})) {
    push(value);
  }
  for (const value of Object.values(node.patternProperties ?? {})) {
    push(value);
  }
  if (Array.isArray(node.items)) {
    node.items.forEach(push);
  } else {
    push(node.items);
  }
  push(node.additionalItems);
  push(node.additionalProperties);
  push(node.contains);
  push(node.propertyNames);
  push(node.if);
  push(node.then);
  push(node.else);
  push(node.not);
  node.allOf?.forEach(push);
  node.anyOf?.forEach(push);
  node.oneOf?.forEach(push);
  return children;
}

function inlineNode(
  node: JSONSchema7,
  resolve: (name: string) => JSONSchema7Definition | undefined,
  expanding: ReadonlySet<string>,
): JSONSchema7 {
  const { $ref, ...rest } = node;
  const siblings = inlineChildren(rest, resolve, expanding);
  if ($ref === undefined) {
    return siblings;
  }
  const name = refName($ref);
  const target = name === undefined ? undefined : resolve(name);
  if (name === undefined || target === undefined) {
    // Not a local ref we know: leave it exactly as emitted.
    return { $ref, ...siblings };
  }
  if (expanding.has(name)) {
    // Loop: this ref re-enters a schema we are already inside. Cut it here
    // with "any value" (siblings like description/default are kept).
    return siblings;
  }
  if (typeof target === "boolean") {
    return target ? siblings : { not: {}, ...siblings };
  }
  const inlined = inlineNode(target, resolve, new Set([...expanding, name]));
  return { ...inlined, ...siblings };
}

function inlineDefinition(
  node: JSONSchema7Definition,
  resolve: (name: string) => JSONSchema7Definition | undefined,
  expanding: ReadonlySet<string>,
): JSONSchema7Definition {
  return typeof node === "boolean"
    ? node
    : inlineNode(node, resolve, expanding);
}

function inlineRecord(
  record: Record<string, JSONSchema7Definition> | undefined,
  resolve: (name: string) => JSONSchema7Definition | undefined,
  expanding: ReadonlySet<string>,
): Record<string, JSONSchema7Definition> | undefined {
  if (record === undefined) {
    return undefined;
  }
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [
      key,
      inlineDefinition(value, resolve, expanding),
    ]),
  );
}

function inlineChildren(
  node: JSONSchema7,
  resolve: (name: string) => JSONSchema7Definition | undefined,
  expanding: ReadonlySet<string>,
): JSONSchema7 {
  const one = (
    value: JSONSchema7Definition | undefined,
  ): JSONSchema7Definition | undefined =>
    value === undefined
      ? undefined
      : inlineDefinition(value, resolve, expanding);
  const many = (
    values: JSONSchema7Definition[] | undefined,
  ): JSONSchema7Definition[] | undefined =>
    values?.map((value) => inlineDefinition(value, resolve, expanding));

  const result: JSONSchema7 = { ...node };
  const assign = <K extends keyof JSONSchema7>(
    key: K,
    value: JSONSchema7[K],
  ): void => {
    if (value !== undefined) {
      result[key] = value;
    }
  };
  assign("properties", inlineRecord(node.properties, resolve, expanding));
  assign(
    "patternProperties",
    inlineRecord(node.patternProperties, resolve, expanding),
  );
  assign(
    "items",
    Array.isArray(node.items) ? many(node.items) : one(node.items),
  );
  assign("additionalItems", one(node.additionalItems));
  assign("additionalProperties", one(node.additionalProperties));
  assign("contains", one(node.contains));
  assign("propertyNames", one(node.propertyNames));
  assign("if", one(node.if));
  assign("then", one(node.then));
  assign("else", one(node.else));
  assign("not", one(node.not));
  assign("allOf", many(node.allOf));
  assign("anyOf", many(node.anyOf));
  assign("oneOf", many(node.oneOf));
  return result;
}
