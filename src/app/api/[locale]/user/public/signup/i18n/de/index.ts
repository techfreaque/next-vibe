import { translations as _componentsTranslations } from "../../_components/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  _components: _componentsTranslations,
  title: "Benutzerregistrierung",
  description: "Benutzerregistrierungs-Endpunkt",
  tag: "Authentifizierung",
  actions: {
    submit: "Konto erstellen",
    submitting: "Konto wird erstellt...",
  },
  fields: {
    firstName: {
      label: "Vorname",
      description: "Vorname des Benutzers",
      placeholder: "Vorname eingeben",
      help: "Geben Sie Ihren Vornamen ein, wie er in Ihrem Profil erscheinen soll",
    },
    lastName: {
      label: "Nachname",
      description: "Nachname des Benutzers",
      placeholder: "Nachname eingeben",
      help: "Geben Sie Ihren Nachnamen ein, wie er in Ihrem Profil erscheinen soll",
    },
    privateName: {
      label: "Privater Name",
      description: "Privater Name des Benutzers",
      placeholder: "Privaten Namen eingeben",
      help: "Geben Sie Ihren privaten Namen für interne Zwecke ein",
      validation: {
        required: "Privater Name ist erforderlich",
        minLength: "Name muss mindestens 2 Zeichen lang sein",
        maxLength: "Name darf nicht länger als 100 Zeichen sein",
      },
    },
    publicName: {
      label: "Öffentlicher Name",
      description: "Öffentlicher Name des Benutzers",
      placeholder: "Öffentlichen Namen eingeben",
      help: "Geben Sie Ihren öffentlichen Namen ein, wie er anderen angezeigt wird",
      validation: {
        required: "Öffentlicher Name ist erforderlich",
        minLength: "Anzeigename muss mindestens 2 Zeichen lang sein",
        maxLength: "Anzeigename darf nicht länger als 100 Zeichen sein",
      },
    },
    email: {
      label: "E-Mail",
      description: "E-Mail-Adresse des Benutzers",
      placeholder: "E-Mail-Adresse eingeben",
      help: "Dies wird Ihre Login-E-Mail und primäre Kontaktmethode sein",
      validation: {
        required: "E-Mail ist erforderlich",
        invalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
      },
    },
    password: {
      label: "Passwort",
      description: "Benutzerpasswort",
      placeholder: "Passwort eingeben",
      help: "Passwort muss mindestens 8 Zeichen haben",
      validation: {
        required: "Passwort ist erforderlich",
        minLength: "Passwort muss mindestens 8 Zeichen lang sein",
        complexity: "Passwort muss Großbuchstaben, Kleinbuchstaben und eine Zahl enthalten",
      },
    },
    confirmPassword: {
      label: "Passwort bestätigen",
      description: "Passwort bestätigen",
      placeholder: "Passwort erneut eingeben",
      help: "Geben Sie Ihr Passwort erneut ein, um es zu bestätigen",
      validation: {
        required: "Bitte bestätigen Sie Ihr Passwort",
        minLength: "Passwort muss mindestens 8 Zeichen lang sein",
        mismatch: "Passwörter stimmen nicht überein",
      },
    },
    phone: {
      label: "Telefonnummer",
      description: "Telefonnummer des Benutzers",
      placeholder: "Telefonnummer eingeben",
      help: "Telefonnummer für Kontowiederherstellung und Benachrichtigungen (optional)",
    },
    company: {
      label: "Firma",
      description: "Firmenname des Benutzers",
      placeholder: "Firmenname eingeben",
      help: "Ihr Unternehmen oder Organisationsname (optional)",
    },
    leadId: {
      label: "Lead-ID",
      description: "Lead-Identifikator für die Verfolgung",
      placeholder: "Lead-ID eingeben",
      help: "Interne Lead-Identifikation (optional)",
    },
    preferredContactMethod: {
      label: "Bevorzugte Kontaktmethode",
      description: "Wie Sie kontaktiert werden möchten",
      placeholder: "Kontaktmethode auswählen",
      help: "Wählen Sie, wie wir Sie erreichen sollen",
    },
    acceptTerms: {
      label: "Nutzungsbedingungen akzeptieren",
      description: "Akzeptieren Sie unsere Nutzungsbedingungen",
      placeholder: "Ich akzeptiere die Nutzungsbedingungen",
      help: "Bitte lesen und akzeptieren Sie unsere Nutzungsbedingungen, um fortzufahren",
      validation: {
        required: "Sie müssen die Nutzungsbedingungen akzeptieren, um fortzufahren",
      },
    },
    subscribeToNewsletter: {
      label: "Newsletter abonnieren",
      description: "Erhalten Sie Updates und Neuigkeiten per E-Mail",
      placeholder: "Unseren Newsletter abonnieren",
      help: "Erhalten Sie die neuesten Updates, Tipps und exklusive Angebote in Ihrem Postfach",
    },
    imageUrl: {
      label: "Profilbild-URL",
      description: "URL für Ihr Profilbild",
      placeholder: "Bild-URL eingeben",
      help: "Optional: Geben Sie eine URL für Ihr Profilbild an",
    },
    referralCode: {
      label: "Empfehlungscode",
      description: "Optionaler Empfehlungscode von einem Freund",
      placeholder: "Empfehlungscode eingeben (optional)",
      help: "Wenn Sie einen Empfehlungscode haben, geben Sie ihn hier ein",
    },
  },
  form: {
    title: "Konto erstellen",
    description: "Treten Sie der Community für unzensierte KI-Gespräche bei",
  },
  footer: {
    alreadyHaveAccount: "Haben Sie bereits ein Konto? Anmelden",
  },
  groups: {
    personalInfo: {
      title: "Persönliche Informationen",
      description: "Geben Sie Ihre persönlichen Daten ein",
    },
    security: {
      title: "Sicherheit",
      description: "Richten Sie Ihre Kontosicherheit ein",
    },
    businessInfo: {
      title: "Geschäftsinformationen",
      description: "Geben Sie Ihre Geschäftsdaten ein",
    },
    preferences: {
      title: "Einstellungen",
      description: "Legen Sie Ihre Kommunikationseinstellungen fest",
    },
    consent: {
      title: "Nutzungsbedingungen und Einverständnis",
      description: "Überprüfen und akzeptieren Sie unsere Nutzungsbedingungen",
    },
    advanced: {
      title: "Erweiterte Optionen",
      description: "Zusätzliche Konfigurationsoptionen",
    },
  },
  errors: {
    title: "Anmeldefehler",
    validation: {
      title: "Validierungsfehler",
      description: "Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut",
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
      description: "Konto existiert bereits",
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
    description: "Prüfen Sie, ob die E-Mail für die Registrierung verfügbar ist",
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
    title: "Anmeldung erfolgreich",
    description: "Ihr Konto wurde erfolgreich erstellt",
  },
  admin_notification: {
    title: "Neue Benutzeranmeldung",
    subject: "Neue Benutzeranmeldung - {{privateName}}",
    preview: "Neuer Benutzer {{privateName}} hat sich angemeldet",
    message: "Ein neuer Benutzer hat sich bei {{appName}} angemeldet",
    privateName: "Privater Name",
    publicName: "Öffentlicher Name",
    email: "E-Mail",
    signup_preferences: "Anmeldepräferenzen",
    user_details: "Benutzerdetails",
    basic_information: "Grundlegende Informationen",
    signup_type: "Anmeldetyp",
    consultation_first: "Beratung zuerst",
    direct_signup: "Direkte Anmeldung",
    newsletter: "Newsletter",
    subscribed: "Abonniert",
    not_subscribed: "Nicht abonniert",
    signup_details: "Anmeldedetails",
    signup_date: "Anmeldedatum",
    user_id: "Benutzer-ID",
    recommended_next_steps: "Empfohlene nächste Schritte",
    consultation_recommendation: "Beratungsgespräch vereinbaren",
    direct_recommendation: "Benutzerprofil und Zahlungseinrichtung überprüfen",
    contact_user: "Benutzer kontaktieren",
    footer: "Dies ist eine automatische Benachrichtigung von {{appName}}",
  },
  email: {
    title: "Willkommen bei {{appName}}, {{privateName}}!",
    subject: "Willkommen bei {{appName}} - Deine unzensierte KI wartet",
    previewText:
      "Zugriff auf 38 KI-Modelle ohne Filter oder Einschränkungen. Starte jetzt mit 20 kostenlosen Credits!",
    welcomeMessage: "Du bist dabei! Willkommen bei unzensierten KI-Gesprächen",
    description:
      "Dein Account ist bereit. Du hast 20 kostenlose Credits, um mit jedem unserer 38 KI-Modelle zu chatten – darunter Claude Sonnet 4.5, GPT-5.2 Pro, Gemini 3 Pro, Kimi K2, DeepSeek R1 und exklusive unzensierte Modelle wie UncensoredLM v1.2, FreedomGPT Liberty und Grok 4. Keine Filter. Keine Einschränkungen. Nur ehrliche KI-Gespräche.",
    ctaTitle: "Jetzt mit dem Chatten beginnen",
    ctaButton: "KI-Chat starten",
    whatYouGet: "Was du bekommst (100% kostenlos)",
    feature1: "20 Credits pro Monat – für immer",
    feature2: "Zugriff auf alle 38 KI-Modelle",
    feature3: "Unzensierte Modelle, die keine Antwort verweigern",
    feature4: "Private, Inkognito-, Geteilte und Öffentliche Chat-Modi",
    feature5: "Community-Forum mit anderen KI-Enthusiasten",
    needMore: "Bereit für unbegrenzte Gespräche?",
    needMoreDesc:
      "Hol dir 40× mehr Credits – 800/Monat für nur 8 €! Das ist unbegrenzter Zugang zu allen 38 Modellen ohne tägliche Limits. Perfekt für ernsthafte KI-Nutzer. Plus: Abonniere und schalte die Möglichkeit frei, Credit-Pakete zu kaufen, die niemals ablaufen – ideal für Power-User, die zusätzliche Credits auf Abruf brauchen.",
    viewPlans: "Jetzt auf Unlimited upgraden",
    signoff: "Willkommen in der Zukunft der KI-Gespräche,\nDas {{appName}} Team",
    ps: "P.S. Deine Privatsphäre ist uns wichtig. Wähle den Inkognito-Modus, um Gespräche nur auf deinem Gerät zu speichern – sie werden niemals an unsere Server gesendet.",
  },
};
