import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  title: "Ordner anzeigen",
  titleShort: "Ordner",
  description: "Verfügbare Ordner eines Messenger-Kontos anzeigen",
  tag: "Posteingang",

  container: {
    title: "Ordner",
    description: "Verfügbare Ordner des ausgewählten Kontos",
  },

  accountId: {
    label: "Konto",
    description: "Messenger-Konto, dessen Ordner abgerufen werden sollen",
    placeholder: "Konto-UUID",
  },

  folders: {
    label: "Ordner",
    path: { label: "Pfad" },
    name: { label: "Name" },
    displayName: { label: "Anzeigename" },
    specialUseType: { label: "Typ" },
    messageCount: { label: "Nachrichten" },
    unseenCount: { label: "Ungelesen" },
  },

  errors: {
    validation: {
      title: "Ungültige Eingabe",
      description: "Bitte Eingaben prüfen",
    },
    unauthorized: {
      title: "Nicht angemeldet",
      description: "Anmeldung erforderlich",
    },
    server: {
      title: "Serverfehler",
      description: "Interner Serverfehler",
      detail: "Ordner konnten nicht geladen werden: {{error}}",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
    forbidden: { title: "Kein Zugriff", description: "Zugriff verweigert" },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkfehler aufgetreten",
    },
    notFound: {
      title: "Konto nicht gefunden",
      description: "Messenger-Konto nicht gefunden",
    },
    conflict: {
      title: "Konflikt",
      description: "Anfrage steht im Konflikt mit vorhandenen Daten",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Sie haben ungespeicherte Änderungen",
    },
  },

  success: {
    title: "Ordner geladen",
    description: "Ordner erfolgreich abgerufen",
  },
};
