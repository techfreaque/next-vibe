import { translations as cliTranslations } from "../../cli/i18n/en";
import { translations as tasksTranslations } from "../../tasks/i18n/en";

export const translations = {
  cli: cliTranslations,
  tasks: tasksTranslations,
  shared: {
    permissions: {
      publicUsersCannotAccess: "Public users cannot access this resource",
      insufficientPermissions:
        "Insufficient permissions to access this resource",
    },
  },
};
