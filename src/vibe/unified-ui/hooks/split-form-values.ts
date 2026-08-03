import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";

/**
 * Split flat form values into the two buckets the API call expects.
 *
 * A form holds the union of request-data fields and url-path-param fields (a
 * pure url-path-param field still has a real form widget). On submit we split
 * the flat values back into `{ data, urlPathParams }` using the endpoint's
 * `requestUrlPathParamsSchema`: keys the url schema recognises go to
 * urlPathParams; everything else is request data.
 *
 * `urlPathParams` is `undefined` when the endpoint declares no url-path-param
 * fields (its url schema is `z.never()`), matching MutationVariables, which
 * forbids urlPathParams there.
 *
 * Types are precise at the type level (RequestOutput / UrlVariablesOutput) and
 * collapse to `any` at the type-erased CreateApiEndpointAny boundary — matching
 * the endpoint's own `types`.
 */
export function splitFormValues<TEndpoint extends CreateApiEndpointAny>(
  endpoint: TEndpoint,
  values: TEndpoint["types"]["FormValues"],
): {
  data: TEndpoint["types"]["RequestOutput"];
  urlPathParams: TEndpoint["types"]["UrlVariablesOutput"] | undefined;
} {
  // Non-object form values (shouldn't happen for object schemas) → all request data.
  if (values === null || typeof values !== "object") {
    return { data: values, urlPathParams: undefined };
  }

  const urlParse = endpoint.requestUrlPathParamsSchema.safeParse(values);
  // safeParse fails when the endpoint has no url-path-params (z.never()) — then
  // there is nothing to split out and urlPathParams stays undefined.
  if (!urlParse.success) {
    return { data: values, urlPathParams: undefined };
  }

  const urlPathParams: TEndpoint["types"]["UrlVariablesOutput"] = urlParse.data;
  const urlKeys = new Set(
    urlPathParams && typeof urlPathParams === "object"
      ? Object.keys(urlPathParams)
      : [],
  );

  const data: Record<string, TEndpoint["types"]["FormValues"][string]> = {};
  for (const [key, value] of Object.entries(values)) {
    if (!urlKeys.has(key)) {
      data[key] = value;
    }
  }

  return { data, urlPathParams };
}
