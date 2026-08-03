import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Benutzer",
  title: "Willkommen zurück",
  titleShort: "Anmelden",
  description:
    "Greife auf unzensierte KI-Modelle und deine Gesprächsverläufe zu.",
  tag: "Authentifizierung",
  options: {
    category: "Benutzer",

    title: "Login-Optionen",
    description: "Login-Konfigurationsoptionen",
    tag: "login-optionen",
    container: {
      title: "Login-Konfiguration",
      description: "Login-Einstellungen und -Optionen konfigurieren",
    },
    fields: {
      email: {
        label: "E-Mail-Adresse",
        description: "Geben Sie Ihre E-Mail-Adresse ein",
        placeholder: "ihre@email.com",
      },
      allowPasswordAuth: {
        label: "Passwort-Authentifizierung erlauben",
        description: "Passwort-basierte Authentifizierung aktivieren",
      },
      allowSocialAuth: {
        label: "Social-Media-Authentifizierung erlauben",
        description: "Social-Media-Provider-Authentifizierung aktivieren",
      },
      maxAttempts: {
        label: "Maximale Login-Versuche",
        description: "Maximale Anzahl erlaubter Login-Versuche",
      },
      requireTwoFactor: {
        label: "Zwei-Faktor-Authentifizierung erforderlich",
        description: "2FA für Benutzer-Login erforderlich",
      },
      socialProviders: {
        label: "Social-Media-Anbieter",
        description: "Verfügbare Social-Media-Authentifizierungsanbieter",
      },
      socialProvider: {
        title: "Social-Media-Anbieter",
        description: "Social-Media-Authentifizierungsanbieter-Konfiguration",
        enabled: {
          label: "Aktiviert",
          description: "Ob dieser Anbieter aktiviert ist",
        },
        name: {
          label: "Anbieter-Name",
          description: "Name des Social-Media-Anbieters",
        },
        providers: {
          label: "Anbieter-Optionen",
          description: "Verfügbare Social-Media-Anbieter-Optionen",
        },
      },
    },
    response: {
      title: "Login-Optionen-Antwort",
      description: "Verfügbare Login-Konfigurationsoptionen",
      success: {
        badge: "Erfolgreich",
      },
      message: {
        content: "Statusnachricht",
      },
      forUser: {
        content: "E-Mail-Adresse",
      },
      loginMethods: {
        title: "Login-Methoden",
        description: "Verfügbare Authentifizierungsmethoden",
        password: {
          title: "Passwort-Login",
          description: "Standard-Passwort-Authentifizierung",
          enabled: {
            badge: "Aktiviert",
          },
        },
        social: {
          title: "Social-Login",
          description: "Social-Media-Authentifizierungsoptionen",
          enabled: {
            badge: "Aktiviert",
          },
          providers: {
            item: {
              title: "Social-Media-Anbieter",
              description: "Social-Authentifizierungsanbieter",
            },
            name: {
              content: "Anbieter-Name",
            },
            id: {
              content: "Anbieter-ID",
            },
            enabled: {
              badge: "Verfügbar",
            },
            description: "Anbieter-Beschreibung",
          },
        },
      },
      security: {
        title: "Sicherheitseinstellungen",
        description: "Sicherheitsanforderungs-Zusammenfassung",
        maxAttempts: {
          content: "Maximale Login-Versuche",
        },
        requireTwoFactor: {
          badge: "2FA erforderlich",
        },
      },
      recommendations: {
        item: "Empfohlene Login-Option",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Änderungen wurden nicht gespeichert",
      },
    },
    success: {
      title: "Erfolgreich",
      description: "Login-Optionen erfolgreich abgerufen",
    },
    post: {
      title: "Login-Optionen",
      description: "Verfügbare Login-Optionen abrufen",
      response: {
        title: "Login-Optionen-Antwort",
        description: "Verfügbare Login-Konfigurationsoptionen",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anfrageparameter",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
      },
      success: {
        description: "Login-Optionen erfolgreich abgerufen",
      },
    },
    enums: {
      socialProviders: {
        google: "Google",
        github: "GitHub",
        facebook: "Facebook",
      },
    },
    messages: {
      successMessage: "Login-Optionen erfolgreich abgerufen",
      passwordAuthDescription:
        "Melden Sie sich mit Ihrer E-Mail-Adresse und Ihrem Passwort an",
      socialAuthDescription: "Melden Sie sich mit Ihren Social-Media-Konten an",
      continueWithProvider: "Weiter mit {{provider}}",
      twoFactorRequired: "Erhöhte Sicherheit: 2FA erforderlich",
      standardSecurity: "Standard-Sicherheitsanforderungen",
      tryPasswordFirst: "Versuchen Sie zuerst die Passwort-Anmeldung",
      useSocialLogin: "Verwenden Sie Social-Login",
      socialLoginFaster: "Social-Login ist schneller für neue Benutzer",
    },
  },
  actions: {
    submit: "Anmelden",
    submitting: "Wird angemeldet...",
  },
  fields: {
    email: {
      label: "Deine E-Mail",
      description: "Die E-Mail, mit der du dich registriert hast.",
      placeholder: "E-Mail eingeben",
      validation: {
        required: "E-Mail ist erforderlich",
        invalid: "Bitte gib eine gültige E-Mail-Adresse ein",
      },
    },
    password: {
      label: "Dein Passwort",
      description:
        "Gib das Passwort ein, das du bei der Registrierung festgelegt hast.",
      placeholder: "Passwort eingeben",
      help: "Gib dein Kontopasswort ein",
      validation: {
        required: "Passwort ist erforderlich",
        minLength: "Passwort muss mindestens 8 Zeichen lang sein",
      },
    },
    rememberMe: {
      label: "Angemeldet bleiben",
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
    auth_error: "Anmeldung für {{email}} fehlgeschlagen: {{error}}",
    user_not_found: "Kein Benutzer zu {{userId}} gefunden",
    session_creation_failed: "Sitzung für {{userId}} konnte nicht erstellt werden: {{error}}",
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
    title: "Login erfolgreich",
    description: "Du bist jetzt eingeloggt",
    message: "Willkommen zurück! Du hast dich erfolgreich eingeloggt.",
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
  dev: {
    quickLogin: "Schnell-Login (Dev)",
  },
};
