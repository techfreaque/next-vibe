import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  bounceSync: {
    title: "Unzustellbare Bestätigungsmails erfassen",
    description:
      "Das Systempostfach auf unzustellbare Bestätigungsmails prüfen.",
    marked: "Aktualisierte Registrierungen",
    result: "Aktualisierte Registrierungen: {{count}}",
    productionOnly: "Der Abgleich läuft nur im Produktivsystem.",
    mailboxUnavailable:
      "Das Systempostfach konnte nicht auf unzustellbare Bestätigungsmails geprüft werden.",
  },
  events: {
    started: "Registrierung begonnen",
    emailSent: "Bestätigungsmail gesendet",
    sendFailed: "Bestätigungsmail fehlgeschlagen",
    bounced: "Bestätigungsmail unzustellbar",
    expired: "Bestätigung abgelaufen",
    confirmed: "E-Mail bestätigt",
    reminderSent: "Erinnerung gesendet",
  },
  reminder: {
    subject: "Dein unbottled.ai Konto ist einen Klick entfernt",
    hint: "Du hast die Registrierung begonnen, deine E-Mail aber nie bestätigt. Bestätige jetzt und erhalte jeden Monat {{credits}} Gratis-Credits. Code und Button gelten 24 Stunden und ersetzen die aus der ersten Mail.",
    button: "Bestätigen und anmelden",
    ignore:
      "Du hast dich nicht registriert? Dann ignoriere diese Mail. Ohne Klick wird kein Konto angelegt.",
  },
  confirmation: {
    bouncedTitle: "Die Bestätigungsmail kam nicht an",
    changeAddress: "E-Mail-Adresse ändern",
    description:
      "Schließe die Registrierung mit dem Code oder Link aus deiner E-Mail ab.",
    title: "Schau in dein Postfach",
    sent: "Gib den Code ein, den wir an {{email}} geschickt haben. Er gilt 30 Minuten.",
    code: "6-stelliger Code",
    confirm: "Bestätigen und anmelden",
    change: "Falsche Adresse? Jetzt ändern",
    resend: "Code erneut senden",
    countdown: "Neuer Code in {{seconds}} s",
    save: "An diese Adresse senden",
    cancel: "Abbrechen",
    email: "E-Mail-Adresse",
    hint: "Gib diesen Code ein oder öffne den Link unten, um dein Konto zu erstellen. Beides gilt 30 Minuten.",
    bounce:
      "Die Bestätigungsmail an {{email}} kam zurück. Korrigiere deine Adresse, um einen neuen Code zu erhalten.",
    invalid:
      "Code oder Link ist ungültig oder abgelaufen. Fordere einen neuen Code an.",
    cooldown:
      "Zu viele Anfragen. Warte bitte, bevor du einen neuen Code anforderst.",
    domain: "Diese Domain kann keine E-Mails empfangen. Prüfe die Adresse.",
    bouncePolicy:
      "Dein E-Mail-Anbieter hat unsere Nachricht blockiert. Schulen und Arbeitgeber lassen oft keine E-Mails von außen zu. Verwende eine andere Adresse.",
    bounceMailboxMissing:
      "Laut deinem E-Mail-Anbieter gibt es {{email}} nicht. Prüfe die Schreibweise oder verwende eine andere Adresse.",
    bounceMailboxFull:
      "Das Postfach für {{email}} ist voll. Schaffe Platz und fordere einen neuen Code an oder verwende eine andere Adresse.",
    sendFailed:
      "Wir konnten die E-Mail an {{email}} nicht senden. Prüfe die Adresse oder versuche es erneut.",
    done: "E-Mail bestätigt. Du bist angemeldet.",
    newsletter: "Damit bestätigst du auch deine Anmeldung zum Newsletter.",
    link: "E-Mail-Adresse bestätigen",
    pendingId: "Registrierungskennung",
    token: "Token aus dem Bestätigungslink",
    callback: "Rücksprungpfad",
    suggestion: "Meintest du {{email}}?",
    expired:
      "Diese Registrierung ist abgelaufen. Starte sie erneut, um einen neuen Code zu erhalten.",
    retry: "Registrierung neu starten",
  },
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
  titleShort: "Registrieren",
  description: "Endpunkt zur Benutzerregistrierung",
  tag: "Authentifizierung",
  actions: {
    submit: "Bestätigungscode senden",
    submitting: "Code wird gesendet…",
  },
  fields: {
    privateName: {
      label: "Privater Name",
      description: "So spricht dich die KI an. Sieht sonst niemand.",
      placeholder: "z. B. Alex",
      validation: {
        required: "Privater Name ist erforderlich",
        minLength: "Name muss mindestens 2 Zeichen lang sein",
        maxLength: "Name darf nicht länger als 100 Zeichen sein",
      },
    },
    publicName: {
      label: "Öffentlicher Name",
      description: "Sichtbar in geteilten Chats und Foren.",
      placeholder: "z. B. alex_baut",
      validation: {
        required: "Anzeigename ist erforderlich",
        minLength: "Anzeigename muss mindestens 2 Zeichen lang sein",
        maxLength: "Anzeigename darf nicht länger als 100 Zeichen sein",
      },
    },
    email: {
      label: "E-Mail",
      description: "Nur für den Login. Wird nie geteilt.",
      placeholder: "du@beispiel.de",
      help: "Dies wird deine Login-E-Mail und primäre Kontaktmethode sein",
      validation: {
        required: "E-Mail ist erforderlich",
        invalid: "Bitte gib eine gültige E-Mail-Adresse ein",
      },
    },
    password: {
      label: "Passwort",
      description:
        "Mindestens 8 Zeichen mit Groß-, Kleinbuchstaben und Zahl. Gut aufbewahren: Ende-zu-Ende-Verschlüsselung kommt, ein Reset löscht dann deinen Verlauf.",
      placeholder: "Passwort festlegen",
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
      label: "Ich akzeptiere die Bedingungen",
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
      label: "Newsletter abonnieren für monatliche Bonus-Credits",
      description:
        "Mit der E-Mail-Bestätigung wird auch dein monatlicher Newsletter-Bonus aktiv.",
      checkboxLabel:
        "Newsletter abonnieren: +{{credits}} Gratis-Credits jeden Monat",
      hint: "Alle paar Wochen neue Modelle und Produktnews. Jederzeit abbestellbar.",
      tooltip:
        "Bestätige deine Adresse und du erhältst monatlich {{credits}} zusätzliche Credits, insgesamt {{total}}, solange du den Newsletter abonniert hast.",
    },

    referralCode: {
      label: "Empfehlungscode (optional)",
      description: "Code von Freunden? Sie verdienen mit, wenn du abonnierst.",
      placeholder: "Code eingeben",
      labelPrefilled: "Empfehlungscode",
      subscriptionBonus: "+{{credits}} Bonus-Credits mit deinem ersten Abo.",
      descriptionPrefilled:
        "Dein Freund wird belohnt, wenn du ein Konto erstellst.",
      validation: {
        invalid:
          "Diesen Empfehlungscode gibt es nicht oder er ist nicht mehr aktiv. Korrigiere ihn oder leere das Feld.",
      },
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
    title: "Konto erstellen",
    description: "Jedes Modell. Deine Regeln. Kostenlos starten.",
  },
  footer: {
    alreadyHaveAccount: "Schon ein Konto? Anmelden",
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
      detail:
        "Für diese E-Mail-Adresse besteht bereits ein Konto. Melden Sie sich stattdessen an.",
    },
    disposableEmail: {
      title: "Dauerhafte E-Mail erforderlich",
      detail:
        "Wegwerf-Postfächer sind ausgeschlossen. Nutzen Sie eine dauerhafte E-Mail-Adresse.",
    },
    subnetSignupLimit: {
      title: "Zu viele Registrierungen aus Ihrem Netzwerk",
      detail:
        "Aus Ihrem Netzwerk wurden heute bereits zu viele Konten angelegt. Versuchen Sie es morgen erneut oder melden Sie sich mit einem bestehenden Konto an.",
    },
    userNotFound: "Kein Konto für {{email}} gefunden",
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
    autoLoginFailed:
      "Konto erstellt, aber die automatische Anmeldung ist fehlgeschlagen. Melde dich mit deinem neuen Passwort an.",
    internal: {
      title: "Registrierung für {{email}} fehlgeschlagen: {{error}}",
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
        title: "Prüfung von {{email}} fehlgeschlagen: {{error}}",
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
    title: "Schau in dein Postfach",
    description: "Gib den Code aus deiner Bestätigungsmail ein.",
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
    subject: "Du bist dabei. {{appName}} wartet auf dich",
    previewText:
      "Hey {{privateName}}, dein Account ist bereit. Chatte mit Claude, GPT, Gemini, DeepSeek und {{modelCount}} weiteren. Kostenlos, ohne Kreditkarte.",
    headline: "Deine KI wartet.",
    greeting: "Hey {{privateName}},",
    intro:
      "Willkommen bei {{appName}}. Alles, was du an ChatGPT magst, dazu Open-Source-Modelle und Modelle ohne Inhaltsfilter. Ein Konto, ein Ort.",
    models: {
      title: "{{modelCount}} Modelle in 3 Kategorien",
      mainstream: "Mainstream",
      open: "Open Source",
      uncensored: "Unzensiert",
    },
    free: {
      title: "Was du kostenlos bekommst, für immer:",
      credits:
        "{{freeCreditsSignedIn}} Gratis-Credits jeden Monat, +{{freeCreditsNewsletterBonus}} mit dem Newsletter. Keine Karte nötig",
      allModels: "Zugriff auf alle {{modelCount}} KI-Modelle",
      uncensored: "Unzensierte Modelle, die deine Fragen wirklich beantworten",
      chatModes: "Private, Inkognito-, Geteilte und Öffentliche Chat-Modi",
      noCard: "Keine Kreditkarte nötig. Niemals.",
    },
    verify: {
      note: "Deine Gratis-Credits starten, sobald du diese Adresse bestätigst.",
      cta: "E-Mail bestätigen, {{freeCreditsSignedIn}} Credits holen",
    },
    ctaButton: "Jetzt chatten",
    upgrade: {
      title: "Mehr haben?",
      desc: "Tarife ab {{subscriptionPrice}}/Monat für {{subscriptionCredits}} Credits, bis hoch zu {{ultraCredits}} Credits für {{ultraPrice}}. Abonnenten stocken mit Paketen auf, die nie verfallen.",
      cta: "Tarife ansehen",
    },
    signoff: "Viel Spaß beim Chatten,\nDas {{appName}} Team",
    ps: "P.S. Nutze den Inkognito-Modus, um Gespräche nur auf deinem Gerät zu behalten. Wir speichern sie niemals auf unseren Servern (generierte Medien speichern wir aus technischen Gründen vorübergehend).",
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
};
