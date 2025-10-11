import type { patchTranslations as EnglishPatchTranslations } from "../../../../en/sections/leadsErrors/leadsImport/patch";

export const patchTranslations: typeof EnglishPatchTranslations = {
  success: {
    title: "Import-Auftrag erfolgreich aktualisiert",
    description: "Auftragseinstellungen wurden aktualisiert",
  },
  error: {
    validation: {
      title: "Ungültige Auftragsaktualisierungsanfrage",
      description: "Bitte überprüfen Sie Ihre Aktualisierungsparameter",
    },
    unauthorized: {
      title: "Auftragsaktualisierung nicht autorisiert",
      description:
        "Sie haben keine Berechtigung, diesen Auftrag zu aktualisieren",
    },
    forbidden: {
      title: "Auftragsaktualisierung verboten",
      description:
        "Sie haben keine Berechtigung, diesen Import-Auftrag zu aktualisieren",
    },
    not_found: {
      title: "Import-Auftrag nicht gefunden",
      description: "Der Import-Auftrag konnte nicht gefunden werden",
    },
    server: {
      title: "Auftragsaktualisierung Serverfehler",
      description:
        "Auftrag konnte aufgrund eines Serverfehlers nicht aktualisiert werden",
    },
    unknown: {
      title: "Auftragsaktualisierung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler beim Aktualisieren des Auftrags ist aufgetreten",
    },
  },
};
