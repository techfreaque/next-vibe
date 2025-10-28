import { translations as cliTranslations } from "../../cli/i18n/de";
import { translations as tasksTranslations } from "../../tasks/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  cli: cliTranslations,
  tasks: tasksTranslations,
  shared: {
    permissions: {
      publicUsersCannotAccess:
        "Öffentliche Benutzer können nicht auf diese Ressource zugreifen",
      insufficientPermissions:
        "Unzureichende Berechtigungen für den Zugriff auf diese Ressource",
    },
  },
};
