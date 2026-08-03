import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  title: "Posteingang",
  titleShort: "Posteingang",
  description:
    "Nachrichten aus dem Posteingang oder einem bestimmten Ordner anzeigen",
  tag: "Posteingang",

  container: {
    title: "Posteingang",
    description: "Nachrichten des ausgewählten Kontos und Ordners",
  },

  accountId: {
    label: "Konto",
    description: "Messenger-Konto, dessen Posteingang abgerufen werden soll",
    placeholder: "Konto-UUID",
  },
  folderPath: {
    label: "Ordner",
    description: "Ordnerpfad (Standard: INBOX)",
    placeholder: "INBOX",
  },

  messages: {
    label: "Nachrichten",
    uid: { label: "UID" },
    messageId: { label: "Nachrichten-ID" },
    subject: { label: "Betreff" },
    from: { label: "Von" },
    to: { label: "An" },
    date: { label: "Datum" },
    isRead: { label: "Gelesen" },
    isFlagged: { label: "Markiert" },
    folderPath: { label: "Ordner" },
    bodyText: { label: "Inhalt" },
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
      detail: "Posteingang konnte nicht geladen werden: {{error}}",
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
    title: "Posteingang geladen",
    description: "Nachrichten erfolgreich abgerufen",
  },
};
