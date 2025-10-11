import type { usersTranslations as EnglishUsersTranslations } from "../../../../en/sections/usersErrors/users";
import { deleteTranslations } from "./delete";
import { getTranslations } from "./get";
import { postTranslations } from "./post";
import { putTranslations } from "./put";

export const usersTranslations: typeof EnglishUsersTranslations = {
  delete: deleteTranslations,
  get: getTranslations,
  post: postTranslations,
  put: putTranslations,
};
