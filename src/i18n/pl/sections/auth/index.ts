import type { authTranslations as EnglishAuthTranslations } from "../../../en/sections/auth";
import { commonTranslations } from "./common";
import { errorsTranslations } from "./errors";
import { loginTranslations } from "./login";
import { logoutTranslations } from "./logout";
import { profileTranslations } from "./profile";
import { resetTranslations } from "./reset";
import { resetPasswordTranslations } from "./resetPassword";
import { resetPasswordConfirmTranslations } from "./resetPasswordConfirm";
import { sessionTranslations } from "./session";
import { signupTranslations } from "./signup";
import { twoFactorTranslations } from "./twoFactor";
import { verificationTranslations } from "./verification";

export const authTranslations: typeof EnglishAuthTranslations = {
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
