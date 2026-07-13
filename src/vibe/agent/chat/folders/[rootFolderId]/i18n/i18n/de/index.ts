/**
 * German translations for folders endpoints
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Ordner",
  },
  config: {
    folders: {
      private: "Private Chats",
      shared: "Geteilte Chats",
      public: "Öffentliche Chats",
      incognito: "Inkognito Chats",
      background: "Hintergrund-Threads",
      support: "Support",
    },
  },
  id: {
    category: "Chat",
    tags: {
      folders: "Ordner",
    },
    widget: {
      config: {
        foldersShort: {
          private: "Privat",
          shared: "Geteilt",
          public: "Öffentlich",
          incognito: "Inkognito",
          cron: "Hintergrund",
          support: "Support",
          remote: "Remote",
        },
      },
      folderList: {
        newChatInFolder: "Neuer Chat im Ordner",
        moveUp: "Nach oben",
        moveDown: "Nach unten",
        newSubfolder: "Neuer Unterordner",
        managePermissions: "Berechtigungen verwalten",
        renameFolder: "Ordner umbenennen",
        moveToFolder: "In Ordner verschieben",
        deleteFolder: "Ordner löschen",
        deleteDialog: {
          title: "Ordner löschen",
          description: 'Möchten Sie "{{folderName}}" wirklich löschen?',
        },
        pinned: "Angeheftet",
        pin: "Anheften",
        unpin: "Loslösen",
        today: "Heute",
        lastWeek: "Letzte 7 Tage",
        lastMonth: "Letzte 30 Tage",
        older: "Älter",
        showMore: "Mehr anzeigen",
      },
      renameFolder: {
        title: "Ordner umbenennen",
      },
      moveFolder: {
        title: "Ordner verschieben",
      },
      newFolder: {
        title: "Neuen Ordner erstellen",
      },
      permissions: {
        folderTitle: "Ordnerberechtigungen",
      },
      accessModal: {
        title: "Konto erforderlich",
        privateTitle: "Private Threads",
        sharedTitle: "Geteilte Threads",
        publicTitle: "Öffentliches Forum",
        incognitoTitle: "Inkognito-Modus",
        privateExplanation:
          "Private Threads sind Ihr persönlicher Bereich für Gespräche mit KI. Alle Ihre Chats werden sicher auf unseren Servern gespeichert und automatisch auf allen Ihren Geräten synchronisiert.",
        sharedExplanation:
          "Geteilte Threads ermöglichen es Ihnen, Gespräche zu erstellen und sie mit anderen über sichere Links zu teilen. Perfekt für die Zusammenarbeit und das Teilen von Erkenntnissen mit Ihrem Team oder Freunden.",
        publicExplanation:
          "Das öffentliche Forum ist ein durch den ersten Verfassungszusatz geschützter Raum, in dem Menschen und KI in offenen Dialog treten. Teilen Sie Ideen, hinterfragen Sie Perspektiven und nehmen Sie an unzensierten Diskussionen teil.",
        incognitoExplanation:
          "Der Inkognito-Modus hält Ihre Gespräche völlig privat und lokal. Ihre Chats werden nur in Ihrem Browser gespeichert und niemals an unsere Server gesendet - nicht einmal mit Ihrem Konto verknüpft.",
        requiresAccount:
          "Um auf {{folderName}} zuzugreifen, müssen Sie ein Konto erstellen oder sich anmelden.",
        loginButton: "Anmelden",
        signupButton: "Registrieren",
        close: "Schließen",
      },
      actions: {
        rename: "Umbenennen",
        moveToFolder: "In Ordner verschieben",
        pin: "Anheften",
        unpin: "Loslösen",
      },
      threadList: {
        deleteDialog: {
          title: "Thread löschen",
          description: 'Möchten Sie "{{title}}" wirklich löschen?',
        },
      },
      sharedThread: {
        noLinks: "Noch nicht geteilt - tippen zum Teilen",
        linkCount: "{{count}} aktive(r) Link(s)",
        shareAction: "Teilen",
        moveToShared: "In Geteilt verschieben",
      },
      common: {
        cancel: "Abbrechen",
        delete: "Löschen",
        noChatsFound: "Keine Threads gefunden",
        noResults: "Keine passenden Threads",
        searchPlaceholder: "Suchen...",
        privateChats: "Private Threads",
        sharedChats: "Geteilte Threads",
        publicChats: "Öffentliche Threads",
        incognitoChats: "Inkognito-Threads",
        newChat: "Neuer Thread",
        newPrivateChat: "Privater Thread",
        newSharedChat: "Geteilter Thread",
        newPublicChat: "Öffentlicher Thread",
        newIncognitoChat: "Inkognito Thread",
        newPrivateFolder: "Neuer Privater Ordner",
        newSharedFolder: "Neuer Geteilter Ordner",
        newPublicFolder: "Neuer Öffentlicher Ordner",
        newIncognitoFolder: "Neuer Inkognito Ordner",
        newFolder: "Neuer Ordner",
      },
    },
    config: {
      folders: {
        private: "Privat",
        shared: "Geteilt",
        public: "Öffentlich",
        background: "Hintergrund",
        incognito: "Inkognito",
        support: "Support",
        remote: "Remote",
      },
    },
    errors: {
      not_implemented_on_native:
        "{{method}} ist auf der nativen Plattform nicht implementiert. Bitte verwenden Sie die Webversion für diesen Vorgang.",
    },
    get: {
      title: "Ordner abrufen",
      description: "Alle Ordner für den aktuellen Stammordner abrufen",
      rootFolderId: {
        label: "Stammordner",
        description:
          "Der abzurufende Stammordner (privat, geteilt, öffentlich, hintergrund, inkognito)",
      },
      container: {
        title: "Ordnerdetails",
        description: "Ordnerinformationen anzeigen",
      },
      id: {
        label: "Ordner-ID",
        description: "Die eindeutige Kennung des Ordners",
      },
      response: {
        title: "Ordner",
        description: "Die Ordnerliste mit Berechtigungen",
        rootFolderPermissions: {
          title: "Stammordner-Berechtigungen",
          description: "Berechtigungen für den Stammordner",
          canCreateThread: {
            content: "Kann Thread erstellen",
          },
          canCreateFolder: {
            content: "Kann Ordner erstellen",
          },
        },
        folders: {
          folder: {
            id: { content: "ID" },
            userId: { content: "Benutzer-ID" },
            name: { content: "Name" },
            icon: { content: "Symbol" },
            color: { content: "Farbe" },
            parentId: { content: "Übergeordneter Ordner" },
            expanded: { content: "Erweitert" },
            sortOrder: { content: "Sortierreihenfolge" },
            rootFolderId: {
              content: "Stammordner",
            },
            canManage: {
              content: "Kann verwalten",
            },
            canCreateThread: {
              content: "Kann Thread erstellen",
            },
            canModerate: {
              content: "Kann moderieren",
            },
            canDelete: {
              content: "Kann löschen",
            },
            canManagePermissions: {
              content: "Kann Berechtigungen verwalten",
            },
            createdAt: {
              content: "Erstellt am",
            },
            updatedAt: {
              content: "Aktualisiert am",
            },
          },
        },
        folder: {
          title: "Ordner",
          id: {
            content: "ID",
          },
          userId: {
            content: "Benutzer-ID",
          },
          name: {
            content: "Name",
          },
          icon: {
            content: "Symbol",
          },
          color: {
            content: "Farbe",
          },
          parentId: {
            content: "Übergeordneter Ordner",
          },
          expanded: {
            content: "Erweitert",
          },
          sortOrder: {
            content: "Sortierreihenfolge",
          },
          metadata: {
            content: "Metadaten",
          },
          createdAt: {
            content: "Erstellt am",
          },
          updatedAt: {
            content: "Aktualisiert am",
          },
        },
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Die angegebene Ordner-ID ist ungültig",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Sie müssen angemeldet sein, um Ordner anzuzeigen",
        },
        forbidden: {
          title: "Verboten",
          description: "Sie haben keine Berechtigung, diesen Ordner anzuzeigen",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Der angeforderte Ordner wurde nicht gefunden",
        },
        server: {
          title: "Serverfehler",
          description: "Beim Abrufen des Ordners ist ein Fehler aufgetreten",
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
          description:
            "Bei der Verarbeitung Ihrer Anfrage ist ein Konflikt aufgetreten",
        },
      },
      success: {
        title: "Erfolg",
        description: "Ordner erfolgreich abgerufen",
      },
    },
    patch: {
      title: "Ordner aktualisieren",
      description: "Einen vorhandenen Ordner aktualisieren",
      container: {
        title: "Ordner aktualisieren",
        description: "Ordnereigenschaften ändern",
      },
      id: {
        label: "Ordner-ID",
        description: "Die eindeutige Kennung des zu aktualisierenden Ordners",
      },
      sections: {
        updates: {
          title: "Ordneraktualisierungen",
          description: "Zu aktualisierende Felder",
        },
      },
      name: {
        label: "Name",
        description: "Der Ordnername",
      },
      icon: {
        label: "Symbol",
        description: "Lucide- oder Simple Icons-Symbolname",
      },
      color: {
        label: "Farbe",
        description: "Hex-Farbcode zur visuellen Unterscheidung",
      },
      parentId: {
        label: "Übergeordneter Ordner",
        description:
          "Ordner zu einem anderen übergeordneten Ordner verschieben (null für Wurzel)",
      },
      expanded: {
        label: "Erweitert",
        description: "Ob der Ordner in der Benutzeroberfläche erweitert ist",
      },
      sortOrder: {
        label: "Sortierreihenfolge",
        description: "Reihenfolge zum Sortieren von Ordnern",
      },
      metadata: {
        label: "Metadaten",
        description: "Zusätzliche Ordnermetadaten",
      },
      rolesView: {
        label: "Ansichtsrollen",
        description: "Rollen, die diesen Ordner ansehen können",
      },
      rolesManage: {
        label: "Verwaltungsrollen",
        description: "Rollen, die Ordnereinstellungen verwalten können",
      },
      rolesCreateThread: {
        label: "Thread-Erstellungsrollen",
        description: "Rollen, die Threads in diesem Ordner erstellen können",
      },
      rolesPost: {
        label: "Beitragsrollen",
        description: "Rollen, die Nachrichten posten können",
      },
      rolesModerate: {
        label: "Moderationsrollen",
        description: "Rollen, die Inhalte moderieren können",
      },
      rolesAdmin: {
        label: "Admin-Rollen",
        description: "Rollen mit vollem Administratorzugriff",
      },
      response: {
        title: "Aktualisierter Ordner",
        description: "Die aktualisierten Ordnerdetails",
        folder: {
          title: "Ordner",
          id: {
            content: "ID",
          },
          userId: {
            content: "Benutzer-ID",
          },
          name: {
            content: "Name",
          },
          icon: {
            content: "Symbol",
          },
          color: {
            content: "Farbe",
          },
          parentId: {
            content: "Übergeordneter Ordner",
          },
          expanded: {
            content: "Erweitert",
          },
          sortOrder: {
            content: "Sortierreihenfolge",
          },
          metadata: {
            content: "Metadaten",
          },
          createdAt: {
            content: "Erstellt am",
          },
          updatedAt: {
            content: "Aktualisiert am",
          },
        },
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Die angegebenen Daten sind ungültig",
          circularReference:
            "Ordner kann nicht als eigener übergeordneter Ordner festgelegt werden",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Sie müssen angemeldet sein, um Ordner zu aktualisieren",
        },
        forbidden: {
          title: "Verboten",
          description:
            "Sie haben keine Berechtigung, diesen Ordner zu aktualisieren",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Der angeforderte Ordner wurde nicht gefunden",
        },
        server: {
          title: "Serverfehler",
          description:
            "Beim Aktualisieren des Ordners ist ein Fehler aufgetreten",
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
        description: "Ordner erfolgreich aktualisiert",
      },
    },
    delete: {
      title: "Ordner löschen",
      description: "Einen Ordner und alle seine Inhalte löschen",
      container: {
        title: "Ordner löschen",
        description: "Ordner dauerhaft entfernen",
      },
      id: {
        label: "Ordner-ID",
        description: "Die eindeutige Kennung des zu löschenden Ordners",
      },
      response: {
        title: "Löschergebnis",
        description: "Bestätigung der Ordnerlöschung",
        success: {
          content: "Erfolg",
        },
        deletedFolderId: {
          content: "Gelöschte Ordner-ID",
        },
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Die angegebene Ordner-ID ist ungültig",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Sie müssen angemeldet sein, um Ordner zu löschen",
        },
        forbidden: {
          title: "Verboten",
          description: "Sie haben keine Berechtigung, diesen Ordner zu löschen",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Der angeforderte Ordner wurde nicht gefunden",
        },
        server: {
          title: "Serverfehler",
          description: "Beim Löschen des Ordners ist ein Fehler aufgetreten",
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
          description: "Ordner mit aktiven Inhalten kann nicht gelöscht werden",
        },
      },
      success: {
        title: "Erfolg",
        description: "Ordner erfolgreich gelöscht",
      },
    },
    post: {
      errors: {
        forbidden: {
          title: "Verboten",
          incognitoNotAllowed:
            "Ordner werden im Inkognito-Modus nicht unterstützt",
        },
        unauthorized: {
          title: "Nicht autorisiert",
        },
        server: {
          title: "Serverfehler",
        },
      },
    },
  },
  rootPermissions: {
    category: "Chat",
    tags: {
      folders: "Ordner",
    },

    get: {
      title: "Root-Ordner-Berechtigungen abrufen",
      description: "Berechtigungen für einen Root-Ordner berechnen",
      container: {
        title: "Root-Ordner-Berechtigungen",
        description: "Berechtigungen für Root-Ordner anzeigen",
      },
      rootFolderId: {
        label: "Root-Ordner-ID",
        description:
          "Die ID des Root-Ordners, für den Berechtigungen geprüft werden sollen",
        placeholder: "private, shared, public oder incognito",
      },
      response: {
        canCreateThread: {
          content: "Kann Thread erstellen",
        },
        canCreateFolder: {
          content: "Kann Ordner erstellen",
        },
      },
      success: {
        title: "Erfolg",
        description: "Root-Ordner-Berechtigungen erfolgreich abgerufen",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Root-Ordner-ID angegeben",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung zum Server fehlgeschlagen",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description:
            "Sie müssen angemeldet sein, um Berechtigungen zu prüfen",
        },
        forbidden: {
          title: "Verboten",
          description: "Sie haben keine Berechtigung für diese Ressource",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Root-Ordner nicht gefunden",
        },
        server: {
          title: "Serverfehler",
          description: "Ein interner Serverfehler ist aufgetreten",
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
          description: "Ein Konflikt ist aufgetreten",
        },
      },
    },
  },
  get: {
    title: "Ordner auflisten",
    description: "Alle Ordner für den aktuellen Benutzer abrufen",
    rootFolderId: {
      label: "Stammordner",
      description:
        "Nach Stammordner filtern (privat, geteilt, öffentlich, inkognito)",
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
        description:
          "Sie haben keine Berechtigung, auf diese Ordner zuzugreifen",
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
        description:
          "Bei der Verarbeitung Ihrer Anfrage ist ein Konflikt aufgetreten",
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
        incognitoNotAllowed:
          "Inkognito-Ordner können nicht auf dem Server erstellt werden",
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
