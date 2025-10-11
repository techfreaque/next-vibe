import { getTranslations } from "./get";
import { listTranslations } from "./list";
import { syncTranslations } from "./sync";
import { updateTranslations } from "./update";

export const messagesTranslations = {
  get: getTranslations,
  list: listTranslations,
  sync: syncTranslations,
  update: updateTranslations,
};
