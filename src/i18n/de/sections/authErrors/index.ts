import type { authErrorsTranslations as EnglishAuthErrorsTranslations } from "../../../en/sections/authErrors";
import { emailCheckTranslations } from "./emailCheck";
import { loginTranslations } from "./login";
import { loginOptionsTranslations } from "./loginOptions";
import { logoutTranslations } from "./logout";
import { resetPasswordTranslations } from "./resetPassword";
import { signupTranslations } from "./signup";
import { userAvatarTranslations } from "./userAvatar";
import { userMeTranslations } from "./userMe";
import { userPasswordTranslations } from "./userPassword";
import { userProfileTranslations } from "./userProfile";

export const translations: typeof EnglishAuthErrorsTranslations = {
  emailCheck: emailCheckTranslations,
  login: loginTranslations,
  loginOptions: loginOptionsTranslations,
  logout: logoutTranslations,
  resetPassword: resetPasswordTranslations,
  signup: signupTranslations,
  userAvatar: userAvatarTranslations,
  userMe: userMeTranslations,
  userPassword: userPasswordTranslations,
  userProfile: userProfileTranslations,
};
