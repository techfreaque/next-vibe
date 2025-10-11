import type { formTranslations as EnglishFormTranslations } from "../../../../../en/sections/businessInfo/social/form";
import { debugTranslations } from "./debug";
import { errorTranslations } from "./error";
import { fieldsTranslations } from "./fields";
import { getTranslations } from "./get";
import { messagesTranslations } from "./messages";
import { platformNamesTranslations } from "./platformNames";
import { platformSelectorTranslations } from "./platformSelector";
import { sectionsTranslations } from "./sections";
import { submitTranslations } from "./submit";
import { successTranslations } from "./success";
import { validationTranslations } from "./validation";

export const formTranslations: typeof EnglishFormTranslations = {
  debug: debugTranslations,
  error: errorTranslations,
  fields: fieldsTranslations,
  get: getTranslations,
  messages: messagesTranslations,
  platformNames: platformNamesTranslations,
  platformSelector: platformSelectorTranslations,
  sections: sectionsTranslations,
  submit: submitTranslations,
  success: successTranslations,
  validation: validationTranslations,
  title: "Media Społecznościowe",
  description: "Zarządzaj swoją obecnością w mediach społecznościowych.",
};
