import type { translations as enTranslations } from "../en";
import { translations as authClientTranslations } from "./authClient";
import { translations as loginTranslations } from "./login";
import { translations as resetPasswordTranslations } from "./resetPassword";
import { translations as sessionTranslations } from "./session";
import { translations as userAvatarTranslations } from "./userAvatar";
import { translations as userMeTranslations } from "./userMe";
import { translations as userPasswordTranslations } from "./userPassword";
import { translations as authTranslations } from "./auth";
import { translations as authErrorsTranslations } from "./authErrors";
import { translations as userTranslations } from "./user";

export const translations: typeof enTranslations = {
  auth: authTranslations,
  authClient: authClientTranslations,
  authErrors: authErrorsTranslations,
  login: loginTranslations,
  resetPassword: resetPasswordTranslations,
  session: sessionTranslations,
  user: userTranslations,
  userAvatar: userAvatarTranslations,
  userMe: userMeTranslations,
  userPassword: userPasswordTranslations,
};
