import { translations as loginTranslations } from "../../login/i18n/pl";
import { translations as resetPasswordTranslations } from "../../reset-password/i18n/pl";
import { translations as referralTranslations } from "../../referral/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  login: loginTranslations,
  resetPassword: resetPasswordTranslations,
  referral: referralTranslations,
};
