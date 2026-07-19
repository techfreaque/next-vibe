import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  errors: {
    noRowReturned: "Kein Datensatz zurückgegeben",
    notYourConnection: "Diese Verbindung gehört dir nicht",
    mountNotFound: "Einhängepunkt nicht gefunden",
  },

  list: {
    title: "Eingehängte Verzeichnisse",
    titleShort: "Einhängepunkte",
    description:
      "Benannte Verzeichnis-Abkürzungen für diese Verbindung. Jeder Einhängepunkt erscheint als /ssh/<verbindung>/<name>/ im Cortex. Terminals starten im Standard-Verzeichnis.",
    fields: {
      connectionId: {
        label: "Verbindung",
        description: "Die SSH-Verbindung, zu der diese Einhängepunkte gehören",
      },
    },
    response: {
      mounts: { title: "Einhängepunkte" },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Eingabe prüfen und erneut versuchen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Anmeldung erforderlich",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Keine Berechtigung",
      },
      server: {
        title: "Serverfehler",
        description: "Einhängepunkte konnten nicht geladen werden",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Verbindung nicht gefunden",
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
        description: "Ein Einhängepunkt mit diesem Namen existiert bereits",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Server nicht erreichbar",
      },
    },
    success: {
      title: "Einhängepunkte geladen",
      description: "Verzeichnis-Einhängepunkte für diese Verbindung",
    },
  },

  create: {
    title: "Einhängepunkt hinzufügen",
    titleShort: "Hinzufügen",
    description:
      "Benannte Verzeichnis-Abkürzung hinzufügen. Der Name wird zum Pfadsegment: /ssh/<verbindung>/<name>/",
    fields: {
      connectionId: {
        label: "Verbindungs-ID",
        description:
          "Die SSH-Verbindung, zu der der Einhängepunkt hinzugefügt wird",
      },
      path: {
        label: "Verzeichnispfad",
        description:
          "Absoluter Pfad auf dem Rechner, z.B. /home/max/projekt. Cortex-Segment = Basename. Startverzeichnis des Terminals bei Standard-Einhängepunkt.",
        placeholder: "/home/benutzer/projekt",
      },
      isDefault: {
        label: "Standard-Einhängepunkt",
        description:
          "Neue Terminal-Sitzungen starten in diesem Verzeichnis. Nur ein Einhängepunkt pro Verbindung kann Standard sein.",
      },
    },
    response: {
      id: { title: "Einhängepunkt-ID" },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Felder prüfen und erneut versuchen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Anmeldung erforderlich",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Keine Berechtigung",
      },
      server: {
        title: "Serverfehler",
        description: "Einhängepunkt konnte nicht gespeichert werden",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Verbindung nicht gefunden",
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
        title: "Name vergeben",
        description: "Ein Einhängepunkt mit diesem Namen existiert bereits",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Server nicht erreichbar",
      },
    },
    success: {
      title: "Einhängepunkt hinzugefügt",
      description: "Verzeichnis-Einhängepunkt erfolgreich hinzugefügt",
    },
  },

  detail: {
    titleGet: "Einhängepunkt",
    titleShortGet: "Einhängepunkt",
    descriptionGet: "Details eines Verzeichnis-Einhängepunkts.",
    titlePatch: "Einhängepunkt bearbeiten",
    titleShortPatch: "Bearbeiten",
    descriptionPatch: "Verzeichnis-Einhängepunkt umbenennen oder verschieben.",
    titleDelete: "Einhängepunkt entfernen",
    titleShortDelete: "Entfernen",
    descriptionDelete:
      "Verzeichnis-Einhängepunkt von dieser Verbindung entfernen.",
    fields: {
      mountId: {
        label: "Einhängepunkt-ID",
        description: "Eindeutiger Bezeichner dieses Einhängepunkts",
      },
      path: {
        label: "Verzeichnispfad",
        description: "Absoluter Pfad auf dem Rechner",
        placeholder: "/home/benutzer/projekt",
      },
      isDefault: {
        label: "Standard-Einhängepunkt",
        description: "Neue Terminal-Sitzungen starten in diesem Verzeichnis",
      },
    },
    response: {
      id: { title: "ID" },
      name: { title: "Name" },
      path: { title: "Pfad" },
      isDefault: { title: "Standard" },
      createdAt: { title: "Erstellt" },
      updatedAt: { title: "Geändert" },
      deleted: { title: "Gelöscht" },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Eingabe prüfen und erneut versuchen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Anmeldung erforderlich",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Keine Berechtigung",
      },
      server: {
        title: "Serverfehler",
        description: "Einhängepunkt konnte nicht aktualisiert werden",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Einhängepunkt nicht gefunden",
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
        title: "Name vergeben",
        description: "Ein Einhängepunkt mit diesem Namen existiert bereits",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Server nicht erreichbar",
      },
    },
    successGet: {
      title: "Einhängepunkt geladen",
      description: "Details des Einhängepunkts",
    },
    successPatch: {
      title: "Einhängepunkt aktualisiert",
      description: "Erfolgreich aktualisiert",
    },
    successDelete: {
      title: "Einhängepunkt entfernt",
      description: "Erfolgreich entfernt",
    },
    widget: {
      confirmDelete: "Diesen Einhängepunkt entfernen?",
    },
  },

  widget: {
    noMounts: "Keine Einhängepunkte konfiguriert",
    noMountsHint:
      "Füge einen Einhängepunkt hinzu, um eine Verzeichnis-Abkürzung zu erstellen. Terminals starten im Standard-Einhängepunkt.",
    addMount: "Einhängepunkt hinzufügen",
    defaultBadge: "Standard",
    cortexPath: "Cortex-Pfad",
    cortexPathPrefix: "/ssh/…/",
    pathArrow: "→",
  },
};
