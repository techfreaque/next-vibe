import type { ReactNode } from "react";

interface OutletProps {
  children?: ReactNode;
}

/**
 * Web (Next.js) implementation of Outlet.
 * In Next.js, child routes are passed as `children` — this just renders them.
 */
export function Outlet({ children }: OutletProps): ReactNode {
  return children ?? null;
}
