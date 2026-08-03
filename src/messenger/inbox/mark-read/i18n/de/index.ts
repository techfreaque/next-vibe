import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  title: "Als gelesen markieren",
  titleShort: "Als gelesen",
  description: "Eine Nachricht als gelesen oder ungelesen markieren",
  tag: "Posteingang",

  container: {
    title: "Nachricht markieren",
    description: "Lesestatus einer Nachricht aktualisieren",
  },

  accountId: {
    label: "Konto",
    description: "Messenger-Konto",
    placeholder: "Konto-UUID",
  },
  uid: {
    label: "Nachrichten-UID",
    description: "UID der Nachricht",
    placeholder: "12345",
  },
  folderPath: {
    label: "Ordner",
    description: "Ordnerpfad, der die Nachricht enthält",
    placeholder: "INBOX",
  },
  isRead: {
    label: "Als gelesen markieren",
    description:
      "Aktivieren zum Markieren als gelesen, deaktivieren für ungelesen",
  },

  updated: { label: "Aktualisiert" },

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
      detail: "Lesestatus konnte nicht aktualisiert werden: {{error}}",
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
    title: "Nachricht aktualisiert",
    description: "Lesestatus erfolgreich aktualisiert",
  },
};
