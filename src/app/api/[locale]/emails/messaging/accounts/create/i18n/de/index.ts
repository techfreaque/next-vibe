import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Messaging-Konto erstellen",
  description: "Neues SMS-, WhatsApp- oder Telegram-Providerkonto hinzufügen",

  fields: {
    name: {
      label: "Kontoname",
      description: "Ein eindeutiger Name für dieses Konto",
      placeholder: "z.B. Twilio SMS Produktion",
    },
    description: {
      label: "Beschreibung",
      description: "Optionale Beschreibung",
      placeholder: "Optionale Beschreibung...",
    },
    channel: {
      label: "Kanal",
      description: "Nachrichtenkanal (SMS, WhatsApp, Telegram)",
    },
    provider: {
      label: "Anbieter",
      description: "Messaging-Anbieter",
    },
    fromId: {
      label: "Absender / Telefonnummer-ID",
      description: "Absender-ID oder Telefonnummer-ID",
      placeholder: "z.B. +1234567890",
    },
    apiToken: {
      label: "API-Token / SID",
      description: "Primäres API-Zugangsdaten",
      placeholder: "API-Token oder Konto-SID",
    },
    apiSecret: {
      label: "API-Secret / Auth-Token",
      description: "Sekundäres API-Zugangsdaten",
      placeholder: "API-Secret oder Auth-Token",
    },
    priority: {
      label: "Priorität",
      description: "Kontopriorität (0 = niedrigste)",
    },
  },

  response: {
    id: "ID",
    status: "Status",
    createdAt: "Erstellt",
  },

  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Eingabe",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Admin-Zugriff erforderlich",
    },
    forbidden: { title: "Verboten", description: "Zugriff verweigert" },
    notFound: {
      title: "Nicht gefunden",
      description: "Ressource nicht gefunden",
    },
    conflict: {
      title: "Name bereits vergeben",
      description: "Ein Konto mit diesem Namen existiert bereits",
    },
    server: {
      title: "Serverfehler",
      description: "Konto konnte nicht erstellt werden",
    },
    networkError: { title: "Netzwerkfehler", description: "Netzwerkfehler" },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Sie haben ungespeicherte Änderungen",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
  },

  success: {
    title: "Konto erstellt",
    description: "Messaging-Konto erfolgreich erstellt",
  },
};
