import type { translations as enTranslations } from "../en";

import { translations as loginTranslations } from "../../login/i18n/de";
import { translations as resetPasswordTranslations } from "../../reset-password/i18n/de";
import { translations as signupTranslations } from "../../signup/i18n/de";

export const translations: typeof enTranslations = {
  login: loginTranslations,
  resetPassword: resetPasswordTranslations,
  signup: signupTranslations,
};
