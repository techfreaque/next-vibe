import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  title: "Nachricht verschieben",
  titleShort: "Nachricht verschieben",
  description: "Eine Nachricht in einen anderen Ordner verschieben",
  tag: "Posteingang",

  container: {
    title: "Nachricht verschieben",
    description: "Nachricht von einem Ordner in einen anderen verschieben",
  },

  accountId: {
    label: "Konto",
    description: "Messenger-Konto",
    placeholder: "Konto-UUID",
  },
  uid: {
    label: "Nachrichten-UID",
    description: "UID der zu verschiebenden Nachricht",
    placeholder: "12345",
  },
  fromFolder: {
    label: "Von Ordner",
    description: "Aktueller Ordnerpfad",
    placeholder: "INBOX",
  },
  toFolder: {
    label: "Nach Ordner",
    description: "Zielordnerpfad",
    placeholder: "Archiv",
  },

  moved: { label: "Verschoben" },

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
      detail: "Verschieben fehlgeschlagen: {{error}}",
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
    title: "Nachricht verschoben",
    description: "Die Nachricht wurde erfolgreich verschoben",
  },
};
