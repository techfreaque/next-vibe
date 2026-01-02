import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Netzwerk-Anfragen auflisten",
  description: "Alle Anfragen der aktuell ausgewählten Seite seit der letzten Navigation auflisten",
  form: {
    label: "Netzwerk-Anfragen auflisten",
    description: "Alle Netzwerk-Anfragen von der Browser-Seite abrufen",
    fields: {
      includePreservedRequests: {
        label: "Bewahrte Anfragen einbeziehen",
        description:
          "Auf true setzen, um die bewahrten Anfragen der letzten 3 Navigationen zurückzugeben",
        placeholder: "false",
      },
      pageIdx: {
        label: "Seitenindex",
        description: "Seitennummer zum Zurückgeben (0-basiert, weglassen für erste Seite)",
        placeholder: "Seitenindex eingeben",
      },
      pageSize: {
        label: "Seitengröße",
        description: "Maximale Anzahl der zurückzugebenden Anfragen (weglassen für alle Anfragen)",
        placeholder: "Seitengröße eingeben",
      },
      resourceTypes: {
        label: "Ressourcentypen",
        description:
          "Anfragen filtern, um nur Anfragen der angegebenen Ressourcentypen zurückzugeben (weglassen für alle)",
        placeholder: "Ressourcentypen auswählen",
        options: {
          document: "Dokument",
          stylesheet: "Stylesheet",
          image: "Bild",
          media: "Medien",
          font: "Schriftart",
          script: "Skript",
          texttrack: "Text-Track",
          xhr: "XHR",
          fetch: "Fetch",
          prefetch: "Prefetch",
          eventsource: "Event Source",
          websocket: "WebSocket",
          manifest: "Manifest",
          signedexchange: "Signed Exchange",
          ping: "Ping",
          cspviolationreport: "CSP-Verletzungsbericht",
          preflight: "Preflight",
          fedcm: "FedCM",
          other: "Andere",
        },
      },
    },
  },
  response: {
    success: "Netzwerk-Anfragen erfolgreich abgerufen",
    result: {
      title: "Ergebnis",
      description: "Ergebnis der Netzwerk-Anfragen-Liste",
      requests: {
        reqid: "Anfrage-ID",
        url: "URL",
        method: "Methode",
        status: "Status",
        type: "Typ",
      },
      totalCount: "Gesamtanzahl",
    },
    error: "Fehlermeldung",
    executionId: "Ausführungs-ID zur Verfolgung",
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Ein Netzwerkfehler ist beim Auflisten der Netzwerk-Anfragen aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Netzwerk-Anfragen aufzulisten",
    },
    forbidden: {
      title: "Verboten",
      description: "Auflisten von Netzwerk-Anfragen ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description: "Ein interner Serverfehler ist beim Auflisten der Netzwerk-Anfragen aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist beim Auflisten der Netzwerk-Anfragen aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description: "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist beim Auflisten der Netzwerk-Anfragen aufgetreten",
    },
  },
  success: {
    title: "Netzwerk-Anfragen erfolgreich abgerufen",
    description: "Die Netzwerk-Anfragen wurden erfolgreich abgerufen",
  },
};
