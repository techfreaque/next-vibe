import { deleteTranslations } from "./delete";
import { getTranslations } from "./get";
import { listTranslations } from "./list";
import { postTranslations } from "./post";
import { putTranslations } from "./put";
import { testTranslations } from "./test";

export const accountsTranslations = {
  delete: deleteTranslations,
  get: getTranslations,
  list: listTranslations,
  post: postTranslations,
  put: putTranslations,
  test: testTranslations,
};
