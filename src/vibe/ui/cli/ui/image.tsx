// CLI: images cannot be rendered in a terminal - return null

import type { ImageProps } from "../../web/ui/image";

export type { ImageProps } from "../../web/ui/image";

export function Image(_props: ImageProps): null {
  void _props;
  return null;
}
