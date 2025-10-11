import { deleteTranslations } from "./delete";
import { formTranslations } from "./form";
import { getTranslations } from "./get";
import { postTranslations } from "./post";
import { putTranslations } from "./put";

export const subscriptionTranslations = {
  delete: deleteTranslations,
  form: formTranslations,
  get: getTranslations,
  post: postTranslations,
  put: putTranslations,
};
