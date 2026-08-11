import type { JSX } from "react";

export interface LinkTagProps {
  rel?: string;
  href: string;
  sizes?: string;
  type?: string;
  media?: string;
  crossOrigin?: "anonymous" | "use-credentials" | "";
}

export function LinkTag(props: LinkTagProps): JSX.Element {
  return <link {...props} />;
}
