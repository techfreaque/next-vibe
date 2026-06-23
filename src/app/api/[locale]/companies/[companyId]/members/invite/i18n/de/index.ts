import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
  tags: {
    companies: "Unternehmen",
    members: "Mitglieder",
    invite: "Einladen",
  },
  post: {
    title: "Mitglied einladen",
    titleShort: "Mitglied einladen",
    description: "Einen registrierten Benutzer per E-Mail einladen",
    companyId: {
      label: "Unternehmens-ID",
      description: "Das Unternehmen, in das eingeladen wird",
    },
    email: {
      label: "Benutzer-E-Mail",
      description: "E-Mail des einzuladenden registrierten Benutzers",
      placeholder: "kollege@unternehmen.de",
    },
    role: {
      label: "Rolle",
      description: "Die dem neuen Mitglied zugewiesene Rolle",
      placeholder: "Rolle auswählen",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "E-Mail prüfen und erneut versuchen",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Anmelden um Mitglieder einzuladen",
      },
      forbidden: {
        title: "Keine Berechtigung",
        description: "Administrator- oder Inhaberrolle erforderlich",
      },
      conflict: {
        title: "Bereits Mitglied",
        description: "Dieser Benutzer ist bereits Mitglied des Unternehmens",
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
        title: "Benutzer nicht gefunden",
        description: "Kein registrierter Benutzer mit dieser E-Mail gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Mitglied eingeladen",
      description: "Der Benutzer wurde dem Unternehmen hinzugefügt",
    },
    response: {
      memberId: "Mitglieds-ID",
      userId: "Benutzer-ID",
      role: "Rolle",
    },
    widget: {
      back: "Zurück zu Mitgliedern",
      invited: "Mitglied eingeladen",
    },
  },
};
