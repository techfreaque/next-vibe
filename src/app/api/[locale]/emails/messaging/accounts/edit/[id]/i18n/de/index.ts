import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Messaging-Konto",
    description: "Messaging-Konto-Details anzeigen",
  },
  put: {
    title: "Messaging-Konto bearbeiten",
    description: "Messaging-Konto-Einstellungen aktualisieren",
    success: {
      title: "Konto aktualisiert",
      description: "Messaging-Konto erfolgreich aktualisiert",
    },
  },

  fields: {
    id: { label: "ID", description: "Konto-ID" },
    name: {
      label: "Kontoname",
      description: "Name für dieses Konto",
      placeholder: "z.B. Twilio SMS Produktion",
    },
    description: {
      label: "Beschreibung",
      description: "Optionale Beschreibung",
      placeholder: "Optionale Beschreibung...",
    },
    channel: { label: "Kanal", description: "Nachrichtenkanal" },
    provider: { label: "Anbieter", description: "Messaging-Anbieter" },
    fromId: {
      label: "Absender / Telefonnummer-ID",
      description: "Absender-ID oder Telefonnummer-ID",
      placeholder: "z.B. +1234567890",
    },
    apiToken: {
      label: "API-Token / SID",
      description: "Leer lassen, um aktuellen Token beizubehalten",
      placeholder: "Neuer API-Token (leer lassen zum Beibehalten)",
    },
    apiSecret: {
      label: "API-Secret / Auth-Token",
      description: "Leer lassen, um aktuelles Secret beizubehalten",
      placeholder: "Neues API-Secret (leer lassen zum Beibehalten)",
    },
    priority: { label: "Priorität", description: "Kontopriorität" },
    status: { label: "Status", description: "Kontostatus" },
  },

  response: {
    account: {
      name: "Name",
      description: "Beschreibung",
      channel: "Kanal",
      provider: "Anbieter",
      fromId: "Von",
      status: "Status",
      priority: "Priorität",
      messagesSentTotal: "Gesamt gesendet",
      lastUsedAt: "Zuletzt verwendet",
      createdAt: "Erstellt",
      updatedAt: "Aktualisiert",
    },
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
      title: "Konto nicht gefunden",
      description: "Das Messaging-Konto wurde nicht gefunden",
    },
    conflict: {
      title: "Name bereits vergeben",
      description: "Ein Konto mit diesem Namen existiert bereits",
    },
    server: {
      title: "Serverfehler",
      description: "Konto konnte nicht aktualisiert werden",
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
    title: "Konto abgerufen",
    description: "Messaging-Konto erfolgreich abgerufen",
  },
};
