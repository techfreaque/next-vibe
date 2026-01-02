import { translations as idTranslations } from "../../[id]/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Benutzer",
  tag: "Benutzerverwaltung",
  errors: {
    not_found: {
      title: "Benutzer nicht gefunden",
      description: "Der angeforderte Benutzer konnte nicht gefunden werden",
    },
    internal: {
      title: "Interner Fehler",
      description: "Ein interner Fehler ist bei der Verarbeitung der Benutzeranfrage aufgetreten",
    },
  },
  id: idTranslations,
};
