import type { JSX, ReactNode } from "react";

// Cross-platform props interface - narrowed to what both platforms support
// Excludes style to allow platform-specific styling
export interface PreProps {
  children?: ReactNode;
  className?: string;
  id?: string;
}

export function Pre(props: PreProps): JSX.Element {
  return <pre {...props} />;
}
