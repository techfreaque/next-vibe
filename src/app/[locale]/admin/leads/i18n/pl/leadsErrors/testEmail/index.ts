import type { translations as enTranslations } from "../../../en/leadsErrors/testEmail";
import { translations as errorTranslations } from "./error-messages";
import { translations as fieldsTranslations } from "./fields";
import { translations as successTranslations } from "./success";
import { translations as validationTranslations } from "./validation";

export const translations: typeof enTranslations = {
  error: errorTranslations,
  fields: fieldsTranslations,
  success: successTranslations,
  validation: validationTranslations,
};
