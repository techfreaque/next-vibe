import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  confirm: {
    category: "Benutzer",

    title: "Passwort-Reset bestätigen",
    titleShort: "Reset bestätigen",
    description: "Schließ das Zurücksetzen mit einem neuen Passwort ab",
    tag: "Passwort-Reset",
    email: {
      title: "Passwort erfolgreich zurückgesetzt",
      subject: "Dein {{appName}} Passwort ist zurückgesetzt",
      previewText:
        "Dein {{appName}} Passwort ist zurückgesetzt. Melde dich an und chatte mit {{modelCount}} KI-Modellen.",
      greeting: "Hey {{name}},",
      successMessage:
        "Dein Passwort ist zurückgesetzt. Melde dich an und mach da weiter, wo du aufgehört hast.",
      loginButton: "Bei {{appName}} anmelden",
      promoText: "{{modelCount}} KI-Modelle. Keine Filter. Keine Lektionen.",
      securityWarning:
        "Das warst nicht du? Schreib sofort dem Support. Dein Konto könnte gefährdet sein.",
    },
    groups: {
      verification: {
        title: "Verifizierung",
        description: "Bestätige deine Anfrage zum Zurücksetzen",
      },
      newPassword: {
        title: "Neues Passwort",
        description: "Leg dein neues Passwort fest",
      },
    },
    fields: {
      token: {
        label: "Reset-Token",
        description: "Der Reset-Token aus deiner E-Mail",
        placeholder: "Reset-Token eingeben",
        help: "Schau in deine E-Mail und gib den Reset-Token hier ein",
        validation: {
          required: "Reset-Token ist erforderlich",
        },
      },
      email: {
        label: "E-Mail-Adresse",
        description: "Deine E-Mail-Adresse",
        placeholder: "E-Mail-Adresse eingeben",
        validation: {
          invalid: "Gib eine gültige E-Mail-Adresse ein",
        },
      },
      password: {
        label: "Neues Passwort",
        description: "Dein neues Passwort",
        placeholder: "Neues Passwort eingeben",
        help: "Wähl ein starkes Passwort mit mindestens 8 Zeichen, aus Buchstaben, Zahlen und Symbolen",
        validation: {
          minLength: "Passwort muss mindestens 8 Zeichen lang sein",
        },
      },
      confirmPassword: {
        label: "Passwort bestätigen",
        description: "Bestätige dein neues Passwort",
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
        "Aktivier die Zwei-Faktor-Authentifizierung für mehr Sicherheit",
      nextSteps: [
        "Melde dich mit deinem neuen Passwort an",
        "Aktualisier gespeicherte Passwörter in deinem Browser",
        "Aktivier 2FA für zusätzliche Sicherheit",
      ],
    },
    errors: {
      title: "Fehler beim Zurücksetzen des Passworts",
      no_email: "Kein Konto mit dieser E-Mail-Adresse gefunden",
      validation: {
        title: "Validierungsfehler",
        description: "Prüf deine Eingabe und versuch es noch mal",
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
        description: "Du hast keine Berechtigung für diese Aktion",
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
        description: "Bei deiner Anfrage ist ein Konflikt aufgetreten",
      },
    },
    success: {
      title: "Passwort-Reset erfolgreich",
      description: "Dein Passwort ist zurückgesetzt",
      message: "Passwort wurde erfolgreich zurückgesetzt",
      password_reset: "Dein Passwort ist zurückgesetzt",
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
    titleShort: "Passwort zurücksetzen",
    description: "Passwort-Reset anfordern",
    tag: "Passwort-Reset",
    ui: {
      title: "Passwort zurücksetzen",
      subtitle: "E-Mail eingeben. Wir schicken dir einen Link.",
      sendResetLink: "Link senden",
      alreadyHaveAccount: "Bereits ein Konto? Anmelden",
    },
    actions: {
      submitting: "Senden...",
    },
    email: {
      title: "Dein {{appName}} Passwort zurücksetzen",
      subject: "Setz dein {{appName}} Passwort zurück",
      previewText:
        "Setz dein {{appName}} Passwort zurück. Der Link gilt {{hours}} Stunden.",
      greeting: "Hey {{name}},",
      requestInfo:
        "Jemand will das Passwort für dein {{appName}} Konto zurücksetzen. Warst du das, klick auf den Button unten.",
      buttonText: "Mein Passwort zurücksetzen",
      expirationInfo:
        "Der Link läuft in {{hours}} Stunden ab. Warst du das nicht, ignorier diese E-Mail. Dein Passwort bleibt, wie es ist.",
      signoff: "Das {{appName}} Team",
      promoText: "{{modelCount}} KI-Modelle. Keine Filter. Keine Lektionen.",
    },
    groups: {
      emailInput: {
        title: "E-Mail-Eingabe",
        description:
          "Gib deine E-Mail-Adresse ein, dann schicken wir dir die Anleitung",
      },
    },
    fields: {
      email: {
        label: "E-Mail",
        description: "Gib deine E-Mail-Adresse ein",
        placeholder: "du@beispiel.de",
        help: "Gib die E-Mail-Adresse deines Kontos ein",
        validation: {
          invalid: "Gib eine gültige E-Mail-Adresse ein",
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
        checkEmail: "Schau in dein Postfach und in den Spam-Ordner",
        clickLink: "Klick auf den Reset-Link in der E-Mail",
        createPassword: "Leg ein neues, sicheres Passwort fest",
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
    titleShort: "Token prüfen",
    description: "Endpunkt zur Validierung des Passwort-Reset-Tokens",
    tag: "Passwort-Reset-Validierung",
    groups: {
      tokenInput: {
        title: "Token-Validierung",
        description: "Gib den Reset-Token zur Prüfung ein",
      },
    },
    fields: {
      token: {
        label: "Reset-Token",
        description: "Passwort-Reset-Token aus der E-Mail",
        placeholder: "Reset-Token eingeben",
        help: "Gib den Token aus deiner E-Mail ein",
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
        setPassword: "Weiter, um dein neues Passwort festzulegen",
        choosePassword: "Wähl ein starkes, einzigartiges Passwort",
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
    password_reset: "Dein Passwort ist zurückgesetzt.",
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
};
