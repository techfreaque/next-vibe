import type { translations as enTranslations } from "../../en/authErrors";
import { translations as emailCheckTranslations } from "./emailCheck";
import { translations as loginTranslations } from "./login";
import { translations as loginOptionsTranslations } from "./loginOptions";
import { translations as logoutTranslations } from "./logout";
import { translations as resetPasswordTranslations } from "./resetPassword";
import { translations as signupTranslations } from "./signup";
import { translations as userAvatarTranslations } from "./userAvatar";
import { translations as userMeTranslations } from "./userMe";
import { translations as userPasswordTranslations } from "./userPassword";
import { translations as userProfileTranslations } from "./userProfile";

export const translations: typeof enTranslations = {
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
