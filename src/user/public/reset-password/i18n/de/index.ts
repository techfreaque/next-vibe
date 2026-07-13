import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  confirm: {
    category: "Benutzer",

    title: "Passwort-Reset bestätigen",
    titleShort: "Reset bestätigen",
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
    titleShort: "Passwort zurücksetzen",
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
    titleShort: "Token prüfen",
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
};
