import type { foldersTranslations as EnglishFoldersTranslations } from "../../../../en/sections/imapErrors/folders";
import { getTranslations } from "./get";
import { listTranslations } from "./list";
import { syncTranslations } from "./sync";

export const foldersTranslations: typeof EnglishFoldersTranslations = {
  get: getTranslations,
  list: listTranslations,
  sync: syncTranslations,
};
