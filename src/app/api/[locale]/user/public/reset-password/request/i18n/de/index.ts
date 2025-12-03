import type { translations as enTranslations } from "../en";
import { translations as componentsTranslations } from "../../_components/i18n/de";

export const translations: typeof enTranslations = {
  _components: componentsTranslations,
  title: "Passwort-Reset Anfrage",
  description: "Passwort-Reset anfordern",
  tag: "Passwort-Reset",
  email: {
    title: "Setzen Sie Ihr Passwort zurück",
    subject: "Anfrage zur Passwortzurücksetzung",
    previewText: "Setzen Sie Ihr Passwort zurück",
    greeting: "Hallo,",
    requestInfo:
      "Wir haben eine Anfrage zur Zurücksetzung Ihres Passworts erhalten.",
    instructions:
      "Klicken Sie auf die Schaltfläche unten, um Ihr Passwort zurückzusetzen:",
    buttonText: "Passwort zurücksetzen",
    expirationInfo: "Dieser Link läuft in 24 Stunden ab.",
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
      expiresAt: "24 Stunden ab jetzt",
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
};
