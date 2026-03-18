import { Outlet as TanstackOutlet } from "@tanstack/react-router";
import type { JSX } from "react";

/**
 * TanStack Start implementation of Outlet.
 * Renders the matched child route inside a layout.
 */
export function Outlet(): JSX.Element {
  return <TanstackOutlet />;
}
