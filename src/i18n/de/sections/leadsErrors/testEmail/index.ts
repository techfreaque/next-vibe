import type { testEmailTranslations as EnglishTestEmailTranslations } from "../../../../en/sections/leadsErrors/testEmail";
import { errorTranslations } from "./error";
import { fieldsTranslations } from "./fields";
import { successTranslations } from "./success";
import { validationTranslations } from "./validation";

export const testEmailTranslations: typeof EnglishTestEmailTranslations = {
  error: errorTranslations,
  fields: fieldsTranslations,
  success: successTranslations,
  validation: validationTranslations,
};
