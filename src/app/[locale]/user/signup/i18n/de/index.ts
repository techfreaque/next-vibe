import { translations as componentsTranslations } from "../../_components/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  components: componentsTranslations,
  meta: {
    title: "Registrieren - Next Vibe",
    description:
      "Erstellen Sie Ihr Next Vibe Konto und beginnen Sie mit dem Aufbau erstaunlicher Anwendungen",
    category: "Authentifizierung",
    imageAlt: "Next Vibe Registrierung",
    keywords: "registrieren, anmelden, konto erstellen, next vibe",
    ogTitle: "Registrieren Sie sich für Next Vibe",
    ogDescription:
      "Treten Sie Next Vibe bei und beginnen Sie noch heute mit dem Aufbau erstaunlicher Anwendungen",
    twitterTitle: "Registrieren Sie sich für Next Vibe",
    twitterDescription:
      "Erstellen Sie Ihr Konto und beginnen Sie mit Next Vibe zu bauen",
  },
  auth: {
    signup: {
      title: "Beginnen Sie Ihre Reise mit Next Vibe",
      subtitle:
        "Schließen Sie sich Tausenden von Entwicklern an, die erstaunliche Anwendungen erstellen",
      createAccountButton: "Konto erstellen",
      creatingAccount: "Konto wird erstellt...",
      alreadyHaveAccount: "Haben Sie bereits ein Konto?",
      signIn: "Anmelden",
      termsAndConditions: "Ich stimme den",
      avatarAlt: "Benutzer-Avatar",
      userCount: "10.000+ Entwickler",
      trustText: "Vertraut von Entwicklern weltweit",
      createAccountAndBook: "Konto erstellen & Meeting buchen",
      directDescription: "Starten Sie sofort mit Ihrem Konto",
      scheduleDescription: "Planen Sie eine personalisierte Onboarding-Sitzung",
      meetingPreferenceOptions: {
        direct: "Direkter Zugang",
        schedule: "Meeting planen",
      },
      benefits: {
        contentCreation: {
          title: "Leistungsstarke Content-Erstellung",
          description:
            "Erstellen und verwalten Sie Inhalte mit unseren intuitiven Tools",
        },
        dataStrategy: {
          title: "Intelligente Datenstrategie",
          description:
            "Nutzen Sie datengesteuerte Erkenntnisse für bessere Entscheidungen",
        },
        saveTime: {
          title: "Zeit & Aufwand sparen",
          description:
            "Automatisieren Sie Workflows und steigern Sie die Produktivität",
        },
      },
      privateName: "Privater Name",
      privateNamePlaceholder: "Geben Sie Ihren privaten Namen ein",
      publicName: "Öffentlicher Name",
      publicNamePlaceholder: "Geben Sie Ihren öffentlichen Namen ein",
      emailLabel: "E-Mail-Adresse",
      emailPlaceholder: "Geben Sie Ihre E-Mail ein",
      passwordLabel: "Passwort",
      passwordPlaceholder: "Erstellen Sie ein Passwort",
      confirmPasswordLabel: "Passwort bestätigen",
      confirmPasswordPlaceholder: "Bestätigen Sie Ihr Passwort",
      newsletterSubscription: "Newsletter abonnieren",
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
};
