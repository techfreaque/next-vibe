import type { accountsTranslations as EnglishAccountsTranslations } from "../../../../en/sections/imapErrors/accounts";
import { deleteTranslations } from "./delete";
import { getTranslations } from "./get";
import { listTranslations } from "./list";
import { postTranslations } from "./post";
import { putTranslations } from "./put";
import { testTranslations } from "./test";

export const accountsTranslations: typeof EnglishAccountsTranslations = {
  delete: deleteTranslations,
  get: getTranslations,
  list: listTranslations,
  post: postTranslations,
  put: putTranslations,
  test: testTranslations,
};
