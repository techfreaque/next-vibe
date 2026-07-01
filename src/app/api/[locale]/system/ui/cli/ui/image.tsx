// CLI: images cannot be rendered in a terminal - return null

import type { ImageProps } from "next-vibe/ui/web/ui/image";

export type { ImageProps } from "next-vibe/ui/web/ui/image";

export function Image(): null {
  return null;
}
