import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    companies: "Unternehmen",
    members: "Mitglieder",
    list: "Liste",
  },
  get: {
    title: "Teammitglieder",
    description: "Alle Mitglieder dieses Unternehmens auflisten",
    companyId: {
      label: "Unternehmens-ID",
      description: "Das Unternehmen, dessen Mitglieder angezeigt werden",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Unternehmens-ID",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Anmelden um Unternehmensmitglieder anzuzeigen",
      },
      forbidden: {
        title: "Keine Berechtigung",
        description: "Sie sind kein Mitglied dieses Unternehmens",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt",
      },
      server: {
        title: "Serverfehler",
        description: "Etwas ist schiefgelaufen — bitte erneut versuchen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung prüfen und erneut versuchen",
      },
      notFound: {
        title: "Unternehmen nicht gefunden",
        description: "Dieses Unternehmen existiert nicht",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Mitglieder geladen",
      description: "Mitgliederliste abgerufen",
    },
    response: {
      id: "Mitglieds-ID",
      userId: "Benutzer-ID",
      email: "E-Mail",
      name: "Name",
      role: "Rolle",
      isActive: "Aktiv",
      joinedAt: "Beigetreten",
    },
    widget: {
      back: "Zurück",
      loading: "Mitglieder werden geladen...",
      title: "Teammitglieder",
      memberSingular: "Mitglied",
      memberPlural: "Mitglieder",
      invite: "Mitglied einladen",
      updateRole: "Rolle ändern",
      remove: "Entfernen",
      active: "Aktiv",
      inactive: "Inaktiv",
      empty: {
        title: "Noch keine Teammitglieder",
        hint: "Laden Sie Kollegen ein, um gemeinsam an Buchhaltung und Betrieb zu arbeiten.",
        cta: "Erstes Mitglied einladen",
      },
    },
  },
};
