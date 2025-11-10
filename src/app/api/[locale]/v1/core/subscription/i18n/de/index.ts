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
  },

  // DELETE endpoint
  delete: {
    title: "Abonnement kündigen",
    description: "Ihr Abonnement kündigen",
    form: {
      title: "Abonnement-Kündigung",
      description: "Ihr Abonnement mit optionalen Einstellungen kündigen",
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
    trialStart: "Testphase Start",
    trialEnd: "Testphase Ende",
    success: "Vorgang erfolgreich",
    message: "Statusmeldung",
    subscriptionId: "Abonnement-ID",
    stripeCustomerId: "Stripe-Kunden-ID",
    updatedFields: "Aktualisierte Felder",
    canceledAt: "Gekündigt am",
    endsAt: "Endet am",
    createdAt: "Erstellt am",
    updatedAt: "Aktualisiert am",
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
      title: "Abonnement erfolgreich!",
      subject: "Willkommen zu Ihrem Abonnement!",
      previewText: "Willkommen zu Ihrem neuen Abonnement",
      welcomeMessage: "Willkommen zu Ihrem Abonnement!",
      description: "Vielen Dank für Ihr Abonnement bei {{appName}}",
      nextSteps: {
        title: "Nächste Schritte",
        description: "Das können Sie als Nächstes tun",
        cta: "Jetzt starten",
      },
      support: {
        title: "Benötigen Sie Hilfe?",
        description: "Unser Support-Team hilft Ihnen gerne weiter",
        cta: "Support kontaktieren",
      },
      footer: {
        message: "Vielen Dank, dass Sie sich für uns entschieden haben!",
        signoff: "Mit freundlichen Grüßen, Das Team",
      },
    },
    admin_notification: {
      title: "Neues Abonnement",
      subject: "Neues Abonnement - Admin-Benachrichtigung",
      preview: "Ein neues Abonnement wurde erstellt",
      message: "Ein neues Abonnement wurde erstellt",
      details: "Abonnement-Details",
      user_name: "Benutzername",
      user_email: "Benutzer-E-Mail",
      plan: "Plan",
      status: "Status",
      contact_user: "Benutzer kontaktieren",
      footer: "Dies ist eine automatische Benachrichtigung",
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
};
