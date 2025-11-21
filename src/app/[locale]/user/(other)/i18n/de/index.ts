import { translations as loginTranslations } from "../../login/i18n/de";
import { translations as resetPasswordTranslations } from "../../reset-password/i18n/de";
import { translations as referralTranslations } from "../../referral/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  login: loginTranslations,
  resetPassword: resetPasswordTranslations,
  referral: referralTranslations,
};
