import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Benutzer",
  title: "Passwort-Reset Anfrage",
  description: "Passwort-Reset anfordern",
  tag: "Passwort-Reset",
  ui: {
    title: "Passwort zurücksetzen",
    subtitle:
      "Gib deine E-Mail-Adresse ein und wir schicken dir einen Link zum Zurücksetzen",
    sendResetLink: "Reset-Link senden",
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
      label: "E-Mail-Adresse",
      description: "Gib deine E-Mail-Adresse ein",
      placeholder: "ihre@email.de",
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
    no_email: "Kein Konto zu {{email}} gefunden",
    email_generation_failed:
      "Zurücksetzungs-E-Mail für {{email}} konnte nicht erstellt werden: {{errorMessage}}",
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
