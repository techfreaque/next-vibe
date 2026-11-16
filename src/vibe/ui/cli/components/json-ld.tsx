// CLI: no structured data in terminal

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
