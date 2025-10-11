import type { usersErrorsTranslations as EnglishUsersErrorsTranslations } from "../../../en/sections/usersErrors";
import { usersTranslations } from "./users";
import { validationTranslations } from "./validation";

export const usersErrorsTranslations: typeof EnglishUsersErrorsTranslations = {
  users: usersTranslations,
  validation: validationTranslations,
};
