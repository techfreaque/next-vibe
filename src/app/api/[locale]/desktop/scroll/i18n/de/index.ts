import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Scrollen",
  description: "An der aktuellen oder angegebenen Mauszeigerposition scrollen",
  form: {
    label: "Scrollen",
    description:
      "Hoch, runter, links oder rechts an der angegebenen Position scrollen",
    fields: {
      x: {
        label: "X-Koordinate",
        description:
          "Horizontale Scrollposition (aktuelle Position wenn weggelassen)",
        placeholder: "100",
      },
      y: {
        label: "Y-Koordinate",
        description:
          "Vertikale Scrollposition (aktuelle Position wenn weggelassen)",
        placeholder: "200",
      },
      direction: {
        label: "Richtung",
        description: "Scroll-Richtung",
        placeholder: "runter",
        options: {
          up: "Hoch",
          down: "Runter",
          left: "Links",
          right: "Rechts",
        },
      },
      amount: {
        label: "Menge",
        description: "Anzahl der Scroll-Schritte (Standard: 3)",
        placeholder: "3",
      },
    },
  },
  response: {
    success: "Scrollen erfolgreich ausgeführt",
    error: "Fehlermeldung",
    executionId: "Ausführungs-ID zur Verfolgung",
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description:
        "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Ein Netzwerkfehler ist beim Scrollen aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, auf dem Desktop zu scrollen",
    },
    forbidden: {
      title: "Verboten",
      description: "Das Scrollen auf dem Desktop ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description: "Ein interner Serverfehler ist beim Scrollen aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist beim Scrollen aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist beim Scrollen aufgetreten",
    },
    notImplemented: {
      title: "Nicht implementiert",
      description:
        "Diese Funktion ist auf Ihrem Betriebssystem nicht verfügbar",
    },
  },
  success: {
    title: "Gescrollt",
    description: "Das Scrollen wurde erfolgreich ausgeführt",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Desktop-Automatisierung",
    inputAutomation: "Eingabe-Automatisierung",
  },
};
