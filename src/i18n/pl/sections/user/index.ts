import type { userTranslations as EnglishUserTranslations } from "../../../en/sections/user";
import { accountTranslations } from "./account";
import { avatarTranslations } from "./avatar";
import { errorsTranslations } from "./errors";
import { passwordTranslations } from "./password";
import { profileTranslations } from "./profile";
import { rolesTranslations } from "./roles";
import { searchTranslations } from "./search";

export const userTranslations: typeof EnglishUserTranslations = {
  account: accountTranslations,
  avatar: avatarTranslations,
  errors: errorsTranslations,
  password: passwordTranslations,
  profile: profileTranslations,
  roles: rolesTranslations,
  search: searchTranslations,
};
