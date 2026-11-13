import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Newsletter",
  post: {
    title: "Newsletter-Versand",
    titleShort: "Versand",
    description:
      "Einmaligen Newsletter nur an bestätigte Abonnenten senden. Der Testlauf zeigt die Empfänger pro Sprache. Jetzt senden verschickt genau diesen Newsletter, sonst nichts.",
    container: {
      title: "Newsletter-Versand",
      description: "Nur bestätigte Abonnenten. Zählen, einreihen, senden.",
    },
    fields: {
      dryRun: {
        label: "Testlauf",
        description:
          "Einwilligende Empfänger pro Sprache zählen. Schreibt nichts, sendet nichts.",
      },
      send: {
        label: "Jetzt senden",
        description:
          "Diesen Newsletter sofort an alle einwilligenden Empfänger schicken. Andere wartende Kampagnen bleiben unberührt.",
      },
    },
    response: {
      audience: "Einwilligende Empfänger",
      byLocale: "Empfänger pro Sprache",
      scheduled: "Neu eingereiht",
      alreadyPending: "Bereits eingereiht",
      cancelled: "Storniert (keine Einwilligung)",
      alreadySent: "Übersprungen (schon erhalten)",
      duplicates: "Doppelte Einträge storniert",
      errors: "Fehler",
      sent: "Gesendet",
      sendSkipped: "Beim Versand übersprungen (schon erhalten)",
      sendFailed: "Versand fehlgeschlagen",
    },
    success: {
      title: "Newsletter-Versand eingereiht",
      description:
        "Einwilligende Empfänger sind eingereiht. Mit Jetzt senden gehen die Mails in diesem Lauf raus.",
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
