import { translations as cliTranslations } from "../../cli/i18n/pl";
import { translations as tasksTranslations } from "../../tasks/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations = {
  cli: cliTranslations,
  tasks: tasksTranslations,
  shared: {
    permissions: {
      publicUsersCannotAccess:
        "Użytkownicy publiczni nie mogą uzyskać dostępu do tego zasobu",
      insufficientPermissions:
        "Niewystarczające uprawnienia do dostępu do tego zasobu",
    },
  },
} satisfies typeof enTranslations;
