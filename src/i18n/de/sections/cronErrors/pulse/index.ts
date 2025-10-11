import type { pulseTranslations as EnglishPulseTranslations } from "../../../../en/sections/cronErrors/pulse";
import { statusTranslations } from "./status";
import { triggerTranslations } from "./trigger";

export const pulseTranslations: typeof EnglishPulseTranslations = {
  status: statusTranslations,
  trigger: triggerTranslations,
};
