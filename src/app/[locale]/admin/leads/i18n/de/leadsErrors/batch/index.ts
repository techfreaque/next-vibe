import type { translations as enTranslations } from "../../../en/leadsErrors/batch";
import { translations as updateTranslations } from "./update";

export const translations: typeof enTranslations = {
  update: updateTranslations,
};
