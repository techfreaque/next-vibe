import type { translations as enTranslations } from "../en";
import { translations as trackingTranslations } from "./tracking";

export const translations: typeof enTranslations = {
  tracking: trackingTranslations,
};
