import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Benutzer Abmelden",
  description:
    "Meldet den aktuellen Benutzer ab und macht seine Sitzung ungültig",
  category: "Benutzerverwaltung",
  tag: "abmelden",
  response: {
    title: "Abmelde-Antwort",
    description: "Antwort, die eine erfolgreiche Abmeldung anzeigt",
    success: "Erfolg",
    message: "Nachricht",
    sessionsCleaned: "Sitzungen bereinigt",
    nextSteps: "Empfohlene nächste Schritte nach der Abmeldung",
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Die Abmelde-Anfrage enthält ungültige Daten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie müssen angemeldet sein, um sich abzumelden",
    },
    internal: {
      title: "Interner Serverfehler",
      description: "Ein interner Fehler ist beim Abmelden aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist beim Abmelden aufgetreten",
    },
    session_deletion_failed: {
      title: "Sitzungslöschung fehlgeschlagen",
      description: "Löschen der Benutzersitzung fehlgeschlagen",
    },
    conflict: {
      title: "Abmeldungskonflikt",
      description: "Ein Konflikt ist beim Abmelden aufgetreten",
    },
    forbidden: {
      title: "Verboten",
      description: "Abmeldungsaktion ist verboten",
    },
    network_error: {
      title: "Netzwerkfehler",
      description: "Netzwerkfehler beim Abmelden",
    },
    not_found: {
      title: "Nicht gefunden",
      description: "Sitzung nicht gefunden",
    },
    server_error: {
      title: "Serverfehler",
      description: "Interner Serverfehler beim Abmelden",
    },
    unsaved_changes: {
      title: "Ungespeicherte Änderungen",
      description: "Es gibt ungespeicherte Änderungen",
    },
    invalid_user: {
      title: "Ungültiger Benutzer",
      description: "Der Benutzer ist nicht gültig oder existiert nicht",
    },
  },
  success: {
    title: "Abmeldung erfolgreich",
    description: "Sie wurden erfolgreich abgemeldet",
    message: "Benutzer erfolgreich abgemeldet",
  },
};
