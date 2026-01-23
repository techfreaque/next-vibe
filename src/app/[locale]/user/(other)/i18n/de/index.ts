import { translations as loginTranslations } from "@/app/[locale]/user/(other)/login/i18n/de";
import { translations as resetPasswordTranslations } from "@/app/[locale]/user/(other)/reset-password/i18n/de";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  login: loginTranslations,
  resetPassword: resetPasswordTranslations,
};
