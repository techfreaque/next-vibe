import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Ordnerberechtigungen abrufen",
    description: "Die Liste der Moderatoren für einen bestimmten Ordner abrufen",
    container: {
      title: "Ordnerberechtigungen",
      description: "Ordnerzugriffsberechtigungen anzeigen und verwalten",
    },
    id: {
      label: "Ordner-ID",
      description: "Die eindeutige Kennung des Ordners",
    },
    response: {
      title: "Ordnerberechtigungen",
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
      moderatorIds: {
        title: "Moderator-IDs",
        description: "Liste der Benutzer-IDs, die diesen Ordner moderieren können",
        content: "Benutzer-ID",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die bereitgestellten Daten sind ungültig",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Beim Abrufen der Ordnerberechtigungen ist ein Netzwerkfehler aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Ordnerberechtigungen anzuzeigen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, die Berechtigungen dieses Ordners anzuzeigen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Der angeforderte Ordner wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Abrufen der Ordnerberechtigungen ist ein Fehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsaved: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Es gab einen Konflikt mit dem aktuellen Zustand",
      },
    },
    success: {
      title: "Erfolg",
      description: "Ordnerberechtigungen erfolgreich abgerufen",
    },
  },
  patch: {
    title: "Ordnerberechtigungen aktualisieren",
    description: "Die Liste der Moderatoren für einen bestimmten Ordner aktualisieren",
    container: {
      title: "Ordnerberechtigungen aktualisieren",
      description: "Ordnerzugriffsberechtigungen ändern",
    },
    id: {
      label: "Ordner-ID",
      description: "Die eindeutige Kennung des zu aktualisierenden Ordners",
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
    permissions: {
      title: "Berechtigungsaktualisierung",
      moderatorIds: {
        label: "Moderator-IDs",
        description: "Liste der Benutzer-IDs, die diesen Ordner moderieren können",
      },
    },
    response: {
      title: "Aktualisierte Berechtigungen",
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
      message: {
        content: "Ordnerberechtigungen erfolgreich aktualisiert",
      },
      moderatorIds: {
        title: "Aktuelle Moderatoren",
        description: "Aktualisierte Liste der Moderatoren für diesen Ordner",
        content: "Benutzer-ID",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die bereitgestellten Moderator-IDs sind ungültig",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Beim Aktualisieren der Ordnerberechtigungen ist ein Netzwerkfehler aufgetreten",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Ordnerberechtigungen zu aktualisieren",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, die Berechtigungen dieses Ordners zu aktualisieren",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Der angeforderte Ordner wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Aktualisieren der Ordnerberechtigungen ist ein Fehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsaved: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Es gab einen Konflikt mit dem aktuellen Zustand",
      },
    },
    success: {
      title: "Erfolg",
      description: "Ordnerberechtigungen erfolgreich aktualisiert",
    },
  },
};
