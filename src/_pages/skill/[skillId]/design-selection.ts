import { Environment } from "next-vibe/env/env-util";

export type SkillPageDesign = "A" | "B" | "C";

export function selectSkillPageDesign(
  environment: Environment,
  value: string | undefined,
): SkillPageDesign | null {
  if (environment !== Environment.DEVELOPMENT) {
    return null;
  }
  return value === "A" || value === "B" || value === "C" ? value : null;
}
