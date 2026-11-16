import type { JSX } from "react";
import { createElement } from "react";

/** Any JSON value a schema.org JSON-LD document can hold. */
export type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | readonly JsonLdValue[]
  | { readonly [key: string]: JsonLdValue };

/** One JSON-LD node (`@type` + properties) or a whole `@graph` document. */
export interface JsonLdNode {
  readonly [key: string]: JsonLdValue;
}

export interface JsonLdProps {
  id?: string;
  data: JsonLdNode;
}

/**
 * Serializes JSON-LD for an inline script. `<` is escaped so a string field
 * holding "</script>" can never close the tag early.
 */
export function serializeJsonLd(data: JsonLdNode): string {
  return JSON.stringify(data).replaceAll("<", "\\u003c");
}

/**
 * Structured data for search engines and AI crawlers (Web + TanStack).
 * A plain server-rendered script tag: next/script would inject it after
 * hydration, so crawlers reading the raw HTML would never see it.
 */
export function JsonLd({ id, data }: JsonLdProps): JSX.Element {
  return createElement("script", {
    id,
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: serializeJsonLd(data) },
  });
}
