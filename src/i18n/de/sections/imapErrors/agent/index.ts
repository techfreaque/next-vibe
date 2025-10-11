import type { agentTranslations as EnglishAgentTranslations } from "../../../../en/sections/imapErrors/agent";
import { confirmationTranslations } from "./confirmation";
import { fieldsTranslations } from "./fields";
import { processingTranslations } from "./processing";
import { statusTranslations } from "./status";

export const agentTranslations: typeof EnglishAgentTranslations = {
  confirmation: confirmationTranslations,
  fields: fieldsTranslations,
  processing: processingTranslations,
  status: statusTranslations,
};
