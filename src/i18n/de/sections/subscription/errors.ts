import type { errorsTranslations as EnglishErrorsTranslations } from "../../../en/sections/subscription/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  fetch_by_user_id_failed:
    "Abrufen der Abonnementdaten für Benutzer fehlgeschlagen: {{userId}}: {{error}}",
  create_failed:
    "Erstellen des Abonnements für Benutzer fehlgeschlagen: {{userId}}: Kein Wert aus der Datenbank zurückgegeben",
  create_crashed:
    "Erstellen des Abonnements für Benutzer fehlgeschlagen: {{userId}}: {{error}}",
  update_failed:
    "Aktualisieren des Abonnements für Benutzer fehlgeschlagen: {{userId}}: Kein Wert aus der Datenbank zurückgegeben",
  activate_failed:
    "Aktivieren des Abonnements fehlgeschlagen: Benutzer: {{userId}}, Plan: {{planId}}: Kein Wert aus der Datenbank zurückgegeben",
  activate_crashed:
    "Aktivieren des Abonnements fehlgeschlagen: Benutzer: {{userId}}, Plan: {{planId}}: {{error}}",
  cancel_failed: "Kündigen des Abonnements fehlgeschlagen: {{error}}",
  validation_error: "Ungültige Abonnementdaten: {{error}}",
  not_found: "Abonnement nicht gefunden",
  user_not_found: "Benutzer nicht gefunden",
  invalid_plan: "Ungültiger Abonnementplan",
  database_error: "Datenbankfehler bei der Abonnementverarbeitung: {{error}}",
  checkout_session_creation_failed:
    "Erstellen der Checkout-Sitzung für Abonnement fehlgeschlagen",
  stripe_customer_creation_failed:
    "Erstellen des Stripe-Kunden fehlgeschlagen: {{error}}",
  sync_failed:
    "Synchronisierung des Abonnements mit Stripe fehlgeschlagen: {{error}}",
};
