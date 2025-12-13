import { translations as optionsTranslations } from "../../options/i18n/de";
import type { translations as enTranslations } from "../en";

import { translations as _componentsTranslations } from "../../_components/i18n/de";

export const translations: typeof enTranslations = {
  _components: _componentsTranslations,
  title: "Anmeldung",
  description: "Benutzeranmeldung Endpunkt",
  tag: "Authentifizierung",
  options: optionsTranslations,
  actions: {
    submit: "Anmelden",
    submitting: "Wird angemeldet...",
  },
  fields: {
    email: {
      label: "E-Mail",
      description: "Benutzer E-Mail-Adresse",
      placeholder: "E-Mail eingeben",
      help: "Geben Sie die E-Mail-Adresse ein, die mit Ihrem Konto verknüpft ist",
      validation: {
        required: "E-Mail ist erforderlich",
        invalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
      },
    },
    password: {
      label: "Passwort",
      description: "Benutzerpasswort",
      placeholder: "Passwort eingeben",
      help: "Geben Sie Ihr Kontopasswort ein",
      validation: {
        required: "Passwort ist erforderlich",
        minLength: "Passwort muss mindestens 8 Zeichen lang sein",
      },
    },
    rememberMe: {
      label: "Angemeldet bleiben",
      description: "Mich angemeldet lassen",
      placeholder: "Angemeldet bleiben",
      help: "Auf diesem Gerät angemeldet bleiben für einfacheren Zugang",
    },
    leadId: {
      label: "Lead-ID",
      description: "Optionale Lead-Kennung",
      placeholder: "Lead-ID eingeben",
      help: "Optionale Lead-Kennung für Tracking",
    },
  },
  groups: {
    credentials: {
      title: "Anmeldedaten",
      description: "Geben Sie Ihre Anmeldeinformationen ein",
    },
    options: {
      title: "Anmeldeoptionen",
      description: "Zusätzliche Anmeldeeinstellungen und Optionen",
    },
    preferences: {
      title: "Anmeldeeinstellungen",
      description: "Zusätzliche Anmeldeoptionen",
    },
    advanced: {
      title: "Erweiterte Optionen",
      description: "Erweiterte Anmeldeeinstellungen",
    },
  },
  footer: {
    forgotPassword: "Passwort vergessen?",
    createAccount: "Noch kein Konto? Registrieren",
  },
  response: {
    title: "Anmeldungsantwort",
    description: "Anmeldungsantwortdaten",
    success: "Anmeldung erfolgreich",
    message: "Status-Nachricht",
    user: {
      title: "Benutzerdetails",
      description: "Informationen des angemeldeten Benutzers",
      id: "Benutzer-ID",
      email: "E-Mail-Adresse",
      firstName: "Vorname",
      lastName: "Nachname",
      privateName: "Privater Name",
      publicName: "Öffentlicher Name",
      imageUrl: "Profilbild",
    },
    sessionInfo: {
      title: "Sitzungsinformationen",
      description: "Details der Benutzersitzung",
      expiresAt: "Sitzung läuft ab",
      rememberMeActive: "Angemeldet bleiben Status",
      loginLocation: "Anmeldeort",
    },
    nextSteps: {
      title: "Nächste Schritte",
      item: "Nächste Schritte",
    },
  },
  errors: {
    title: "Anmeldefehler",
    account_locked: "Konto ist gesperrt",
    accountLocked: "Konto ist gesperrt",
    accountLockedDescription:
      "Ihr Konto wurde gesperrt. Bitte kontaktieren Sie den Support.",
    invalid_credentials: "Ungültige E-Mail oder Passwort",
    two_factor_required: "Zwei-Faktor-Authentifizierung erforderlich",
    auth_error: "Authentifizierungsfehler aufgetreten",
    user_not_found: "Benutzer nicht gefunden",
    session_creation_failed: "Sitzung konnte nicht erstellt werden",
    token_save_failed:
      "Authentifizierungs-Token konnte nicht gespeichert werden",
    validation: {
      title: "Validierung fehlgeschlagen",
      description: "Bitte überprüfen Sie Ihre Eingabe",
    },
    unauthorized: {
      title: "Anmeldung fehlgeschlagen",
      description: "Ungültige Anmeldedaten",
    },
    unknown: {
      title: "Anmeldungsfehler",
      description: "Bei der Anmeldung ist ein Fehler aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Verbindung fehlgeschlagen",
    },
    forbidden: {
      title: "Zugriff verweigert",
      description: "Anmeldung nicht erlaubt",
    },
    notFound: {
      title: "Benutzer nicht gefunden",
      description: "Benutzerkonto nicht gefunden",
    },
    unsaved: {
      title: "Nicht gespeicherte Änderungen",
      description: "Änderungen wurden nicht gespeichert",
    },
    conflict: {
      title: "Anmeldungskonflikt",
      description: "Anmeldungskonflikt erkannt",
    },
    server: {
      title: "Serverfehler",
      description: "Interner Serverfehler aufgetreten",
    },
  },
  success: {
    title: "Anmeldung erfolgreich",
    description: "Sie wurden erfolgreich angemeldet",
    message: "Willkommen zurück! Sie haben sich erfolgreich angemeldet.",
  },
  token: {
    save: {
      failed: "Authentifizierungstoken konnte nicht gespeichert werden",
      success: "Authentifizierungstoken erfolgreich gespeichert",
    },
  },
  process: {
    failed: "Anmeldevorgang fehlgeschlagen",
  },
  enums: {
    socialProviders: {
      google: "Google",
      github: "GitHub",
      facebook: "Facebook",
    },
  },
};
