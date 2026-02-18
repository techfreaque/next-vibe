import { translations as _componentsTranslations } from "../../_components/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  _components: _componentsTranslations,
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
        "Wie die KI dich in privaten Gesprächen ansprechen wird. Das bleibt zwischen dir und der KI – komplett privat.",
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
        "Deine Identität in öffentlichen Chats und Foren. Andere User und KIs werden diesen Namen sehen. Wähle weise – er repräsentiert dich in der Community.",
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
        "Deine Login-Zugangsdaten und Kontaktmethode. Bleibt privat – wird niemals mit anderen Usern oder KIs geteilt.",
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
        "Starke Passwörter schützen dein Konto. Wir implementieren bald Ende-zu-Ende-Verschlüsselung – ab diesem Zeitpunkt werden Passwort-Resets deinen Nachrichtenverlauf löschen, da nur du den Entschlüsselungsschlüssel besitzt. Speichere es also sicher ab.",
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
    },
  },
  form: {
    title: "Willkommen bei Uncensored AI",
    description:
      "Hilf mit, unzensierte, privatsphäre-orientierte und wirklich unabhängige KI aufzubauen. unbottled.ai ist Open Source und Community-getrieben – deine Registrierung unterstützt die Entwicklung von KI-Technologie, die deine Freiheit respektiert.",
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
      credits: "20 Credits pro Monat - keine Karte, kein Ablaufdatum",
      allModels: "Zugriff auf alle {{modelCount}} KI-Modelle",
      uncensored:
        "4 unzensierte Modelle, die deine Fragen wirklich beantworten",
      chatModes: "Private, Inkognito-, Geteilte und Öffentliche Chat-Modi",
      noCard: "Keine Kreditkarte erforderlich - niemals",
    },
    ctaButton: "Jetzt chatten",
    upgrade: {
      title: "Mehr haben?",
      desc: "8 €/Monat gibt dir 800 Credits - das ist 40× mehr. Dazu kannst du extra Credit-Pakete kaufen, die niemals ablaufen. Perfekt für tägliche KI-Nutzung.",
      cta: "Unlimited Plan ansehen",
    },
    signoff: "Viel Spaß beim Chatten,\nDas {{appName}} Team",
    ps: "P.S. Nutze den Inkognito-Modus, um Gespräche nur auf deinem Gerät zu behalten – wir speichern sie niemals auf unseren Servern.",
  },
};
