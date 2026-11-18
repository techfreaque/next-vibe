import { Environment } from "next-vibe/env/env-util";

export type SidebarVariant = "A" | "B" | "C";

export function selectSidebarVariant(
  environment: Environment,
  search: string,
): SidebarVariant | null {
  if (environment !== Environment.DEVELOPMENT) {
    return null;
  }
  const value = new URLSearchParams(search).get("sidebar");
  return value === "A" || value === "B" || value === "C" ? value : null;
}
