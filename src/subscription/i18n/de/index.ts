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
          description: "Wähl aus, wie du bezahlen willst",
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
        description: "Du hast nicht gespeicherte Änderungen",
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
          description: "Du hast schon ein aktives Abo",
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
          description: "Du hast nicht gespeicherte Änderungen",
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
      description: "Deine aktuellen Abo-Infos ansehen",
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
        description: "Prüf deine Abo-Angaben und versuch es noch mal",
      },
      network: {
        title: "Verbindungsfehler",
        description: "Keine Verbindung. Prüf deine Internetverbindung",
      },
      unauthorized: {
        title: "Anmeldung erforderlich",
        description: "Melde dich an, um ein Abo abzuschließen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Du hast keine Berechtigung, ein Abo abzuschließen",
      },
      notFound: {
        title: "Plan nicht gefunden",
        description:
          "Der ausgewählte Abonnement-Plan konnte nicht gefunden werden",
      },
      server: {
        title: "Ein Fehler ist aufgetreten",
        description:
          "Dein Abo konnte nicht angelegt werden. Versuch es noch mal",
      },
      unknown: {
        title: "Unerwarteter Fehler",
        description: "Etwas ist schiefgelaufen. Versuch es noch mal",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Du hast Änderungen, die noch nicht gespeichert sind",
      },
      conflict: {
        title: "Abonnement existiert bereits",
        description: "Du hast schon ein aktives Abo",
      },
    },
    success: {
      title: "Abonnement erstellt",
      description: "Dein Abo ist aktiv",
    },
  },

  // PUT endpoint
  put: {
    title: "Abonnement aktualisieren",
    titleShort: "Abo ändern",
    description: "Vorhandenes Abonnement aktualisieren",
    form: {
      title: "Abonnement-Update",
      description: "Plan oder Abrechnungsintervall deines Abos ändern",
    },
    errors: {
      validation: {
        title: "Ungültige Aktualisierung",
        description: "Prüf deine Änderungen und versuch es noch mal",
      },
      network: {
        title: "Verbindungsfehler",
        description:
          "Deine Änderungen konnten nicht gespeichert werden. Versuch es noch mal",
      },
      unauthorized: {
        title: "Anmeldung erforderlich",
        description: "Melde dich an, um dein Abo zu ändern",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Du hast keine Berechtigung, dieses Abo zu ändern",
      },
      notFound: {
        title: "Abonnement nicht gefunden",
        description: "Wir finden dein Abo nicht",
      },
      server: {
        title: "Aktualisierung fehlgeschlagen",
        description:
          "Deine Änderungen konnten nicht gespeichert werden. Versuch es noch mal",
      },
      unknown: {
        title: "Unerwarteter Fehler",
        description: "Etwas ist schiefgelaufen. Versuch es noch mal",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Du hast Änderungen, die noch nicht gespeichert sind",
      },
      conflict: {
        title: "Aktualisierungskonflikt",
        description:
          "Dein Abo hat sich inzwischen geändert. Lad die Seite neu und versuch es noch mal",
      },
    },
    submit: {
      label: "Abonnement aktualisieren",
      loading: "Aktualisierung...",
    },
    success: {
      title: "Abonnement aktualisiert",
      description: "Dein Abo ist aktualisiert",
    },
  },

  // DELETE endpoint
  delete: {
    title: "Abonnement kündigen",
    titleShort: "Abo kündigen",
    description: "Dein Abo kündigen",
    warning:
      "Kündigst du, bleibt dein Zugang bis zum Ende des Abrechnungszeitraums bestehen und endet dann.",
    form: {
      title: "Abonnement-Kündigung",
      description: "Dein Abo kündigen, mit optionalen Einstellungen",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Prüf deine Angaben zur Kündigung und versuch es noch mal",
      },
      network: {
        title: "Verbindungsfehler",
        description: "Die Kündigung ging nicht durch. Versuch es noch mal",
      },
      unauthorized: {
        title: "Anmeldung erforderlich",
        description: "Melde dich an, um dein Abo zu kündigen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Du hast keine Berechtigung, dieses Abo zu kündigen",
      },
      notFound: {
        title: "Abonnement nicht gefunden",
        description: "Wir finden dein Abo nicht",
      },
      server: {
        title: "Kündigung fehlgeschlagen",
        description:
          "Dein Abo konnte nicht gekündigt werden. Versuch es noch mal",
      },
      unknown: {
        title: "Unerwarteter Fehler",
        description: "Etwas ist schiefgelaufen. Versuch es noch mal",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Du hast Änderungen, die noch nicht gespeichert sind",
      },
      conflict: {
        title: "Kündigungskonflikt",
        description:
          "Der Status deines Abos hat sich geändert. Lad die Seite neu und versuch es noch mal",
      },
    },
    submit: {
      label: "Abonnement kündigen",
      loading: "Kündigung...",
    },
    success: {
      title: "Abonnement gekündigt",
      description: "Dein Abo ist gekündigt",
    },
  },

  // Form fields
  form: {
    fields: {
      planId: {
        label: "Abonnement-Plan",
        description: "Wähl deinen Plan",
        placeholder: "Plan wählen",
      },
      billingInterval: {
        label: "Abrechnungsintervall",
        description: "Abrechnungshäufigkeit wählen",
        placeholder: "Abrechnungsintervall wählen",
      },
      provider: {
        label: "Zahlungsanbieter",
        description: "Wähl deinen Zahlungsanbieter",
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
        description: "Sag uns, warum du kündigst",
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
    gracePeriodEndsAt: "Kulanzfrist endet am",
    retryPaymentUrl: "URL für erneute Zahlung",
    cardCountry: "Kartenland",
    recentCardAuthFailure: "Kürzlich fehlgeschlagene Kartenbestätigung",
    checkoutProviders: "Verfügbare Zahlungsarten",
    nowPaymentsAcceptsCards: "Krypto-Checkout nimmt Karten",
    cryptoMinUsd: "Krypto-Mindestbetrag (USD)",
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
      description: "Du hast nicht gespeicherte Änderungen",
    },
    conflict: {
      title: "Konflikt",
      description: "Datenkonflikt aufgetreten",
    },
    use_checkout_flow: "Abos kaufst du über den Checkout",
    use_checkout_flow_description:
      "Abos lassen sich nicht direkt anlegen. Nutz den Checkout.",
    sync_failed:
      "Synchronisierung des Abonnements mit Datenbank fehlgeschlagen",
    database_error: "Datenbankfehler aufgetreten: {{error}}",
    create_crashed: "Erstellung des Abonnements fehlgeschlagen",
    cancel_failed: "Kündigung des Abonnements fehlgeschlagen: {{error}}",
    user_not_found: "Benutzer nicht gefunden",
    stripe_customer_creation_failed:
      "Stripe-Kunde konnte nicht erstellt werden",
    not_implemented_on_native:
      "{{method}} gibt es in der App noch nicht. Nutz dafür die Web-Version.",
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
      subject: "Neues Abonnement: {{planName}}",
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
  title: "Dein Abo",
  description: "Abo und Abrechnung verwalten",
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
      "Dein Abo endet am {{date}}. Bis dahin hast du vollen Zugriff.",
  },
  canceled: {
    title: "Abonnement beendet",
    description:
      "Dein Abo ist beendet. Schließ es neu ab, um wieder alles nutzen zu können.",
  },
  pastDue: {
    title: "Deine letzte Zahlung ist nicht durchgegangen",
    description:
      "Plan und Credits bleiben bis {{date}} aktiv. Bis dahin kannst du auch einmalig ein Credit-Paket kaufen, per Karte oder Krypto.",
    reason:
      "Oft hält die Bank die Zahlung zur Freigabe zurück (3D Secure oder OTP).",
    indiaMandate:
      "Deine Karte stammt aus Indien: Indische Banken erlauben wiederkehrende Kartenzahlungen nur mit freigegebenem E-Mandat, Beträge über 15.000 ₹ brauchen jedes Mal deinen OTP-Code. Achte vor jeder Verlängerung auf die SMS oder App-Meldung deiner Bank.",
    retry: "Zahlung freigeben oder neu versuchen",
    buyPack: "Mit Credit-Paket aufladen",
    payCrypto: "Mit Krypto zahlen",
  },
  checkoutTip: {
    title: "Karte will einen Code?",
    body: "Bestätige den OTP oder die 3D-Secure-Prüfung in deiner Banking-App oder per SMS und lass den Zahlungs-Tab offen, bis er bestätigt.",
    india:
      "Indische Karten: Internationale Online-Zahlungen sind oft ab Werk gesperrt. Schalte sie in deiner Banking-App frei (Kartensteuerung) und versuch es erneut.",
    other:
      "Klappt es weiter nicht? Nimm eine andere Karte oder zahl mit Krypto.",
  },
  noSubscription: {
    title: "Noch kein Abo",
    description:
      "Ein Abo bringt dir monatliche Credits und Zugriff auf alle Modelle.",
    cta: "Pläne ansehen",
  },
  manage: {
    nowpayments: {
      info: "Dein NowPayments-Abo verwaltest du über den Support. Schreib uns einfach.",
      button: "Abonnement verwalten",
    },
    stripe: {
      button: "Abonnement verwalten",
    },
    portal: {
      error: "Das Kundenportal ließ sich nicht öffnen. Versuch es noch mal.",
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
      whop: "Whop",
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
    secure: "Karte, PayPal, Apple Pay, Google Pay.",
    secureCard: "Zahlung per Karte, in Sekunden erledigt.",
    allPlans: "Alle Pläne und Krypto",
    moreOptions: "Krypto und weitere Optionen",
    error: "Checkout ließ sich nicht öffnen. Bitte erneut versuchen.",
  },
  tiers: {
    examples: {
      heading: "Was {{credits}} Credits im Monat bringen",
      subheading: "Nachrichten pro Monat mit ein paar beliebten Modellen.",
      perMessage: "ca. {{credits}} Credits pro Nachricht",
      messages: "ca. {{amount}} Nachrichten",
      note: "Geschätzt für eine typische Nachricht: {{input}} Tokens rein (dein bisheriger Chat) und {{output}} raus. Kurze Chats kosten weniger, lange Chats und Dateien mehr.",
    },
    faq: {
      heading: "Fragen vor dem Kauf",
      credit: {
        question: "Was ist ein Credit wert?",
        answer:
          "Ein Credit kostet {{unitPrice}}. Leichte Modelle brauchen weniger als einen Credit pro Nachricht, Top-Modelle ein paar. Die Beispiele oben rechnen mit den echten Modellpreisen.",
      },
      unused: {
        question: "Was passiert mit ungenutzten Credits?",
        answer:
          "Plan-Credits gelten für deinen Abrechnungsmonat und werden bei der Verlängerung neu aufgefüllt. Credit-Pakete verfallen nie.",
      },
      cancel: {
        question: "Kann ich kündigen?",
        answer:
          "Ja, jederzeit, direkt hier. Plan und Credits bleiben dir bis zum Ende des bezahlten Zeitraums.",
      },
      free: {
        question: "Was bleibt kostenlos?",
        answer:
          "Gäste bekommen {{freeCreditsGuest}} Credits im Monat. Ein kostenloses Konto bekommt {{freeCreditsSignedIn}}, mit bestätigtem Newsletter {{freeCreditsMax}}. Ohne Karte.",
      },
      api: {
        question: "Schaltet ein Plan die API frei?",
        answer:
          "Ja. Jeder Plan und jedes Credit-Paket schaltet API-Schlüssel für OpenAI- und Anthropic-kompatible Clients frei. Gratis-Credits nicht.",
      },
      pay: {
        question: "Wie kann ich bezahlen?",
        answer:
          "Mit Karte oder PayPal über Stripe oder mit Krypto über NOWPayments.",
      },
      more: "Mehr Antworten im Hilfe-Center",
    },
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
      cryptoAmountTooLow:
        "Der Betrag liegt unter dem Krypto-Minimum. Wähle jährliche Zahlung oder einen größeren Plan.",
    },
    login: "Anmelden",
    signup: "Kostenlos registrieren",
  },

  // Page metadata
  meta: {
    subscription: {
      title: "Abonnement",
      description: "Abo und Abrechnung verwalten",
    },
    buyCredits: {
      title: "Credits kaufen",
      description: "Zusätzliche Credits für dein Konto kaufen",
    },
    history: {
      title: "Abrechnungshistorie",
      description: "Deine Abrechnungen und Transaktionen ansehen",
    },
    overview: {
      title: "Abonnementübersicht",
      description: "Status und Details deines Abos ansehen",
    },
  },
};
