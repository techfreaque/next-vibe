import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Stripe CLI",
  titleShort: "Stripe CLI",
  description: "Stripe Webhooks lokal empfangen",
  category: "Payment Integration",
  tags: {
    stripe: "Stripe",
    cli: "Kommandozeile",
    webhook: "Webhook",
  },

  form: {
    title: "Stripe CLI",
    description: "Stripe Webhook-Events an deinen lokalen Server weiterleiten",
    fields: {
      port: {
        label: "Port",
        description: "Lokaler Port für Webhook-Weiterleitung (Standard: 3000)",
        placeholder: "3000",
      },
    },
  },

  status: {
    authenticated: "Authentifiziert und bereit",
    not_authenticated: "Nicht authentifiziert — führe 'stripe login' aus",
    not_installed: "Stripe CLI ist nicht installiert",
  },

  errors: {
    validation: {
      title: "Ungültige Konfiguration",
      description: "Stripe CLI-Konfiguration prüfen und erneut versuchen",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Verbindung zu Stripe fehlgeschlagen",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Keine Berechtigung für diese Operation",
    },
    forbidden: {
      title: "Zugriff verboten",
      description: "Diese Operation ist für dein Konto nicht erlaubt",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Stripe CLI ist nicht installiert",
    },
    serverError: {
      title: "Serverfehler",
      description: "Fehler beim Starten des Stripe Listeners",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description: "Es gibt nicht gespeicherte Konfigurationsänderungen",
    },
    conflict: {
      title: "Operationskonflikt",
      description: "Eine andere Stripe-Operation läuft bereits",
    },
    execution_failed: "Stripe CLI-Operation fehlgeschlagen",
    userNotFound: {
      title: "Benutzer nicht gefunden",
      description: "Der angegebene Benutzer wurde nicht gefunden",
    },
    customerCreationFailed: {
      title: "Kundenerstellung fehlgeschlagen",
      description: "Stripe-Kunde konnte nicht erstellt werden",
    },
    customerRetrievalFailed: {
      title: "Kundenabruf fehlgeschlagen",
      description: "Stripe-Kundeninformationen konnten nicht abgerufen werden",
    },
    checkoutCreationFailed: {
      title: "Checkout-Erstellung fehlgeschlagen",
      description: "Stripe-Checkout-Sitzung konnte nicht erstellt werden",
    },
    webhookVerificationFailed: {
      title: "Webhook-Verifizierung fehlgeschlagen",
      description: "Webhook-Signatur konnte nicht verifiziert werden",
    },
    subscriptionRetrievalFailed: {
      title: "Abonnement-Abruf fehlgeschlagen",
      description: "Abonnement konnte nicht von Stripe abgerufen werden",
    },
    subscriptionCancellationFailed: {
      title: "Abonnement-Kündigung fehlgeschlagen",
      description: "Abonnement konnte in Stripe nicht gekündigt werden",
    },
    priceCreationFailed: {
      title: "Preis-Erstellung fehlgeschlagen",
      description: "Preis konnte in Stripe nicht erstellt werden",
    },
    notConfigured: {
      title: "Stripe nicht konfiguriert",
      description: "STRIPE_SECRET_KEY in .env setzen",
    },
    stripeCliNotInstalled: "Stripe CLI ist nicht installiert",
    listenerFailed: "Stripe Webhook-Listener konnte nicht gestartet werden",
  },

  success: {
    title: "Listener gestartet",
    description: "Stripe CLI lauscht auf Webhooks",
  },
};
