import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Import checkout translations
  checkout: {
    // Main checkout titles and descriptions
    title: "Abonnement-Checkout erstellen",
    description: "Eine Stripe-Checkout-Sitzung für Abonnements erstellen",
    category: "Abonnement",

    // Tags
    tags: {
      subscription: "abonnement",
      checkout: "checkout",
      stripe: "stripe",
    },

    // Form configuration
    form: {
      title: "Checkout-Konfiguration",
      description: "Checkout-Sitzungsparameter konfigurieren",
      fields: {
        planId: {
          label: "Abonnement-Plan",
          description: "Abonnement-Plan auswählen",
          placeholder: "Plan auswählen",
        },
        billingInterval: {
          label: "Abrechnungsintervall",
          description: "Abrechnungshäufigkeit auswählen",
          placeholder: "Abrechnungsintervall auswählen",
        },
        provider: {
          label: "Zahlungsanbieter",
          description: "Wählen Sie, wie Sie bezahlen möchten",
          placeholder: "Zahlungsanbieter auswählen",
        },
        metadata: {
          label: "Metadaten",
          description: "Zusätzliche Metadaten für die Checkout-Sitzung",
          placeholder: "Metadaten als JSON eingeben",
        },
      },
    },

    // Response fields
    response: {
      success: "Checkout-Sitzung erfolgreich erstellt",
      sessionId: "Stripe-Sitzungs-ID",
      checkoutUrl: "Checkout-URL",
      message: "Statusmeldung",
    },

    // Error types
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkverbindungsfehler",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      serverError: {
        title: "Serverfehler",
        description: "Interner Serverfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
    },

    // Success types
    success: {
      title: "Erfolg",
      description: "Checkout-Sitzung erfolgreich erstellt",
    },

    // POST endpoint specific translations
    post: {
      title: "Checkout-Sitzung erstellen",
      description: "Eine neue Abonnement-Checkout-Sitzung erstellen",
      form: {
        title: "Checkout-Sitzungs-Konfiguration",
        description: "Checkout-Sitzungsparameter konfigurieren",
      },
      response: {
        title: "Checkout-Antwort",
        description: "Checkout-Sitzungsantwortdaten",
      },
      errors: {
        alreadySubscribed: {
          title: "Bereits abonniert",
          description: "Sie haben bereits ein aktives Abonnement",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Checkout-Parameter",
          reason: {
            enterpriseCustomPricing:
              "ENTERPRISE-Plan erfordert individuelle Preisgestaltung",
          },
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkverbindungsfehler",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verboten",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Checkout-Sitzung nicht gefunden",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
        conflict: {
          title: "Konflikt",
          description: "Datenkonflikt aufgetreten",
        },
      },
      success: {
        title: "Erfolg",
        description: "Checkout-Sitzung erfolgreich erstellt",
      },
    },

    // General error message
    error: "Ein Fehler ist beim Checkout aufgetreten",

    // Subscription plan labels
    plans: {
      starter: {
        title: "Starter",
      },
    },

    // Billing interval labels
    billing: {
      monthly: "Monatlich",
      yearly: "Jährlich",
    },
  },

  // Main subscription domain
  category: "Abrechnung",

  // Tags
  tags: {
    subscription: "abonnement",
    billing: "abrechnung",
    get: "abrufen",
    create: "erstellen",
    update: "aktualisieren",
    cancel: "kündigen",
  },

  // Subscription plans
  plans: {
    starter: {
      title: "Starter-Plan",
    },
    professional: {
      title: "Professional-Plan",
    },
    premium: {
      title: "Premium-Plan",
    },
    enterprise: {
      title: "Enterprise-Plan",
    },
  },

  // Billing intervals
  billing: {
    monthly: "Monatlich",
    yearly: "Jährlich",
  },

  // GET endpoint
  get: {
    title: "Abonnement abrufen",
    titleShort: "Mein Abo",
    description: "Aktuelle Abonnement-Details abrufen",
    form: {
      title: "Abonnement-Details",
      description: "Ihre aktuellen Abonnement-Informationen anzeigen",
    },
  },

  // POST endpoint
  post: {
    title: "Abonnement erstellen",
    titleShort: "Checkout erstellen",
    description: "Ein neues Abonnement erstellen",
    form: {
      title: "Abonnement-Erstellung",
      description: "Ein neues Abonnement mit dem gewählten Plan erstellen",
    },
    errors: {
      validation: {
        title: "Ungültige Eingabe",
        description:
          "Bitte überprüfen Sie Ihre Abonnementdetails und versuchen Sie es erneut",
      },
      network: {
        title: "Verbindungsfehler",
        description:
          "Keine Verbindung möglich. Bitte überprüfen Sie Ihre Internetverbindung",
      },
      unauthorized: {
        title: "Anmeldung erforderlich",
        description: "Bitte melden Sie sich an, um ein Abonnement zu erstellen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description:
          "Sie haben keine Berechtigung, ein Abonnement zu erstellen",
      },
      notFound: {
        title: "Plan nicht gefunden",
        description:
          "Der ausgewählte Abonnement-Plan konnte nicht gefunden werden",
      },
      server: {
        title: "Ein Fehler ist aufgetreten",
        description:
          "Ihr Abonnement konnte nicht erstellt werden. Bitte versuchen Sie es erneut",
      },
      unknown: {
        title: "Unerwarteter Fehler",
        description:
          "Etwas Unerwartetes ist passiert. Bitte versuchen Sie es erneut",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben Änderungen, die noch nicht gespeichert wurden",
      },
      conflict: {
        title: "Abonnement existiert bereits",
        description: "Sie haben bereits ein aktives Abonnement",
      },
    },
    success: {
      title: "Abonnement erstellt",
      description: "Ihr Abonnement wurde erfolgreich aktiviert",
    },
  },

  // PUT endpoint
  put: {
    title: "Abonnement aktualisieren",
    titleShort: "Abo ändern",
    description: "Vorhandenes Abonnement aktualisieren",
    form: {
      title: "Abonnement-Update",
      description:
        "Ihren Abonnement-Plan oder das Abrechnungsintervall aktualisieren",
    },
    errors: {
      validation: {
        title: "Ungültige Aktualisierung",
        description:
          "Bitte überprüfen Sie Ihre Änderungen und versuchen Sie es erneut",
      },
      network: {
        title: "Verbindungsfehler",
        description:
          "Ihre Änderungen konnten nicht gespeichert werden. Bitte versuchen Sie es erneut",
      },
      unauthorized: {
        title: "Anmeldung erforderlich",
        description:
          "Bitte melden Sie sich an, um Ihr Abonnement zu aktualisieren",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description:
          "Sie haben keine Berechtigung, dieses Abonnement zu aktualisieren",
      },
      notFound: {
        title: "Abonnement nicht gefunden",
        description: "Wir konnten Ihr Abonnement nicht finden",
      },
      server: {
        title: "Aktualisierung fehlgeschlagen",
        description:
          "Ihre Änderungen konnten nicht gespeichert werden. Bitte versuchen Sie es erneut",
      },
      unknown: {
        title: "Unerwarteter Fehler",
        description:
          "Etwas Unerwartetes ist passiert. Bitte versuchen Sie es erneut",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben Änderungen, die noch nicht gespeichert wurden",
      },
      conflict: {
        title: "Aktualisierungskonflikt",
        description:
          "Ihr Abonnement hat sich geändert. Bitte aktualisieren Sie die Seite und versuchen Sie es erneut",
      },
    },
    submit: {
      label: "Abonnement aktualisieren",
      loading: "Aktualisierung...",
    },
    success: {
      title: "Abonnement aktualisiert",
      description: "Ihr Abonnement wurde erfolgreich aktualisiert",
    },
  },

  // DELETE endpoint
  delete: {
    title: "Abonnement kündigen",
    titleShort: "Abo kündigen",
    description: "Ihr Abonnement kündigen",
    warning:
      "Das Kündigen Ihres Abonnements beendet Ihren Zugang am Ende des Abrechnungszeitraums.",
    form: {
      title: "Abonnement-Kündigung",
      description: "Ihr Abonnement mit optionalen Einstellungen kündigen",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description:
          "Bitte überprüfen Sie Ihre Kündigungsdetails und versuchen Sie es erneut",
      },
      network: {
        title: "Verbindungsfehler",
        description:
          "Die Kündigung konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut",
      },
      unauthorized: {
        title: "Anmeldung erforderlich",
        description: "Bitte melden Sie sich an, um Ihr Abonnement zu kündigen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description:
          "Sie haben keine Berechtigung, dieses Abonnement zu kündigen",
      },
      notFound: {
        title: "Abonnement nicht gefunden",
        description: "Wir konnten Ihr Abonnement nicht finden",
      },
      server: {
        title: "Kündigung fehlgeschlagen",
        description:
          "Ihr Abonnement konnte nicht gekündigt werden. Bitte versuchen Sie es erneut",
      },
      unknown: {
        title: "Unerwarteter Fehler",
        description:
          "Etwas Unerwartetes ist passiert. Bitte versuchen Sie es erneut",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben Änderungen, die noch nicht gespeichert wurden",
      },
      conflict: {
        title: "Kündigungskonflikt",
        description:
          "Ihr Abonnementstatus hat sich geändert. Bitte aktualisieren Sie die Seite und versuchen Sie es erneut",
      },
    },
    submit: {
      label: "Abonnement kündigen",
      loading: "Kündigung...",
    },
    success: {
      title: "Abonnement gekündigt",
      description: "Ihr Abonnement wurde erfolgreich gekündigt",
    },
  },

  // Form fields
  form: {
    fields: {
      planId: {
        label: "Abonnement-Plan",
        description: "Wählen Sie Ihren Abonnement-Plan",
        placeholder: "Plan wählen",
      },
      billingInterval: {
        label: "Abrechnungsintervall",
        description: "Abrechnungshäufigkeit wählen",
        placeholder: "Abrechnungsintervall wählen",
      },
      provider: {
        label: "Zahlungsanbieter",
        description: "Wählen Sie Ihren Zahlungsanbieter",
      },
      catalogProductId: {
        label: "Katalogprodukt",
        description: "Dieses Abonnement mit einem Katalogprodukt verknüpfen",
      },
      cancelAtPeriodEnd: {
        label: "Am Periodenende kündigen",
        description: "Abonnement am Ende der aktuellen Periode kündigen",
      },
      reason: {
        label: "Kündigungsgrund",
        description: "Bitte geben Sie einen Grund für die Kündigung an",
        placeholder: "Kündigungsgrund eingeben",
      },
    },
  },

  // Response fields
  response: {
    checkoutUrl: "Checkout-URL",
    sessionId: "Session-ID",
    hasSubscription: "Abo vorhanden",
    id: "Abonnement-ID",
    userId: "Benutzer-ID",
    status: "Abonnement-Status",
    planId: "Plan-ID",
    billingInterval: "Abrechnungsintervall",
    currentPeriodStart: "Aktuelle Periode Start",
    currentPeriodEnd: "Aktuelle Periode Ende",
    cancelAtPeriodEnd: "Am Periodenende kündigen",
    cancelAt: "Kündigung am",
    canceledAt: "Gekündigt am",
    endedAt: "Beendet am",
    trialStart: "Testphase Start",
    trialEnd: "Testphase Ende",
    success: "Vorgang erfolgreich",
    message: "Statusmeldung",
    subscriptionId: "Abonnement-ID",
    stripeCustomerId: "Stripe-Kunden-ID",
    updatedFields: "Aktualisierte Felder",
    endsAt: "Endet am",
    createdAt: "Erstellt am",
    updatedAt: "Aktualisiert am",
    provider: "Zahlungsanbieter",
    providerSubscriptionId: "Anbieter-Abonnement-ID",
  },

  // Error types
  errors: {
    tierChange: {
      notActive:
        "Dein Plan ist nicht aktiv. Starte stattdessen einen neuen Plan.",
      cryptoNotSupported:
        "Krypto-Pläne lassen sich nicht mitten im Zeitraum wechseln. Wähle den neuen Plan, wenn dieser endet.",
      paymentRequired:
        "Deine Bank will das Upgrade bestätigen. Öffne die Rechnung, um es abzuschließen: {{url}}",
      failed: "Planwechsel fehlgeschlagen: {{error}}",
      upgraded:
        "Upgrade auf {{plan}}. {{credits}} zusätzliche Credits für diesen Zeitraum gutgeschrieben.",
      changed: "Gewechselt zu {{plan}}.",
      downgraded:
        "Wechsel zu {{plan}} ab der nächsten Verlängerung. Bis dahin behältst du deine Credits.",
      unchanged: "Du nutzt diesen Plan bereits.",
    },
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Abonnement-Parameter",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkverbindungsfehler",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Authentifizierung erforderlich",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Abonnement nicht gefunden",
    },
    not_found: "Abonnement nicht gefunden",
    not_found_description:
      "Das angeforderte Abonnement konnte nicht gefunden werden",
    server: {
      title: "Serverfehler",
      description: "Interner Serverfehler aufgetreten",
    },
    serverError: {
      title: "Serverfehler",
      description: "Interner Serverfehler aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description: "Sie haben nicht gespeicherte Änderungen",
    },
    conflict: {
      title: "Konflikt",
      description: "Datenkonflikt aufgetreten",
    },
    use_checkout_flow:
      "Bitte verwenden Sie den Checkout-Ablauf, um Abonnements zu kaufen",
    use_checkout_flow_description:
      "Die direkte Erstellung von Abonnements ist nicht erlaubt. Bitte nutzen Sie den Checkout-Prozess.",
    sync_failed:
      "Synchronisierung des Abonnements mit Datenbank fehlgeschlagen",
    database_error: "Datenbankfehler aufgetreten: {{error}}",
    create_crashed: "Erstellung des Abonnements fehlgeschlagen",
    cancel_failed: "Kündigung des Abonnements fehlgeschlagen: {{error}}",
    user_not_found: "Benutzer nicht gefunden",
    stripe_customer_creation_failed:
      "Stripe-Kunde konnte nicht erstellt werden",
    not_implemented_on_native:
      "{{method}} ist auf der nativen Plattform nicht implementiert. Bitte verwenden Sie die Web-Version für diesen Vorgang.",
    no_provider_id: "Keine Zahlungsanbieter-ID gefunden",
  },

  sync: {
    failed: "Synchronisierung des Abonnements fehlgeschlagen: {{error}}",
    stripe_error: "Stripe-Synchronisierungsfehler: {{error}}",
    success: "Abonnement erfolgreich synchronisiert",
  },

  // Cancel operation
  cancel: {
    success: "Abonnement erfolgreich gekündigt",
  },

  // Success types
  success: {
    title: "Erfolg",
    description: "Vorgang erfolgreich abgeschlossen",
  },

  // Status translations
  status: {
    incomplete: "Unvollständig",
    incomplete_expired: "Unvollständig abgelaufen",
    trialing: "Testphase",
    active: "Aktiv",
    pastDue: "Überfällig",
    canceled: "Gekündigt",
    unpaid: "Unbezahlt",
    paused: "Pausiert",
  },

  // Email translations
  email: {
    success: {
      headline: "Du bist dabei. Keine Filter, keine Belehrungen.",
      subject: "Dein {{appName}} Abo ist aktiv",
      previewText:
        "{{privateName}}, du bist live. {{subscriptionCredits}} Credits/Monat, {{modelCount}} Modelle, null Einschränkungen.",
      activeBadge: "Aktiv",
      greeting: "Hey {{privateName}},",
      intro:
        "Dein {{appName}} Abo ist bestätigt und bereit. Du hast jeden Monat {{subscriptionCredits}} Credits für alle Modelle. Keine Tageslimits, keine Inhaltsfilter, keine Erklärungen nötig.",
      models: {
        title: "{{modelCount}} Modelle, 3 Kategorien",
        mainstream: "Mainstream",
        open: "Open Source",
        uncensored: "Unzensiert",
      },
      included: {
        title: "Was du jeden Monat bekommst:",
        credits:
          "{{subscriptionCredits}} Credits pro Monat (automatisch erneuert)",
        models: "Zugriff auf alle {{modelCount}} KI-Modelle",
        nolimits: "Keine Tageslimits. Nutz deine Credits, wann du willst",
        uncensored: "Unzensierte Modelle ohne Inhaltsfilter",
        packs: "Extra Credit-Pakete kaufen, die niemals ablaufen",
        cancel: "Jederzeit kündbar, keine Fragen gestellt",
      },
      cta: "Jetzt Chatten",
      packs: {
        title: "Mehr Credits benötigt?",
        description:
          "Vor der Verlängerung knapp? Lad jederzeit auf: {{packPrice}} für {{packCredits}} Credits. Pakete verfallen nie und kommen zu deinen Monats-Credits obendrauf.",
        cta: "Credit-Paket kaufen",
      },
      manage: "Abo jederzeit verwalten oder kündigen in",
      manageLink: "deinen Kontoeinstellungen",
      signoff: "Viel Spaß beim Chatten,\nDas {{appName}} Team",
    },
    admin_notification: {
      title: "Neues Abonnement",
      subject: "Neues Abonnement - {{planName}}",
      preview: "Neues Abo: {{userName}} hat {{planName}} abonniert",
      message: "Ein neuer Nutzer hat {{appName}} abonniert.",
      details: "Abonnement-Details",
      user_name: "Benutzername",
      user_email: "Benutzer-E-Mail",
      plan: "Plan",
      status: "Status",
      contact_user: "Benutzer kontaktieren",
      footer: "Dies ist eine automatische Benachrichtigung von {{appName}}",
    },
  },

  // Email template metadata (for preview registry)
  emailTemplates: {
    success: {
      name: "Abonnement-Bestätigungs-E-Mail",
      description: "Bestätigungs-E-Mail bei Aktivierung eines Abonnements",
      category: "abonnement",
      preview: {
        privateName: {
          label: "Benutzername",
          description: "Der Anzeigename des Benutzers",
        },
        userId: {
          label: "Benutzer-ID",
          description: "Die eindeutige Kennung des Benutzers",
        },
        leadId: {
          label: "Lead-ID",
          description: "Die zugehörige Lead-Kennung",
        },
        planName: {
          label: "Plan-Name",
          description: "Der Name des Abonnementplans",
        },
      },
    },
    adminNotification: {
      name: "Admin-Abonnement-Benachrichtigung",
      description: "Interne Benachrichtigung an Admins bei neuen Abonnements",
      category: "admin",
      preview: {
        privateName: {
          label: "Benutzername",
        },
        publicName: {
          label: "Öffentlicher Name",
        },
        email: {
          label: "Benutzer-E-Mail",
        },
        planName: {
          label: "Plan-Name",
        },
        statusName: {
          label: "Abonnementstatus",
        },
      },
    },
  },

  // Widget-specific keys (cancel confirmation dialog, etc.)
  widget: {
    back: "Zurück",
    confirm: {
      title: "Abonnement wirklich kündigen?",
      description:
        "Der Zugriff endet am Ende des Abrechnungszeitraums. Dieser Schritt kann nicht rückgängig gemacht werden.",
      cancel: "Abonnement behalten",
      proceed: "Ja, kündigen",
    },
  },

  // Widget display keys
  title: "Ihr Abonnement",
  description: "Verwalten Sie Ihr Abonnement und Ihre Abrechnung",
  notAvailable: "N/A",
  canceledOn: "Gekündigt am",
  endedOn: "Beendet am",
  billingInterval: "Abrechnungsintervall",
  currentPeriodStart: "Aktuelle Periode Start",
  endsOn: "Endet am",
  nextBillingDate: "Nächster Abrechnungstermin",
  cancellation: {
    title: "Abonnementkündigung geplant",
    description:
      "Ihr Abonnement wird am {{date}} gekündigt. Bis dahin haben Sie weiterhin Zugriff.",
  },
  canceled: {
    title: "Abonnement beendet",
    description:
      "Ihr Abonnement wurde beendet. Erneuern Sie es, um wieder Zugriff auf alle Funktionen zu erhalten.",
  },
  noSubscription: {
    title: "Noch kein Abo",
    description:
      "Hol dir monatliche Credits und Zugriff auf alle Modelle - mit einem Abo.",
    cta: "Pläne ansehen",
  },
  manage: {
    nowpayments: {
      info: "Bitte kontaktieren Sie den Support, um Ihr NowPayments-Abonnement zu verwalten.",
      button: "Abonnement verwalten",
    },
    stripe: {
      button: "Abonnement verwalten",
    },
    portal: {
      error:
        "Kundenportal konnte nicht geöffnet werden. Bitte versuchen Sie es erneut.",
    },
  },

  // Enum translations
  enums: {
    plan: {
      subscription: "Starter",
      plus: "Plus",
      pro: "Pro",
      ultra: "Ultra",
    },
    status: {
      incomplete: "Unvollständig",
      incompleteExpired: "Unvollständig abgelaufen",
      trialing: "Testphase",
      active: "Aktiv",
      pastDue: "Überfällig",
      canceled: "Storniert",
      unpaid: "Unbezahlt",
      paused: "Pausiert",
      canceling: "Wird storniert",
    },
    billing: {
      monthly: "Monatlich",
      yearly: "Jährlich",
    },
    cancellation: {
      tooExpensive: "Zu teuer",
      missingFeatures: "Fehlende Funktionen",
      switchingService: "Service-Wechsel",
      temporaryPause: "Temporäre Pause",
      other: "Andere",
    },
    paymentProvider: {
      nowpayments: "NowPayments",
      stripe: "Stripe",
    },
  },

  // Buy / pricing page translations
  quickCheckout: {
    pack: {
      title: "{{credits}} Credits",
      note: "Einmal aufladen. Verfallen nie.",
      aria: "{{credits}} Credits für {{price}} kaufen, einmalig",
    },
    plan: {
      title: "{{credits}} Credits / Monat",
      note: "{{plan}}. Jederzeit kündbar.",
      perMonth: "/Monat",
      aria: "{{plan}} starten: {{credits}} Credits jeden Monat für {{price}}",
    },
    upgrade: {
      title: "Upgrade auf {{plan}}",
      note: "{{credits}} Credits / Monat",
      aria: "Upgrade auf {{plan}}: {{credits}} Credits jeden Monat für {{price}}",
      confirm:
        "Du zahlst jetzt die Differenz für den Rest dieses Zeitraums. Die zusätzlichen Credits sind sofort da.",
      confirmButton: "Jetzt upgraden",
      cancel: "Abbrechen",
      working: "Upgrade läuft...",
    },
    opening: "Checkout wird geöffnet...",
    secure: "Karte, PayPal, Apple Pay, Google Pay über Stripe.",
    allPlans: "Alle Pläne und Krypto",
    moreOptions: "Krypto und weitere Optionen",
    error: "Checkout ließ sich nicht öffnen. Bitte erneut versuchen.",
  },
  tiers: {
    heading: "Wähl deinen Plan",
    subheading:
      "Jeden Monat frische Credits für alle {{modelCount}} Modelle. Jederzeit kündbar.",
    changeHeading: "Plan wechseln",
    changeSubheading: "Du hast {{plan}}: {{credits}} Credits im Monat.",
    recommended: "Empfohlen",
    current: "Dein Plan",
    perMonth: "/ Monat",
    perYear: "/ Jahr",
    creditsPerMonth: "Credits / Monat",
    yearlyEquivalent: "{{monthlyPrice}} / Monat bei Jahreszahlung",
    picked: "{{plan}}: {{credits}} Credits jeden Monat",
    pickedNote:
      "Alle {{modelCount}} Modelle. Credits jeden Monat neu. Jederzeit kündbar.",
    cta: {
      start: "{{plan}} starten",
      upgrade: "Upgrade auf {{plan}}",
      downgrade: "Zur Verlängerung auf {{plan}} wechseln",
      intervalYearly: "Auf Jahreszahlung wechseln",
      intervalMonthly: "Zu {{plan}} monatlich wechseln",
      current: "Dein aktueller Plan",
    },
    signInHint: "Leg ein Gratis-Konto an, um einen Plan zu starten.",
    cryptoHint:
      "Mit Krypto zahlen? Plus, Pro und Ultra monatlich oder jährlich, Starter jährlich.",
    confirm: {
      upgradeTitle: "Upgrade auf {{plan}}?",
      upgradeBody:
        "Du zahlst jetzt die Differenz für den Rest dieses Zeitraums, die zusätzlichen Credits sind sofort da. Ab der nächsten Verlängerung: {{price}} im Monat für {{credits}} Credits.",
      upgradeButton: "Zahlen und upgraden",
      downgradeTitle: "Zu {{plan}} wechseln?",
      downgradeBody:
        "Gilt ab deiner nächsten Verlängerung am {{date}}. Bis dahin behältst du deinen Plan und deine Credits. Danach: {{price}} im Monat für {{credits}} Credits.",
      downgradeButton: "Zur Verlängerung wechseln",
      intervalTitle: "Abrechnung ändern?",
      intervalBody:
        "Dein Abrechnungszeitraum startet heute neu, Stripe verrechnet die Differenz anteilig. Neuer Plan: {{plan}}, {{price}}{{period}}, {{credits}} Credits im Monat.",
      intervalButton: "Abrechnung wechseln",
      cancel: "Jetzt nicht",
      working: "Wird gewechselt...",
    },
    packsLocked: {
      title: "Credit-Pakete: {{price}} für {{credits}} Credits",
      body: "Pakete laden einen aktiven Plan auf. Erst Plan starten, dann jederzeit nachladen. Sie verfallen nie.",
    },
    topUp: {
      heading: "Aufladen",
      subheading:
        "Vor der Verlängerung knapp? Pakete kommen auf deinen Plan obendrauf und verfallen nie.",
    },
  },
  buy: {
    provider: {
      stripe: "Karte, PayPal & Wallets",
      stripeDescription: "Karte, PayPal, Apple Pay, Google Pay über Stripe",
      nowpayments: "Krypto (NowPayments)",
      nowpaymentsDescription: "Mit Bitcoin, Ethereum u.v.m. bezahlen",
      cryptoMonthlyDisabled:
        "Starter mit Krypto nur jährlich. Plus, Pro und Ultra gehen mit Krypto auch monatlich.",
    },
    login: "Anmelden",
    signup: "Kostenlos registrieren",
  },

  // Page metadata
  meta: {
    subscription: {
      title: "Abonnement",
      description: "Verwalten Sie Ihr Abonnement und Ihre Abrechnung",
    },
    buyCredits: {
      title: "Credits kaufen",
      description: "Zusätzliche Credits für Ihr Konto erwerben",
    },
    history: {
      title: "Abrechnungshistorie",
      description: "Ihre Abrechnungs- und Transaktionshistorie anzeigen",
    },
    overview: {
      title: "Abonnementübersicht",
      description: "Ihren Abonnementstatus und Details anzeigen",
    },
  },
};
