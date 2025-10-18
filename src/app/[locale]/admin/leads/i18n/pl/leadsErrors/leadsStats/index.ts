import type { translations as enTranslations } from "../../../en/leadsErrors/leadsStats";
import { translations as getTranslations } from "./get";

export const translations: typeof enTranslations = {
  get: getTranslations,
};
