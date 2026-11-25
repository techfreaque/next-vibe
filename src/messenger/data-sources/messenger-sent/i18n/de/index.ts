import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    messageType: {
      all: "Alle Typen",
      system: "System",
      transactional: "Transaktional",
      notification: "Benachrichtigung",
      marketing: "Marketing",
      leadCampaign: "Lead-Kampagne",
      userCommunication: "Nutzernachricht",
    },
  },
  post: {
    title: "Gesendete Nachrichten",
    titleShort: "Gesendet",
    description: "Ausgehende gesendete Nachrichten pro Auflösungs-Bucket",
    fields: {
      resolution: { label: "Auflösung", description: "Berechnungszeitrahmen" },
      range: { label: "Bereich", description: "Abzufragender Zeitraum" },
      lookback: {
        label: "Rückblick",
        description: "Extra Balken vor Bereichsstart",
      },
      messageType: {
        label: "Nachrichtentyp",
        description: "Alle gesendeten Nachrichten oder nur einen Typ zählen",
      },
      result: {
        label: "Gesendete Nachrichten",
        description: "Ausgabe-Zeitreihe",
      },
      meta: { label: "Meta", description: "Knotenausführungsmetadaten" },
    },
    success: {
      title: "Gesendete Nachrichten berechnet",
      description: "Gesendete Nachrichten-Reihe zurückgegeben",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Administratorzugang erforderlich",
      },
      server: { title: "Serverfehler", description: "Abfrage fehlgeschlagen" },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      notFound: { title: "Nicht gefunden", description: "Nicht gefunden" },
      conflict: { title: "Konflikt", description: "Konflikt" },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkanfrage fehlgeschlagen",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Änderungen zuerst speichern",
      },
    },
  },
};
