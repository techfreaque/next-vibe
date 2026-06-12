import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  login: {
  category: "Benutzer",
  title: "Willkommen zurück",
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
},
  resetPassword: {
  confirm: {
  category: "Benutzer",

  title: "Passwort-Reset bestätigen",
  description: "Bestätigen Sie Ihr Passwort-Reset mit einem neuen Passwort",
  tag: "Passwort-Reset",
  email: {
    title: "Passwort erfolgreich zurückgesetzt",
    subject: "Passwort erfolgreich zurückgesetzt - {{appName}}",
    previewText:
      "Ihr {{appName}}-Passwort wurde zurückgesetzt. Melden Sie sich an und chatten Sie mit {{modelCount}} KI-Modellen.",
    greeting: "Hey {{name}},",
    successMessage:
      "Ihr Passwort wurde zurückgesetzt. Alles erledigt - melden Sie sich an und machen Sie dort weiter, wo Sie aufgehört haben.",
    loginButton: "Bei {{appName}} anmelden",
    promoText: "{{modelCount}} KI-Modelle. Keine Filter. Keine Lektionen.",
    securityWarning:
      "Passwort nicht zurückgesetzt? Kontaktieren Sie sofort den Support - Ihr Konto könnte gefährdet sein.",
  },
  groups: {
    verification: {
      title: "Verifizierung",
      description: "Verifizieren Sie Ihre Passwort-Reset-Anfrage",
    },
    newPassword: {
      title: "Neues Passwort",
      description: "Setzen Sie Ihr neues Passwort",
    },
  },
  fields: {
    token: {
      label: "Reset-Token",
      description: "Der Passwort-Reset-Token aus Ihrer E-Mail",
      placeholder: "Reset-Token eingeben",
      help: "Überprüfen Sie Ihre E-Mail für den Passwort-Reset-Token und geben Sie ihn hier ein",
      validation: {
        required: "Reset-Token ist erforderlich",
      },
    },
    email: {
      label: "E-Mail-Adresse",
      description: "Ihre E-Mail-Adresse",
      placeholder: "E-Mail-Adresse eingeben",
      validation: {
        invalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
      },
    },
    password: {
      label: "Neues Passwort",
      description: "Ihr neues Passwort",
      placeholder: "Neues Passwort eingeben",
      help: "Wählen Sie ein starkes Passwort mit mindestens 8 Zeichen, einschließlich Buchstaben, Zahlen und Symbolen",
      validation: {
        minLength: "Passwort muss mindestens 8 Zeichen lang sein",
      },
    },
    confirmPassword: {
      label: "Passwort bestätigen",
      description: "Bestätigen Sie Ihr neues Passwort",
      placeholder: "Neues Passwort bestätigen",
      validation: {
        minLength: "Passwort muss mindestens 8 Zeichen lang sein",
      },
    },
  },
  validation: {
    passwords: {
      mismatch: "Passwörter stimmen nicht überein",
    },
  },
  response: {
    title: "Passwort-Reset-Antwort",
    description: "Passwort-Reset-Bestätigungsantwort",
    message: {
      label: "Nachricht",
      description: "Antwortnachricht",
    },
    securityTip:
      "Erwägen Sie die Aktivierung der Zwei-Faktor-Authentifizierung für bessere Sicherheit",
    nextSteps: [
      "Melden Sie sich mit Ihrem neuen Passwort an",
      "Aktualisieren Sie gespeicherte Passwörter in Ihrem Browser",
      "Erwägen Sie die Aktivierung von 2FA für zusätzliche Sicherheit",
    ],
  },
  errors: {
    title: "Fehler beim Zurücksetzen des Passworts",
    no_email: "Kein Konto mit dieser E-Mail-Adresse gefunden",
    validation: {
      title: "Validierungsfehler",
      description:
        "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
      passwordsDoNotMatch: "Passwörter stimmen nicht überein",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Ungültiger oder abgelaufener Reset-Token",
    },
    internal: {
      title: "Serverfehler",
      description: "Ein interner Serverfehler ist aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkverbindungsfehler",
    },
    forbidden: {
      title: "Zugriff verweigert",
      description: "Sie haben keine Berechtigung für diese Aktion",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Reset-Token nicht gefunden oder abgelaufen",
    },
    unsaved: {
      title: "Ungespeicherte Änderungen",
      description: "Es gibt ungespeicherte Änderungen",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Beim Verarbeiten Ihrer Anfrage ist ein Konflikt aufgetreten",
    },
  },
  success: {
    title: "Passwort-Reset erfolgreich",
    description: "Ihr Passwort wurde erfolgreich zurückgesetzt",
    message: "Passwort wurde erfolgreich zurückgesetzt",
    password_reset: "Ihr Passwort wurde erfolgreich zurückgesetzt",
  },
  actions: {
    requestNewLink: "Neuen Reset-Link anfordern",
  },
  emailTemplates: {
    confirm: {
      name: "E-Mail zur Passwort-Reset-Bestätigung",
      description:
        "E-Mail, die an Benutzer gesendet wird, nachdem ihr Passwort erfolgreich zurückgesetzt wurde",
      category: "Authentifizierung",
      preview: {
        publicName: {
          label: "Öffentlicher Name",
          description: "Der öffentliche Anzeigename des Benutzers",
        },
        userId: {
          label: "Benutzer-ID",
          description: "Die eindeutige Kennung des Benutzers",
        },
      },
    },
  },
},
  request: {
  category: "Benutzer",
  title: "Passwort-Reset Anfrage",
  description: "Passwort-Reset anfordern",
  tag: "Passwort-Reset",
  ui: {
    title: "Passwort zurücksetzen",
    subtitle:
      "Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen",
    sendResetLink: "Reset-Link senden",
    alreadyHaveAccount: "Bereits ein Konto? Anmelden",
  },
  actions: {
    submitting: "Senden...",
  },
  email: {
    title: "Ihr {{appName}}-Passwort zurücksetzen",
    subject: "Anfrage zur Passwortzurücksetzung - {{appName}}",
    previewText:
      "Ihr {{appName}}-Passwort zurücksetzen - Link gültig für {{hours}} Stunden.",
    greeting: "Hey {{name}},",
    requestInfo:
      "Jemand hat eine Passwortzurücksetzung für Ihr {{appName}}-Konto angefordert. Falls Sie das waren, klicken Sie auf den Button unten.",
    buttonText: "Mein Passwort zurücksetzen",
    expirationInfo:
      "Link läuft in {{hours}} Stunden ab. Falls Sie dies nicht angefordert haben, ignorieren Sie diese E-Mail - Ihr Passwort bleibt unverändert.",
    signoff: "Das {{appName}} Team",
    promoText: "{{modelCount}} KI-Modelle. Keine Filter. Keine Lektionen.",
  },
  groups: {
    emailInput: {
      title: "E-Mail-Eingabe",
      description:
        "Geben Sie Ihre E-Mail-Adresse ein, um Reset-Anweisungen zu erhalten",
    },
  },
  fields: {
    email: {
      label: "E-Mail-Adresse",
      description: "Geben Sie Ihre E-Mail-Adresse ein",
      placeholder: "ihre@email.de",
      help: "Geben Sie die mit Ihrem Konto verknüpfte E-Mail-Adresse ein",
      validation: {
        invalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
      },
    },
  },
  response: {
    title: "Reset-Anfrage-Antwort",
    description: "Passwort-Reset-Anfrage-Antwort",
    success: {
      message: "Passwort-Reset-Link erfolgreich gesendet",
    },
    deliveryInfo: {
      estimatedTime: "innerhalb von 5 Minuten",
      expiresAt: "4 Stunden ab jetzt",
    },
    nextSteps: {
      checkEmail: "Überprüfen Sie Ihren E-Mail-Eingang und Spam-Ordner",
      clickLink: "Klicken Sie auf den Reset-Link in der E-Mail",
      createPassword: "Erstellen Sie ein neues sicheres Passwort",
    },
  },
  errors: {
    title: "Fehler",
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Eingabe bereitgestellt",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Anfrage nicht autorisiert",
    },
    internal: {
      title: "Interner Fehler",
      description: "Interner Serverfehler",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkverbindungsfehler",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Ressource nicht gefunden",
    },
    unsaved: {
      title: "Ungespeicherte Änderungen",
      description: "Änderungen wurden nicht gespeichert",
    },
    conflict: {
      title: "Konflikt",
      description: "Datenkonflikt aufgetreten",
    },
    no_email: "Kein Konto mit dieser E-Mail-Adresse gefunden",
    email_generation_failed: "E-Mail konnte nicht generiert werden",
  },
  success: {
    title: "Anfrage gesendet",
    description: "Passwort-Reset-Anfrage erfolgreich gesendet",
  },
  post: {
    title: "Titel",
    description: "Endpunkt-Beschreibung",
    form: {
      title: "Konfiguration",
      description: "Parameter konfigurieren",
    },
    response: {
      title: "Antwort",
      description: "Antwortdaten",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
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
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
  emailTemplates: {
    request: {
      name: "E-Mail zur Passwort-Reset-Anfrage",
      description:
        "E-Mail, die an Benutzer mit einem Link zum Zurücksetzen ihres Passworts gesendet wird",
      category: "Authentifizierung",
      preview: {
        publicName: {
          label: "Öffentlicher Name",
          description: "Der öffentliche Anzeigename des Benutzers",
        },
        userId: {
          label: "Benutzer-ID",
          description: "Die eindeutige Kennung des Benutzers",
        },
        passwordResetUrl: {
          label: "Passwort-Reset-URL",
          description: "Die URL zum Zurücksetzen des Passworts",
        },
      },
    },
  },
},
  validate: {
  category: "Benutzer",

  title: "Passwort-Reset-Token validieren",
  description: "Endpunkt zur Validierung des Passwort-Reset-Tokens",
  tag: "Passwort-Reset-Validierung",
  groups: {
    tokenInput: {
      title: "Token-Validierung",
      description: "Geben Sie das Passwort-Reset-Token zur Validierung ein",
    },
  },
  fields: {
    token: {
      label: "Reset-Token",
      description: "Passwort-Reset-Token aus der E-Mail",
      placeholder: "Reset-Token eingeben",
      help: "Geben Sie das Token ein, das Sie per E-Mail erhalten haben",
      validation: {
        required: "Reset-Token ist erforderlich",
      },
    },
  },
  response: {
    title: "Validierungsergebnis",
    description: "Token-Validierungsantwort",
    valid: "Token gültig",
    message: "Validierungsnachricht",
    validationMessage: "Reset-Token-Validierung abgeschlossen",
    userId: "Benutzer-ID",
    expiresAt: "Token läuft ab am",
    nextSteps: {
      item: "Nächste Schritte nach Validierung",
      steps: [
        "Fahren Sie fort, um Ihr neues Passwort festzulegen",
        "Wählen Sie ein starkes, einzigartiges Passwort",
      ],
    },
  },
  errors: {
    title: "Fehler",
    validation: {
      title: "Validierungsfehler",
      description: "Token-Validierung fehlgeschlagen",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Ungültiges oder abgelaufenes Token",
    },
    internal: {
      title: "Interner Fehler",
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
      description: "Token nicht gefunden",
    },
    unsaved: {
      title: "Ungespeicherte Änderungen",
      description: "Ungespeicherte Änderungen erkannt",
    },
    conflict: {
      title: "Konflikt",
      description: "Datenkonflikt aufgetreten",
    },
  },
  success: {
    title: "Token gültig",
    description: "Passwort-Reset-Token ist gültig",
  },
  post: {
    title: "Titel",
    description: "Endpunkt-Beschreibung",
    form: {
      title: "Konfiguration",
      description: "Parameter konfigurieren",
    },
    response: {
      title: "Antwort",
      description: "Antwortdaten",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
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
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
},
  actions: {
    back: "Zurück",
    submit: "Absenden",
    submitting: "Wird gesendet...",
  },
  success: {
    password_reset: "Ihr Passwort wurde erfolgreich zurückgesetzt.",
  },
  errors: {
    tokenValidationFailed: "Token-Validierung fehlgeschlagen",
    userLookupFailed: "Benutzer konnte nicht gefunden werden",
    tokenDeletionFailed: "Token konnte nicht gelöscht werden",
    userDeletionFailed: "Benutzer konnte nicht gelöscht werden",
    resetFailed: "Passwort-Zurücksetzung fehlgeschlagen",
    tokenCreationFailed: "Reset-Token konnte nicht erstellt werden",
    noDataReturned: "Keine Daten von der Datenbank zurückgegeben",
    tokenInvalid: "Reset-Token ist ungültig",
    tokenExpired: "Reset-Token ist abgelaufen",
    tokenVerificationFailed: "Token-Verifizierung fehlgeschlagen",
    userNotFound: "Benutzer nicht gefunden",
    passwordUpdateFailed: "Passwort konnte nicht aktualisiert werden",
    passwordResetFailed: "Passwort-Zurücksetzung fehlgeschlagen",
    requestFailed: "Reset-Anfrage fehlgeschlagen",
    emailMismatch: "E-Mail stimmt nicht überein",
    confirmationFailed: "Passwort-Zurücksetzungsbestätigung fehlgeschlagen",
  },
},
  signup: {
  category: "Benutzer",

  _components: {
  passwordStrength: {
    label: "Passwortstärke",
    weak: "Schwach",
    fair: "Ausreichend",
    good: "Gut",
    strong: "Stark",
    requirement: {
      minLength: {
        icon: "✗",
        text: "Mindestens 8 Zeichen",
      },
      uppercase: {
        icon: "✗",
        text: "Mindestens ein Großbuchstabe",
      },
      lowercase: {
        icon: "✗",
        text: "Mindestens ein Kleinbuchstabe",
      },
      number: {
        icon: "✗",
        text: "Mindestens eine Zahl",
      },
      special: {
        icon: "!",
        text: "Sonderzeichen (optional, verbessert Stärke)",
      },
    },
  },
  post: {
    title: "Titel",
    description: "Endpunkt-Beschreibung",
    form: {
      title: "Konfiguration",
      description: "Parameter konfigurieren",
    },
    response: {
      title: "Antwort",
      description: "Antwortdaten",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
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
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
},
  title: "Benutzerregistrierung",
  description: "Endpunkt zur Benutzerregistrierung",
  tag: "Authentifizierung",
  actions: {
    submit: "Konto erstellen",
    submitting: "Konto wird erstellt...",
  },
  fields: {
    privateName: {
      label: "Dein privater Name",
      description:
        "Wie die KI dich in privaten Gesprächen ansprechen wird. Das bleibt zwischen dir und der KI - komplett privat.",
      placeholder: "Gib deinen Namen ein",
      validation: {
        required: "Privater Name ist erforderlich",
        minLength: "Name muss mindestens 2 Zeichen lang sein",
        maxLength: "Name darf nicht länger als 100 Zeichen sein",
      },
    },
    publicName: {
      label: "Dein öffentlicher Name",
      description:
        "Deine Identität in öffentlichen Chats und Foren. Andere User und KIs werden diesen Namen sehen. Wähle weise - er repräsentiert dich in der Community.",
      placeholder: "Gib deinen Anzeigenamen ein",
      validation: {
        required: "Anzeigename ist erforderlich",
        minLength: "Anzeigename muss mindestens 2 Zeichen lang sein",
        maxLength: "Anzeigename darf nicht länger als 100 Zeichen sein",
      },
    },
    email: {
      label: "Deine E-Mail",
      description:
        "Deine Login-Zugangsdaten und Kontaktmethode. Bleibt privat - wird niemals mit anderen Usern oder KIs geteilt.",
      placeholder: "E-Mail-Adresse eingeben",
      help: "Dies wird deine Login-E-Mail und primäre Kontaktmethode sein",
      validation: {
        required: "E-Mail ist erforderlich",
        invalid: "Bitte gib eine gültige E-Mail-Adresse ein",
      },
    },
    password: {
      label: "Dein Passwort",
      description:
        "Starke Passwörter schützen dein Konto. Wir implementieren bald Ende-zu-Ende-Verschlüsselung - ab diesem Zeitpunkt werden Passwort-Resets deinen Nachrichtenverlauf löschen, da nur du den Entschlüsselungsschlüssel besitzt. Speichere es also sicher ab.",
      placeholder: "Passwort eingeben",
      validation: {
        required: "Passwort ist erforderlich",
        minLength: "Passwort muss mindestens 8 Zeichen lang sein",
        complexity:
          "Passwort muss Großbuchstaben, Kleinbuchstaben und eine Zahl enthalten",
      },
    },
    confirmPassword: {
      label: "Passwort bestätigen",
      validation: {
        required: "Bitte bestätige dein Passwort",
        minLength: "Passwort muss mindestens 8 Zeichen lang sein",
        mismatch: "Passwörter stimmen nicht überein",
      },
    },

    acceptTerms: {
      label: "AGB akzeptieren",
      description:
        "Unsere Bedingungen respektieren deine Freiheit und Privatsphäre.",
      termsLink: "AGB",
      conditionsLink: "Datenschutz",
      descriptionPrefix: "Unsere",
      descriptionAnd: "und",
      descriptionSuffix: "respektieren deine Freiheit und Privatsphäre.",
      validation: {
        required: "Du musst die AGB akzeptieren, um fortzufahren",
      },
    },
    subscribeToNewsletter: {
      label: "Newsletter abonnieren",
      description:
        "Gelegentliche Updates über neue Modelle und Features. Kein Spam, nur was zählt.",
    },

    referralCode: {
      label: "Empfehlungscode (optional)",
      description:
        "Hast du einen Freund auf unbottled.ai? Gib seinen Code ein, um ihn zu unterstützen. Er wird dafür belohnt, dass er dich mitgebracht hat.",
      placeholder: "Empfehlungscode eingeben (optional)",
      labelPrefilled: "Empfehlungscode",
      descriptionPrefilled:
        "Dein Freund wird belohnt, wenn du ein Konto erstellst.",
    },
    supportedSkillId: {
      label: "Creator unterstützen",
      description:
        "Deine Registrierung bringt dem Ersteller dieses Skills +5% auf deine Abonnements.",
      selectorTitle: "Creator unterstützen",
      selectorDescription:
        "Du hast Skills von unabhängigen Creators in deine Favoriten aufgenommen. Wähle einen zum Unterstützen - er erhält +5% aus deinen Abonnements. Du kannst das jederzeit ändern.",
      selectorNone: "Keinen (überspringen)",
    },
    localFavorites: {
      label: "Lokale Favoriten",
    },
  },
  form: {
    title: "Willkommen bei Uncensored AI",
    description:
      "Hilf mit, unzensierte, privatsphäre-orientierte und wirklich unabhängige KI aufzubauen. unbottled.ai ist Open Source und Community-getrieben - deine Registrierung unterstützt die Entwicklung von KI-Technologie, die deine Freiheit respektiert.",
  },
  footer: {
    alreadyHaveAccount: "Haben Sie bereits ein Konto? Anmelden",
  },

  errors: {
    title: "Anmeldefehler",
    validation: {
      title: "Validierungsfehler",
      description:
        "Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Authentifizierung erforderlich",
    },
    server: {
      title: "Serverfehler",
      description: "Ein interner Serverfehler ist aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
    conflict: {
      title: "Kontokonflikt",
      description: "Ein Konto mit dieser E-Mail existiert bereits",
    },
    forbidden: {
      title: "Zugriff verweigert",
      description: "Zugriff verweigert",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkfehler aufgetreten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Ressource nicht gefunden",
    },
    unsaved: {
      title: "Nicht gespeicherte Änderungen",
      description: "Sie haben nicht gespeicherte Änderungen",
    },
    internal: {
      title: "Interner Fehler",
      description: "Ein interner Fehler ist aufgetreten",
    },
  },
  emailCheck: {
    title: "E-Mail-Verfügbarkeitsprüfung",
    description:
      "Prüfen Sie, ob die E-Mail für die Registrierung verfügbar ist",
    tag: "E-Mail-Prüfung",
    fields: {
      email: {
        label: "E-Mail-Adresse",
        description: "Zu prüfende E-Mail",
        placeholder: "E-Mail-Adresse eingeben",
        validation: {
          invalid: "Ungültiges E-Mail-Format",
        },
      },
    },
    response: {
      title: "E-Mail-Prüfungsantwort",
      description: "Ergebnis der E-Mail-Verfügbarkeitsprüfung",
      available: "E-Mail verfügbar",
      message: "Verfügbarkeitsnachricht",
    },
    errors: {
      validation: {
        title: "Ungültige E-Mail",
        description: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
      },
      internal: {
        title: "E-Mail-Prüfungsfehler",
        description: "Fehler bei der Überprüfung der E-Mail-Verfügbarkeit",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      conflict: {
        title: "E-Mail bereits vergeben",
        description: "Diese E-Mail ist bereits registriert",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Sie haben keine Berechtigung, diese E-Mail zu prüfen",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Prüfen der E-Mail",
      },
      notFound: {
        title: "Service nicht gefunden",
        description: "E-Mail-Prüfungsservice ist nicht verfügbar",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich zum Prüfen der E-Mail",
      },
      unsaved: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
    },
    success: {
      title: "E-Mail-Prüfung abgeschlossen",
      description: "E-Mail-Verfügbarkeit erfolgreich geprüft",
    },
  },
  post: {
    title: "Registrierung",
    description: "Registrierungs-Endpunkt",
    form: {
      title: "Registrierungskonfiguration",
      description: "Registrierungsparameter konfigurieren",
    },
    response: {
      title: "Antwort",
      description: "Registrierungsantwortdaten",
      success: "Registrierung erfolgreich",
      message: "Statusnachricht",
      userId: "Benutzer-ID",
      nextSteps: "Nächste Schritte",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
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
      unsaved: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
      processing: "Registrierung wird erfolgreich verarbeitet",
    },
  },
  response: {
    title: "Antwort",
    description: "Registrierungsantwortdaten",
    success: "Registrierung erfolgreich",
    message: "Statusnachricht",
    user: {
      id: "Benutzer-ID",
      email: "E-Mail-Adresse",
      firstName: "Vorname",
      lastName: "Nachname",
      privateName: "Privater Name",
      publicName: "Öffentlicher Name",
      imageUrl: "Profilbild-URL",
      verificationRequired: "Verifizierung erforderlich",
    },
    verificationInfo: {
      title: "E-Mail-Verifizierung",
      description: "Details zum E-Mail-Verifizierungsprozess",
      emailSent: "E-Mail gesendet",
      expiresAt: "Verifizierung läuft ab am",
      checkSpamFolder: "Spam-Ordner prüfen",
    },
    nextSteps: "Nächste Schritte",
  },
  success: {
    title: "Registrierung erfolgreich",
    description: "Dein Konto wurde erfolgreich erstellt",
  },
  admin_notification: {
    title: "Neue Benutzeranmeldung",
    subject: "Neue Benutzeranmeldung - {{privateName}}",
    preview: "Neuer Benutzer {{privateName}} hat sich angemeldet",
    message: "Ein neuer Benutzer hat sich bei {{appName}} angemeldet",
    privateName: "Privater Name",
    publicName: "Öffentlicher Name",
    email: "E-Mail",
    locale: "Sprache",
    creditBalance: "Guthaben",
    leadCreditBalance: "Lead-Guthaben",
    signup_preferences: "Anmeldepräferenzen",
    user_details: "Benutzerdetails",
    basic_information: "Grundlegende Informationen",
    signup_type: "Anmeldetyp",
    direct_signup: "Direkte Anmeldung",
    newsletter: "Newsletter",
    subscribed: "Abonniert",
    not_subscribed: "Nicht abonniert",
    signup_details: "Anmeldedetails",
    signup_date: "Anmeldedatum",
    user_id: "Benutzer-ID",
    recommended_next_steps: "Empfohlene nächste Schritte",
    direct_recommendation: "Benutzerprofil und Zahlungseinrichtung überprüfen",
    contact_user: "Benutzer kontaktieren",
    footer: "Dies ist eine automatische Benachrichtigung von {{appName}}",
  },
  email: {
    subject: "Du bist dabei - {{appName}} wartet auf dich",
    previewText:
      "Hey {{privateName}}, dein Account ist bereit. Chatte mit Claude, GPT, Gemini, DeepSeek und {{modelCount}} weiteren - kostenlos, keine Kreditkarte nötig.",
    headline: "Deine KI wartet.",
    greeting: "Hey {{privateName}},",
    intro:
      "Willkommen bei {{appName}}. Du hast gerade Zugang zur umfassendsten KI-Chat-Plattform bekommen - alles, was du an ChatGPT liebst, plus Open-Source-Modelle und Modelle ohne Inhaltsfilter.",
    models: {
      title: "{{modelCount}} Modelle in 3 Kategorien",
      mainstream: "Mainstream",
      open: "Open Source",
      uncensored: "Unzensiert",
    },
    free: {
      title: "Was du kostenlos bekommst, für immer:",
      credits:
        "{{freeCredits}} Credits pro Monat - keine Karte, kein Ablaufdatum",
      allModels: "Zugriff auf alle {{modelCount}} KI-Modelle",
      uncensored:
        "4 unzensierte Modelle, die deine Fragen wirklich beantworten",
      chatModes: "Private, Inkognito-, Geteilte und Öffentliche Chat-Modi",
      noCard: "Keine Kreditkarte erforderlich - niemals",
    },
    ctaButton: "Jetzt chatten",
    upgrade: {
      title: "Mehr haben?",
      desc: "{{subscriptionPrice}}/Monat gibt dir {{subscriptionCredits}} Credits - das ist 40× mehr. Dazu kannst du extra Credit-Pakete kaufen, die niemals ablaufen. Perfekt für tägliche KI-Nutzung.",
      cta: "Auf Pro upgraden",
    },
    signoff: "Viel Spaß beim Chatten,\nDas {{appName}} Team",
    ps: "P.S. Nutze den Inkognito-Modus, um Gespräche nur auf deinem Gerät zu behalten - wir speichern sie niemals auf unseren Servern.",
  },
  emailTemplates: {
    welcome: {
      name: "Willkommens-E-Mail nach Registrierung",
      description:
        "Willkommens-E-Mail, die nach erfolgreicher Registrierung an Benutzer gesendet wird",
      category: "Authentifizierung",
      preview: {
        privateName: {
          label: "Privater Name",
          description: "Der private Name des Benutzers",
        },
        userId: {
          label: "Benutzer-ID",
          description: "Die eindeutige Kennung des Benutzers",
        },
        leadId: {
          label: "Lead-ID",
          description: "Die Lead-Kennung des Benutzers",
        },
      },
    },
    adminSignup: {
      name: "Admin-Benachrichtigungs-E-Mail bei Registrierung",
      description:
        "E-Mail, die an Admins gesendet wird, wenn sich ein neuer Benutzer registriert",
      category: "Administration",
      preview: {
        privateName: {
          label: "Privater Name",
        },
        publicName: {
          label: "Öffentlicher Name",
        },
        email: {
          label: "E-Mail-Adresse",
        },
        userId: {
          label: "Benutzer-ID",
        },
        subscribeToNewsletter: {
          label: "Newsletter-Abonnement",
        },
      },
    },
  },
},
};
