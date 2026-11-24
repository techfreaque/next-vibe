import type { CommercialUseInfo } from "next-vibe/agent/models/commercial-use/enum";
import type { ContentLevelValue } from "next-vibe/agent/skills/enum";

export interface StudioModel {
  id: string;
  name: string;
  content: typeof ContentLevelValue;
  rate: number;
  isTokenPriced: boolean;
  requiresImage: boolean;
  providerRate: number;
  /** Omitted when unknown; restricted/unclear models get a label in the picker. */
  commercialUse?: CommercialUseInfo;
}
