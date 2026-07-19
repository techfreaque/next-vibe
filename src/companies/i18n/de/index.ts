import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Unternehmen",
  tags: {
    companies: "Unternehmen",
    create: "Erstellen",
    list: "Liste",
    get: "Abrufen",
    update: "Bearbeiten",
    members: "Mitglieder",
    invite: "Einladen",
    management: "Verwaltung",
  },
  endpointCategories: {
    companies: "Unternehmen",
    companyManagement: "Unternehmensverwaltung",
    companyMembers: "Unternehmensmitglieder",
  },
  enums: {
    companyType: {
      b2b: "B2B",
      b2c: "B2C",
      individual: "Einzelperson",
    },
    companyMemberRole: {
      owner: "Inhaber",
      admin: "Administrator",
      member: "Mitglied",
      accountant: "Buchhalter",
      viewer: "Betrachter",
    },
  },

  auth: {
    errors: {
      forbidden: {
        title: "Zugriff verweigert",
        description: "Sie haben keine Berechtigung für diese Aktion",
      },
      notFound: {
        title: "Unternehmen nicht gefunden",
        description: "Dieses Unternehmen existiert nicht",
      },
      server: {
        title: "Serverfehler",
        description: "Etwas ist schiefgelaufen — bitte erneut versuchen",
      },
      patchNotFound: {
        title: "Unternehmen nicht gefunden",
        description: "Zu aktualisierendes Unternehmen nicht gefunden",
      },
      patchServer: {
        title: "Serverfehler",
        description: "Unternehmen konnte nicht aktualisiert werden",
      },
    },
  },

  updateRole: {
    patch: {
      title: "Rolle ändern",
      titleShort: "Rolle ändern",
      description: "Mitgliederrolle ändern. Nur für Inhaber.",
      companyId: { label: "Unternehmens-ID", description: "Unternehmen" },
      memberId: {
        label: "Mitglieds-ID",
        description: "Das zu aktualisierende Mitglied",
      },
      role: {
        label: "Neue Rolle",
        description: "Dem Mitglied zuzuweisende Rolle",
        placeholder: "Rolle auswählen",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Eingabe",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Melden Sie sich an, um Rollen zu ändern",
        },
        forbidden: {
          title: "Nur Inhaber",
          description: "Nur der Inhaber kann Mitgliederrollen ändern",
        },
        conflict: { title: "Konflikt", description: "Datenkonflikt" },
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
          title: "Mitglied nicht gefunden",
          description: "Dieses Mitglied existiert nicht im Unternehmen",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Rolle aktualisiert",
        description: "Mitgliederrolle erfolgreich geändert",
      },
      response: {
        memberId: "Mitglieds-ID",
        role: "Neue Rolle",
      },
      widget: {
        back: "Zurück zu Mitgliedern",
        successLabel: "Rolle aktualisiert",
        title: "Mitgliederrolle ändern",
      },
    },
  },

  removeMember: {
    post: {
      title: "Mitglied entfernen",
      titleShort: "Mitglied entfernen",
      description:
        "Mitglied aus dem Unternehmen entfernen. Der letzte Inhaber kann nicht entfernt werden.",
      companyId: { label: "Unternehmens-ID", description: "Unternehmen" },
      memberId: {
        label: "Mitglieds-ID",
        description: "Das zu entfernende Mitglied",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Eingabe",
        },
        unauthorized: {
          title: "Nicht angemeldet",
          description: "Melden Sie sich an, um Mitglieder zu entfernen",
        },
        forbidden: {
          title: "Zugriff verweigert",
          description:
            "Inhaber- oder Administratorrolle erforderlich. Der letzte Inhaber kann nicht entfernt werden.",
        },
        conflict: {
          title: "Letzter Inhaber",
          description:
            "Der letzte Inhaber des Unternehmens kann nicht entfernt werden",
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
          title: "Mitglied nicht gefunden",
          description: "Dieses Mitglied existiert nicht im Unternehmen",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
      },
      success: {
        title: "Mitglied entfernt",
        description: "Mitglied wurde aus dem Unternehmen entfernt",
      },
      response: {
        removedMemberId: "Entfernte Mitglieds-ID",
      },
      widget: {
        back: "Zurück zu Mitgliedern",
        successLabel: "Mitglied entfernt",
        confirmTitle: "Dieses Mitglied entfernen?",
        confirmDescription:
          "Der Zugriff auf dieses Unternehmen wird sofort entzogen. Dies kann nicht rückgängig gemacht werden.",
        confirmButton: "Ja, Mitglied entfernen",
        cancelButton: "Abbrechen",
      },
    },
  },
};
