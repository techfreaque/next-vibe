import { z } from "zod";

import type { NavigationStackEntry } from "../core/definition/endpoint";
import type { CreateApiEndpointAny } from "../core/definition/endpoint-base";

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

function companyInput(
  endpoint: CreateApiEndpointAny,
): keyof ToolInputs | undefined {
  if (!erpCategories.has(endpoint.category)) {
    return undefined;
  }
  if (endpoint.path.includes("[companyId]")) {
    return "urlPathParams";
  }
  return endpoint.requestSchema instanceof z.ZodObject &&
    Object.hasOwn(endpoint.requestSchema.shape, "companyId")
    ? "data"
    : undefined;
}

export function readWorkspaceCompanyOverride(
  endpoint: CreateApiEndpointAny,
  inputs: ToolInputs,
): string | undefined {
  const key = companyInput(endpoint);
  const companyId = key ? inputs[key]?.companyId : undefined;
  return typeof companyId === "string" ? companyId : undefined;
}

export function applyWorkspaceCompany(
  endpoint: CreateApiEndpointAny,
  inputs: ToolInputs,
  companyId?: string,
): ToolInputs {
  if (!companyId) {
    return inputs;
  }
  const key = companyInput(endpoint);
  if (!key || inputs[key]?.companyId !== undefined) {
    return inputs;
  }
  return { ...inputs, [key]: { ...inputs[key], companyId } };
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
