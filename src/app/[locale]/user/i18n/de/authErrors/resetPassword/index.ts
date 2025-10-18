import type { translations as enTranslations } from "../../../en/authErrors/resetPassword";
import { translations as confirmTranslations } from "./confirm";
import { translations as requestTranslations } from "./request";
import { translations as validateTranslations } from "./validate";

export const translations: typeof enTranslations = {
  confirm: confirmTranslations,
  request: requestTranslations,
  validate: validateTranslations,
};
