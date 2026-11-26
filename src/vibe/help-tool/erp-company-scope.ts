import { z } from "zod";

import type { NavigationStackEntry } from "../core/definition/endpoint";
import type { CreateApiEndpointAny } from "../core/definition/endpoint-base";
import type { WidgetData } from "../core/utils/json";

export const erpCategories: ReadonlySet<string> = new Set([
  "accounting",
  "companies",
  "finance",
  "inventory",
  "payments",
  "pos",
  "products",
  "purchasing",
  "tax",
]);

type ToolInputs = NavigationStackEntry["params"];
type CompanyInput = { kind: "path" } | { kind: "data"; group?: string };

function companyInput(
  endpoint: CreateApiEndpointAny,
): CompanyInput | undefined {
  if (!erpCategories.has(endpoint.category)) {
    return undefined;
  }
  if (endpoint.path.includes("[companyId]")) {
    return { kind: "path" };
  }
  if (!(endpoint.requestSchema instanceof z.ZodObject)) {
    return undefined;
  }
  if (Object.hasOwn(endpoint.requestSchema.shape, "companyId")) {
    return { kind: "data" };
  }
  for (const [group, field] of Object.entries(endpoint.requestSchema.shape)) {
    let schema: z.core.$ZodType = field;
    while (
      schema instanceof z.ZodOptional ||
      schema instanceof z.ZodNullable ||
      schema instanceof z.ZodDefault ||
      schema instanceof z.ZodPrefault
    ) {
      schema = schema.unwrap();
    }
    if (
      schema instanceof z.ZodObject &&
      Object.hasOwn(schema.shape, "companyId")
    ) {
      return { kind: "data", group };
    }
  }
  return undefined;
}

function requestGroup(
  value: WidgetData,
): Record<string, WidgetData> | undefined {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  ) {
    return value;
  }
  return undefined;
}

export function hasWorkspaceCompanyInput(
  endpoint: CreateApiEndpointAny,
): boolean {
  return companyInput(endpoint) !== undefined;
}

export function readWorkspaceCompanyOverride(
  endpoint: CreateApiEndpointAny,
  inputs: ToolInputs,
): string | undefined {
  const field = companyInput(endpoint);
  const companyId =
    field?.kind === "path"
      ? inputs.urlPathParams?.companyId
      : field?.group
        ? requestGroup(inputs.data?.[field.group])?.companyId
        : field
          ? inputs.data?.companyId
          : undefined;
  return typeof companyId === "string" && companyId !== ""
    ? companyId
    : undefined;
}

export function applyWorkspaceCompany(
  endpoint: CreateApiEndpointAny,
  inputs: ToolInputs,
  companyId?: string,
): ToolInputs {
  const field = companyInput(endpoint);
  if (!field || !companyId || readWorkspaceCompanyOverride(endpoint, inputs)) {
    return inputs;
  }
  if (field.kind === "path") {
    return { ...inputs, urlPathParams: { ...inputs.urlPathParams, companyId } };
  }
  if (field.group) {
    const group = requestGroup(inputs.data?.[field.group]);
    return {
      ...inputs,
      data: { ...inputs.data, [field.group]: { ...group, companyId } },
    };
  }
  return { ...inputs, data: { ...inputs.data, companyId } };
}

export function applyWorkspaceCompanyToEntry(
  entry: NavigationStackEntry,
  companyId?: string,
): NavigationStackEntry {
  const params = applyWorkspaceCompany(entry.endpoint, entry.params, companyId);
  return params === entry.params ? entry : { ...entry, params };
}

/** A record inherits its company from its identity or authorized response. */
export function hasFixedRecordCompany(
  endpoint: CreateApiEndpointAny | null | undefined,
): boolean {
  if (
    !endpoint ||
    !erpCategories.has(endpoint.category) ||
    !endpoint.path.some((segment) => segment.startsWith("["))
  ) {
    return false;
  }
  if (endpoint.method !== "GET") {
    return companyInput(endpoint) === undefined;
  }
  if (!(endpoint.responseSchema instanceof z.ZodObject)) {
    return false;
  }
  const shape = endpoint.responseSchema.shape;
  return (
    Object.hasOwn(shape, "companyId") ||
    [shape.entry, shape.result].some(
      (field) =>
        field instanceof z.ZodObject && Object.hasOwn(field.shape, "companyId"),
    )
  );
}
