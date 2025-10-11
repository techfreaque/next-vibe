import type { putTranslations as EnglishPutTranslations } from "../../../../en/sections/templateErrors/template/put";

export const putTranslations: typeof EnglishPutTranslations = {
  error: {
    validation: {
      title: "Validierung der Vorlagen-Aktualisierung fehlgeschlagen",
      description:
        "Bitte überprüfe Ihre Vorlagen-Änderungen und versuche es erneut",
    },
    network: {
      title: "Vorlage-Update-Netzwerkfehler",
      description:
        "Vorlage konnte aufgrund eines Netzwerkfehlers nicht aktualisiert werden",
    },
    unauthorized: {
      title: "Vorlagen-Aktualisierung nicht autorisiert",
      description: "Sie haben keine Berechtigung, Vorlagen zu aktualisieren",
    },
    forbidden: {
      title: "Vorlage-Update verboten",
      description: "Zugriff zum Aktualisieren dieser Vorlage ist verboten",
    },
    notFound: {
      title: "Vorlage nicht gefunden",
      description:
        "Die Vorlage, die Sie aktualisieren möchten, wurde nicht gefunden",
    },
    server: {
      title: "Server-Fehler bei Vorlagen-Aktualisierung",
      description:
        "Vorlage konnte aufgrund eines Server-Fehlers nicht aktualisiert werden",
    },
    unknown: {
      title: "Vorlagen-Aktualisierung fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler ist bei der Vorlagen-Aktualisierung aufgetreten",
    },
    unsavedChanges: {
      title: "Ungespeicherte Vorlage-Änderungen",
      description: "Sie haben ungespeicherte Änderungen an Ihrer Vorlage",
    },
    conflict: {
      title: "Vorlage-Update-Konflikt",
      description:
        "Die Vorlage wurde von einem anderen Benutzer geändert. Bitte aktualisieren Sie und versuchen Sie es erneut",
    },
  },
};
