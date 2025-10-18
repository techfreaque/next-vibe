import type { translations as enTranslations } from "../../en/auth";
import { translations as commonTranslations } from "./common";
import { translations as errorsTranslations } from "./errors";
import { translations as loginTranslations } from "./login";
import { translations as logoutTranslations } from "./logout";
import { translations as profileTranslations } from "./profile";
import { translations as resetTranslations } from "./reset";
import { translations as resetPasswordTranslations } from "./resetPassword";
import { translations as resetPasswordConfirmTranslations } from "./resetPasswordConfirm";
import { translations as sessionTranslations } from "./session";
import { translations as signupTranslations } from "./signup";
import { translations as twoFactorTranslations } from "./twoFactor";
import { translations as verificationTranslations } from "./verification";

export const translations: typeof enTranslations = {
  common: commonTranslations,
  errors: errorsTranslations,
  login: loginTranslations,
  logout: logoutTranslations,
  profile: profileTranslations,
  reset: resetTranslations,
  resetPassword: resetPasswordTranslations,
  resetPasswordConfirm: resetPasswordConfirmTranslations,
  session: sessionTranslations,
  signup: signupTranslations,
  twoFactor: twoFactorTranslations,
  verification: verificationTranslations,
};
