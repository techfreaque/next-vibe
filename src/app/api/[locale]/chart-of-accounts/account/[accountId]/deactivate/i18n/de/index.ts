import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Konto deaktivieren",
    description:
      "Konto soft-deaktivieren. Systemkonten oder Konten mit gebuchten Buchungszeilen können nicht deaktiviert werden.",
    accountId: {
      label: "Konto-ID",
      description: "Das zu deaktivierende Konto",
      placeholder: "Konto-UUID",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Anmeldung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Konto-ID",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Systemkonten können nicht deaktiviert werden",
      },
      server: {
        title: "Serverfehler",
        description: "Konto konnte nicht deaktiviert werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      conflict: {
        title: "Hat Buchungen",
        description: "Konto mit Buchungszeilen kann nicht deaktiviert werden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Server nicht erreichbar",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Konto nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Konto deaktiviert",
      description: "Das Konto ist jetzt inaktiv",
    },
    widget: {
      confirmWarning:
        "Dieses Konto wird deaktiviert. Bei Konten mit gebuchten Transaktionen ist dies nicht rückgängig zu machen.",
      doneLabel: "Erledigt",
      confirmTitle: "Konto deaktivieren?",
      confirmDescription:
        "Dieses Konto wird deaktiviert und kann nicht mehr für neue Buchungen verwendet werden. Bestehende Buchungen sind nicht betroffen.",
      confirmButton: "Ja, deaktivieren",
      cancelButton: "Abbrechen",
    },
  },
  title: "Konto deaktivieren",
  description: "Konto soft-deaktivieren",
  category: "Kontenplan",
  tag: "Konto",
};
