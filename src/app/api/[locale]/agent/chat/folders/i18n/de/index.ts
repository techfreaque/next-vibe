/**
 * German translations for folders endpoints
 */

import { translations as idTranslations } from "../../[id]/i18n/de";
import { translations as rootPermissionsTranslations } from "../../root-permissions/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: idTranslations,
  rootPermissions: rootPermissionsTranslations,
  get: {
    title: "Ordner auflisten",
    description: "Alle Ordner für den aktuellen Benutzer abrufen",
    rootFolderId: {
      label: "Stammordner",
      description: "Nach Stammordner filtern (privat, geteilt, öffentlich, inkognito)",
    },
    container: {
      title: "Ordnerliste",
      description: "Hierarchische Ordnerstruktur",
    },
    response: {
      title: "Ordner-Antwort",
      description: "Liste aller Ordner",
      rootFolderPermissions: {
        title: "Stammordner-Berechtigungen",
        description: "Berechtigungen für den angeforderten Stammordner",
        canCreateThread: { content: "Kann Thread erstellen" },
        canCreateFolder: { content: "Kann Ordner erstellen" },
      },
      folders: {
        title: "Ordner",
        description: "Array von Ordnerobjekten",
        folder: {
          title: "Ordner",
          description: "Einzelne Ordnerdetails",
          id: { content: "Ordner-ID" },
          userId: { content: "Benutzer-ID" },
          rootFolderId: { content: "Stammordner" },
          name: { content: "Ordnername" },
          icon: { content: "Symbol" },
          color: { content: "Farbe" },
          parentId: { content: "Übergeordnete Ordner-ID" },
          expanded: { content: "Erweitert-Status" },
          sortOrder: { content: "Sortierreihenfolge" },
          metadata: { content: "Metadaten" },
          createdAt: { content: "Erstellt am" },
          updatedAt: { content: "Aktualisiert am" },
          canManage: { content: "Kann verwalten" },
          canCreateThread: { content: "Kann Thread erstellen" },
          canModerate: { content: "Kann moderieren" },
          canDelete: { content: "Kann löschen" },
          canManagePermissions: { content: "Kann Berechtigungen verwalten" },
        },
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die Anfragedaten sind ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um auf Ordner zuzugreifen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, auf diese Ordner zuzugreifen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Der angeforderte Ordner wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Abrufen der Ordner ist ein Fehler aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Bei der Verarbeitung Ihrer Anfrage ist ein Konflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Ordner erfolgreich abgerufen",
    },
  },
  post: {
    title: "Ordner erstellen",
    description: "Einen neuen Ordner erstellen",
    container: {
      title: "Ordner erstellen",
      description: "Einen neuen Ordner zum Organisieren von Threads erstellen",
    },
    sections: {
      folder: {
        title: "Ordnerdetails",
        description: "Grundlegende Ordnerinformationen",
        rootFolderId: {
          label: "Stammordner",
          description: "Stammordner (private, shared, public, incognito)",
        },
        name: {
          label: "Ordnername",
          description: "Name des Ordners",
        },
        icon: {
          label: "Symbol",
          description: "Symbol für den Ordner (lucide oder si Symbolname)",
        },
        color: {
          label: "Farbe",
          description: "Hex-Farbe zur visuellen Unterscheidung",
        },
        parentId: {
          label: "Übergeordneter Ordner",
          description: "Übergeordnete Ordner-ID für verschachtelte Ordner",
        },
      },
    },
    response: {
      title: "Erstellter Ordner",
      description: "Details des neu erstellten Ordners",
      folder: {
        title: "Ordner",
        description: "Erstelltes Ordnerobjekt",
        id: { content: "Ordner-ID" },
        userId: { content: "Benutzer-ID" },
        rootFolderId: { content: "Stammordner" },
        name: { content: "Ordnername" },
        icon: { content: "Symbol" },
        color: { content: "Farbe" },
        parentId: { content: "Übergeordnete Ordner-ID" },
        expanded: { content: "Erweitert-Status" },
        sortOrder: { content: "Sortierreihenfolge" },
        metadata: { content: "Metadaten" },
        createdAt: { content: "Erstellt am" },
        updatedAt: { content: "Aktualisiert am" },
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die Ordnerdaten sind ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Ordner zu erstellen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, Ordner zu erstellen",
        incognitoNotAllowed: "Inkognito-Ordner können nicht auf dem Server erstellt werden",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Erstellen des Ordners ist ein Fehler aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Ordner mit diesem Namen existiert bereits",
      },
    },
    success: {
      title: "Erfolg",
      description: "Ordner erfolgreich erstellt",
    },
  },
};
