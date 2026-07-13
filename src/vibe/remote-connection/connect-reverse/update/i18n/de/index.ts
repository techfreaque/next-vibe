import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Fernverbindung",
  },
  widget: {
    title: "Rück-Sync",
    description:
      "System-Endpunkt. Wird von der initiierenden Instanz aufgerufen, um syncScope-Änderungen zur Gegenseite zu spiegeln.",
    note: "Nicht für Benutzer — wird automatisch bei Verbindungseinstellungs-Updates aufgerufen.",
  },
  patch: {
    title: "Rückverbindung aktualisieren",
    titleShort: "Rückverbindung",
    description:
      "Von der initiierenden Instanz aufgerufen, um Verbindungseinstellungen zur Gegenseite zu synchronisieren",
    syncScope: {
      label: "Sync-Bereich",
      description:
        "Welche Datenbereiche über diese Verbindung synchronisiert werden",
    },
    newInstanceId: {
      label: "Neuer Instanzname",
      description:
        "Der neue Instanzname der Gegenseite — aktualisiert unsere Bezeichnung dafür",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Bitte überprüfe deine Angaben und versuche es erneut",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description:
          "Du musst angemeldet sein, um die Verbindung zu aktualisieren",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description:
          "Du hast keine Berechtigung, diese Verbindung zu aktualisieren",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Rückverbindung für diese Instanz gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler beim Aktualisieren der Verbindung",
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
        description:
          "Beim Aktualisieren der Verbindung ist ein Konflikt aufgetreten",
      },
    },
    success: {
      title: "Verbindung aktualisiert",
      description: "Die Rückverbindungseinstellungen wurden aktualisiert",
    },
  },
};
