import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
};
