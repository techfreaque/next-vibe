import type { translations as enTranslations } from "../../en/user";
import { translations as accountTranslations } from "./account";
import { translations as avatarTranslations } from "./avatar";
import { translations as errorsTranslations } from "./errors";
import { translations as passwordTranslations } from "./password";
import { translations as profileTranslations } from "./profile";
import { translations as rolesTranslations } from "./roles";
import { translations as searchTranslations } from "./search";

export const translations: typeof enTranslations = {
  account: accountTranslations,
  avatar: avatarTranslations,
  errors: errorsTranslations,
  password: passwordTranslations,
  profile: profileTranslations,
  roles: rolesTranslations,
  search: searchTranslations,
};
