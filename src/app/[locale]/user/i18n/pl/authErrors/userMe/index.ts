import type { translations as enTranslations } from "../../../en/authErrors/userMe";
import { translations as deleteTranslations } from "./delete";
import { translations as formTranslations } from "./form";
import { translations as getTranslations } from "./get";

export const translations: typeof enTranslations = {
  delete: deleteTranslations,
  form: formTranslations,
  get: getTranslations,
};
