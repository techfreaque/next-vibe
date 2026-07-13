import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Fernverbindung",
  },
  providers: {
    memories: "Erinnerungen",
    documents: "Dokumente",
    skills: "Skills",
    favorites: "Favoriten",
    threads: "Threads",
  },
  providerDescriptions: {
    memories: "KI-Erinnerungen zwischen Instanzen synchronisieren",
    documents: "Dokumentbibliothek synchronisieren",
    skills: "Eigene Skills und Prompts synchronisieren",
    favorites: "Gespeicherte Favoriten synchronisieren",
    threads: "Gesprächsverläufe und Nachrichten synchronisieren",
  },
  get: {
    title: "Sync-Anbieter",
    titleShort: "Sync-Anbieter",
    description:
      "Alle registrierten Sync-Anbieter für Verbindungseinstellungen auflisten",
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Kein Zugriff",
        description: "Admin-Rolle erforderlich",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Anbieter registriert",
      },
      server: {
        title: "Serverfehler",
        description: "Anbieter konnten nicht geladen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Du hast ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
    },
    success: {
      title: "Anbieter geladen",
      description: "Sync-Anbieterliste erfolgreich abgerufen",
    },
  },
};
