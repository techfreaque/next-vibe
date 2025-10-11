import { translations as idTranslations } from "../../[id]/i18n/en";

export const translations = {
  category: "Users",
  tag: "User Management",
  errors: {
    not_found: {
      title: "User Not Found",
      description: "The requested user could not be found",
    },
    internal: {
      title: "Internal Error",
      description:
        "An internal error occurred while processing the user request",
    },
  },
  id: idTranslations,
};
