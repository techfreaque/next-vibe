"use client";

import { createContext, useContext, useEffect } from "react";
import { z } from "zod";

import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import type { WidgetData } from "../../core/utils/json";

export const AdminRecordCompanyContext = createContext<{
  key: string;
  publish: (key: string, companyId: string | undefined) => void;
} | null>(null);

const pathValues = z.record(z.string(), z.string());
const companyField = z.object({ companyId: z.uuid() });
const companyResponse = z.union([
  companyField,
  z.object({ entry: companyField }).transform(({ entry }) => entry),
  z.object({ result: companyField }).transform(({ result }) => result),
]);

/** Match a report result to the exact GET and every declared record path segment. */
export function adminRecordCompanyKey(
  endpoint: CreateApiEndpointAny | null | undefined,
  params: WidgetData,
): string | undefined {
  if (endpoint?.method !== "GET") {
    return undefined;
  }
  const segments = endpoint.path.filter((segment) => segment.startsWith("["));
  const values = pathValues.safeParse(params);
  if (!segments.length || !values.success) {
    return undefined;
  }
  const ids = segments.map((segment) => values.data[segment.slice(1, -1)]);
  if (ids.some((id) => !id)) {
    return undefined;
  }
  return JSON.stringify([endpoint.path, ids]);
}

export function useObserveAdminRecordCompany(
  endpoint: CreateApiEndpointAny | null | undefined,
  params: WidgetData,
  response: WidgetData,
): void {
  const scope = useContext(AdminRecordCompanyContext);
  const key = scope ? adminRecordCompanyKey(endpoint, params) : undefined;
  const matchingScope = key === scope?.key ? scope : null;
  const result = matchingScope
    ? companyResponse.safeParse(response)
    : undefined;
  const companyId = result?.success ? result.data.companyId : undefined;
  const publish = matchingScope?.publish;

  useEffect(() => {
    if (key && publish) {
      publish(key, companyId);
      return (): void => publish(key, undefined);
    }
    return undefined;
  }, [companyId, key, publish]);
}
