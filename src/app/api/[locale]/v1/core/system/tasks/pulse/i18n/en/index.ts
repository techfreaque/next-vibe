import { translations as executeTranslations } from "../../execute/i18n/en";
import { translations as statusTranslations } from "../../status/i18n/en";

export const translations = {
  execute: {
    category: executeTranslations.category,
    tags: executeTranslations.tags,
    post: executeTranslations.post,
  },
  status: {
    category: statusTranslations.category,
    tags: statusTranslations.tags,
    get: statusTranslations.get,
  },
  success: {
    title: "Success",
    description: "Pulse executed successfully",
    content: "Success",
  },
  container: {
    title: "Pulse Container",
    description: "Pulse container description",
  },
};
