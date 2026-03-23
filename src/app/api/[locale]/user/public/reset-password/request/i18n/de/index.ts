import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
      "Ihr {{appName}}-Passwort zurücksetzen — Link gültig für {{hours}} Stunden.",
    greeting: "Hey {{name}},",
    requestInfo:
      "Jemand hat eine Passwortzurücksetzung für Ihr {{appName}}-Konto angefordert. Falls Sie das waren, klicken Sie auf den Button unten.",
    buttonText: "Mein Passwort zurücksetzen",
    expirationInfo:
      "Link läuft in {{hours}} Stunden ab. Falls Sie dies nicht angefordert haben, ignorieren Sie diese E-Mail — Ihr Passwort bleibt unverändert.",
    signoff: "— Das {{appName}} Team",
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
};
