import type { ReactNode } from "react";

interface OutletProps {
  children?: ReactNode;
}

// CLI: passthrough - just render children like the web version
export function Outlet({ children }: OutletProps): ReactNode {
  return children ?? null;
}
