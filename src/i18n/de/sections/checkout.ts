import type { checkoutTranslations as EnglishCheckoutTranslations } from "../../en/sections/checkout";

export const translations: typeof EnglishCheckoutTranslations = {
  orderSummary: "Bestellübersicht",
  plan: "Tarif",
  total: "Gesamt",
  error: {
    title: "Checkout-Fehler",
    stripe_load_failed: "Fehler beim Laden des Stripe-Zahlungsanbieters",
    general:
      "Ein Fehler ist beim Checkout aufgetreten. Bitte versuchen Sie es später erneut.",
    description:
      "Ein Fehler ist beim Checkout aufgetreten. Bitte versuchen Sie es später erneut.",
    missing_required_parameters: "Erforderliche Parameter fehlen",
    invalid_checkout_data: "Ungültige Checkout-Daten",
    stripe_customer_creation_failed: "Fehler beim Erstellen des Stripe-Kunden",
    stripe_session_creation_failed:
      "Fehler beim Erstellen der Stripe-Checkout-Session",
    checkout_session_creation_failed:
      "Fehler beim Erstellen der Checkout-Session",
  },
  validation: {
    name_required: "Name ist erforderlich",
    email_invalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
    address_required: "Adresse ist erforderlich",
    city_required: "Stadt ist erforderlich",
    postal_code_required: "Postleitzahl ist erforderlich",
    country_required: "Land ist erforderlich",
    plan_invalid: "Ungültiger Abonnement-Tarif",
    user_id_invalid: "Ungültige Benutzer-ID",
    currency_invalid: "Ungültige Währung",
  },
  success: {
    created: "Checkout-Session erfolgreich erstellt",
    payment_processed: "Zahlung erfolgreich verarbeitet",
    title: "Zahlung erfolgreich",
    redirecting: "Weiterleitung zur Checkout-Seite...",
  },
  verification: {
    success: {
      title: "Zahlung verifiziert",
      description: "Ihre Zahlung wurde erfolgreich verifiziert",
    },
    error: {
      title: "Zahlungsverifizierung fehlgeschlagen",
      description:
        "Es gab einen Fehler bei der Verifizierung Ihrer Zahlung. Bitte versuchen Sie es erneut.",
    },
  },
  errors: {
    fetch_by_id_failed: "Fehler beim Abrufen der Checkout-Session",
    fetch_by_user_id_failed:
      "Fehler beim Abrufen der Checkout-Sessions für Benutzer",
    create_failed: "Fehler beim Erstellen der Checkout-Session",
    update_failed: "Fehler beim Aktualisieren der Checkout-Session",
  },
};
