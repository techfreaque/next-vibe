import type { ContentLevelValue } from "next-vibe/agent/skills/enum";

export interface StudioModel {
  id: string;
  name: string;
  content: typeof ContentLevelValue;
  rate: number;
  isTokenPriced: boolean;
  requiresImage: boolean;
  providerRate: number;
}
