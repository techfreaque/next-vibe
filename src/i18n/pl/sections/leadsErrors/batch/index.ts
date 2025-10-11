import type { batchTranslations as EnglishBatchTranslations } from "../../../../en/sections/leadsErrors/batch";
import { updateTranslations } from "./update";

export const batchTranslations: typeof EnglishBatchTranslations = {
  update: updateTranslations,
};
