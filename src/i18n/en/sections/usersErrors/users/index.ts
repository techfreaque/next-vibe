import { deleteTranslations } from "./delete";
import { getTranslations } from "./get";
import { postTranslations } from "./post";
import { putTranslations } from "./put";

export const usersTranslations = {
  delete: deleteTranslations,
  get: getTranslations,
  post: postTranslations,
  put: putTranslations,
};
