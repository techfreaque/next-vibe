import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Newsletter",
  post: {
    title: "Newsletter-Versand",
    titleShort: "Versand",
    description:
      "Einmaligen, einwilligungsgefilterten Newsletter an bestätigte Abonnenten einreihen. Der email-campaigns-Dispatcher versendet die eingereihten Zeilen.",
    container: {
      title: "Newsletter-Versand",
      description: "Einwilligungsgefiltertes einmaliges Einreihen",
    },
    fields: {
      dryRun: {
        label: "Testlauf",
        description:
          "Die einwilligende Zielgruppe zählen, ohne E-Mails einzureihen.",
      },
    },
    response: {
      scheduled: "Eingereiht",
      skipped: "Übersprungen",
      errors: "Fehler",
    },
    success: {
      title: "Newsletter-Versand eingereiht",
      description:
        "Einwilligungsgefilterte Empfänger wurden für den nächsten Dispatcher-Lauf eingereiht.",
    },
  },
  errors: {
    unauthorized: {
      title: "Nicht angemeldet",
      description: "Melde dich an, um den Newsletter-Versand auszuführen.",
    },
    forbidden: {
      title: "Nicht erlaubt",
      description: "Nur Admins können den Newsletter-Versand ausführen.",
    },
    server: {
      title: "Etwas ist schiefgelaufen",
      description:
        "Der Newsletter-Versand konnte nicht ausgeführt werden. Versuche es erneut.",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten.",
    },
    validation: {
      title: "Ungültige Eingabe",
      description: "Prüfe die Anfrage und versuche es erneut.",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden.",
    },
    conflict: {
      title: "Konflikt",
      description: "Diese Aktion steht im Konflikt mit dem aktuellen Zustand.",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Ein Netzwerkfehler ist aufgetreten. Versuche es erneut.",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Du hast ungespeicherte Änderungen.",
    },
  },
};
