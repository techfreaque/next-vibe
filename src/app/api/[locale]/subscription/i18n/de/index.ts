import { translations as checkoutTranslations } from "../../../payment/checkout/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Import checkout translations
  checkout: checkoutTranslations,

  // Main subscription domain
  category: "Abonnement",

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
    description: "Aktuelle Abonnement-Details abrufen",
    form: {
      title: "Abonnement-Details",
      description: "Ihre aktuellen Abonnement-Informationen anzeigen",
    },
  },

  // POST endpoint
  post: {
    title: "Abonnement erstellen",
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
    success: {
      title: "Abonnement aktualisiert",
      description: "Ihr Abonnement wurde erfolgreich aktualisiert",
    },
  },

  // DELETE endpoint
  delete: {
    title: "Abonnement kündigen",
    description: "Ihr Abonnement kündigen",
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
    database_error: "Datenbankfehler aufgetreten",
    create_crashed: "Erstellung des Abonnements fehlgeschlagen",
    cancel_failed: "Kündigung des Abonnements fehlgeschlagen",
    user_not_found: "Benutzer nicht gefunden",
    stripe_customer_creation_failed:
      "Stripe-Kunde konnte nicht erstellt werden",
    not_implemented_on_native:
      "{{method}} ist auf der nativen Plattform nicht implementiert. Bitte verwenden Sie die Web-Version für diesen Vorgang.",
    no_provider_id: "Keine Zahlungsanbieter-ID gefunden",
  },

  sync: {
    failed: "Synchronisierung des Abonnements fehlgeschlagen",
    stripe_error: "Stripe-Synchronisierungsfehler",
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
      title: "Willkommen bei {{planName}}, {{firstName}}!",
      subject: "Dein {{appName}} Abo ist aktiv - Unbegrenzte KI wartet",
      previewText:
        "Dein {{planName}} Abo ist jetzt aktiv! Genieße unbegrenzten Zugriff auf 38 KI-Modelle.",
      welcomeMessage: "Dein {{planName}} Abo ist jetzt aktiv!",
      description:
        "Danke fürs Upgrade auf {{appName}}! Du hast jetzt vollen Zugriff auf alle 38 KI-Modelle ohne tägliche Limits. Starte jetzt Gespräche mit Claude Sonnet 4.5, GPT-5.2 Pro, Gemini 3 Pro und allen unseren unzensierten Modellen ohne Einschränkungen.",
      nextSteps: {
        title: "Alles bereit!",
        description:
          "Dein Abo ist aktiv und einsatzbereit. Spring direkt rein und entdecke unbegrenzte KI-Gespräche.",
        cta: "Jetzt mit dem Chatten beginnen",
      },
      support: {
        title: "Brauchst du Hilfe?",
        description:
          "Unser Support-Team steht dir bei allen Fragen zu deinem Abo zur Verfügung.",
        cta: "Hilfe erhalten",
      },
      footer: {
        message: "Danke, dass du unzensierte KI unterstützt!",
        signoff:
          "Willkommen bei unbegrenzten Gesprächen,\nDas {{appName}} Team",
      },
    },
    admin_notification: {
      title: "Neues Abonnement",
      subject: "Neues Abonnement - {{planName}}",
      preview: "Neues Abo: {{firstName}} hat {{planName}} abonniert",
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

  // Enum translations
  enums: {
    plan: {
      subscription: "Abonnement",
      starter: "Starter",
      professional: "Professional",
      premium: "Premium",
      enterprise: "Enterprise",
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
