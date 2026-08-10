// CLI: images cannot be rendered in a terminal - return null

import type { ImageProps } from "../../web/components/image";

export type { ImageProps } from "../../web/components/image";

export function Image(_props: ImageProps): null {
  void _props;
  return null;
}
