import type { translations as EnglishErrorsTranslations } from "../../en/subscription/errors";

export const translations: typeof EnglishErrorsTranslations = {
  fetch_by_user_id_failed:
    "Nie udało się pobrać danych subskrypcji dla użytkownika: {{userId}}: {{error}}",
  create_failed:
    "Nie udało się utworzyć subskrypcji dla użytkownika: {{userId}}: Brak wartości zwróconej z bazy danych",
  create_crashed:
    "Nie udało się utworzyć subskrypcji dla użytkownika: {{userId}}: {{error}}",
  update_failed:
    "Nie udało się zaktualizować subskrypcji dla użytkownika: {{userId}}: Brak wartości zwróconej z bazy danych",
  activate_failed:
    "Nie udało się aktywować subskrypcji: użytkownik: {{userId}}, plan: {{planId}}: Brak wartości zwróconej z bazy danych",
  activate_crashed:
    "Nie udało się aktywować subskrypcji: użytkownik: {{userId}}, plan: {{planId}}: {{error}}",
  cancel_failed: "Nie udało się anulować subskrypcji: {{error}}",
  validation_error: "Nieprawidłowe dane subskrypcji: {{error}}",
  not_found: "Subskrypcja nie została znaleziona",
  user_not_found: "Użytkownik nie został znaleziony",
  invalid_plan: "Nieprawidłowy plan subskrypcji",
  database_error:
    "Błąd bazy danych podczas przetwarzania subskrypcji: {{error}}",
  checkout_session_creation_failed:
    "Nie udało się utworzyć sesji płatności dla subskrypcji",
  stripe_customer_creation_failed:
    "Nie udało się utworzyć klienta Stripe: {{error}}",
  sync_failed: "Nie udało się zsynchronizować subskrypcji ze Stripe: {{error}}",
};
