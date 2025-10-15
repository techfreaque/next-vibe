import { translations as executeTranslations } from "../../execute/i18n/en";
import { translations as statusTranslations } from "../../status/i18n/en";

export const translations = {
  execute: {
    post: executeTranslations.post,
  },
  status: {
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
