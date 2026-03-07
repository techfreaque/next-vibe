import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Fernverbindung",
  },
  widget: {
    title: "Fernverbindung",
    signInDescription:
      "Melde dich an, um deine Fernverbindung zu konfigurieren",
    connected: {
      title: "Mit Cloud-Konto verbunden",
      badge: "Aktiv",
      description:
        "Deine Erinnerungen und KI-Tools synchronisieren sich automatisch mit deinem Cloud-Konto.",
      connectedTo: "Verbunden mit",
      lastSynced: "Zuletzt synchronisiert",
      refresh: "Aktualisieren",
      disconnect: "Trennen",
    },
    notConnected: {
      title: "Cloud-Konto verbinden",
      description:
        "Verbinde dich mit deinem Cloud-Konto (z.B. unbottled.ai), um deine Erinnerungen zu synchronisieren und KI-Tools von überall zu nutzen.",
      benefit1:
        "Deine Erinnerungen synchronisieren sich automatisch zwischen diesem Gerät und deinem Cloud-Konto",
      benefit2: "KI-Tools von der Kommandozeile nutzen mit",
      benefit2Code: "vibe --remote",
      benefit3: "Dein Cloud-Konto und deine lokale Instanz bleiben synchron",
    },
  },
  get: {
    title: "Fernverbindungsstatus",
    description: "Status einer bestimmten Fernverbindung abrufen",
    instanceId: {
      label: "Instanz-ID",
      description: "Die Verbindungsinstanz, die angezeigt werden soll",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Du musst angemeldet sein, um deine Verbindung zu sehen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Du hast keine Berechtigung, dies zu sehen",
      },
      notFound: {
        title: "Nicht verbunden",
        description: "Keine Fernverbindung für diese Instanz gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler beim Abrufen deiner Verbindung",
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
      title: "Verbindung abgerufen",
      description: "Fernverbindungsstatus erfolgreich abgerufen",
    },
  },
  patch: {
    title: "Verbindung umbenennen",
    description: "Anzeigenamen der Fernverbindung aktualisieren",
    instanceId: {
      label: "Instanz-ID",
      description: "Die umzubenennende Instanz",
      placeholder: "hermes",
    },
    friendlyName: {
      label: "Anzeigename",
      description: "Ein lesbarer Name für diese Verbindung",
      placeholder: "Mein Laptop",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Du musst angemeldet sein, um umzubenennen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Du hast keine Berechtigung zum Umbenennen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Verbindung nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler beim Umbenennen",
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
      title: "Umbenannt",
      description: "Verbindung erfolgreich umbenannt",
    },
  },
  delete: {
    title: "Trennen",
    description: "Von deiner Remote-Instanz trennen",
    instanceId: {
      label: "Instanz-ID",
      description: "Die zu trennende Instanz",
      placeholder: "hermes",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Du musst angemeldet sein, um zu trennen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Du hast keine Berechtigung zum Trennen",
      },
      notFound: {
        title: "Nicht verbunden",
        description: "Keine Fernverbindung zum Trennen",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler beim Trennen",
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
      title: "Getrennt",
      description: "Deine Fernverbindung wurde entfernt",
    },
  },
};
