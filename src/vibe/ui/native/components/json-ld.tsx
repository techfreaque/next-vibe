// Native: structured data is a web/SEO concern, nothing to render

import type { JsonLdProps } from "../../web/components/json-ld";

export type {
  JsonLdNode,
  JsonLdProps,
  JsonLdValue,
} from "../../web/components/json-ld";
export { serializeJsonLd } from "../../web/components/json-ld";

export function JsonLd(_props: JsonLdProps): null {
  void _props;
  return null;
}
