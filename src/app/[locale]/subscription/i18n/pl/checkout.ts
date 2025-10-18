import type { translations as EnglishCheckoutTranslations } from "../../en/checkout";

export const translations: typeof EnglishCheckoutTranslations = {
  orderSummary: "Podsumowanie Zamówienia",
  plan: "Plan",
  total: "Razem",
  error: {
    title: "Błąd Płatności",
    stripe_load_failed: "Nie udało się załadować dostawcy płatności Stripe",
    general: "Wystąpił błąd podczas płatności. Spróbuj ponownie później.",
    description: "Wystąpił błąd podczas płatności. Spróbuj ponownie później.",
    missing_required_parameters: "Brakuje wymaganych parametrów",
    invalid_checkout_data: "Nieprawidłowe dane płatności",
    stripe_customer_creation_failed: "Nie udało się utworzyć klienta Stripe",
    stripe_session_creation_failed:
      "Nie udało się utworzyć sesji płatności Stripe",
    checkout_session_creation_failed: "Nie udało się utworzyć sesji płatności",
  },
  validation: {
    name_required: "Imię jest wymagane",
    email_invalid: "Wprowadź prawidłowy adres e-mail",
    address_required: "Adres jest wymagany",
    city_required: "Miasto jest wymagane",
    postal_code_required: "Kod pocztowy jest wymagany",
    country_required: "Kraj jest wymagany",
    plan_invalid: "Nieprawidłowy plan subskrypcji",
    user_id_invalid: "Nieprawidłowy ID użytkownika",
    currency_invalid: "Nieprawidłowa waluta",
  },
  success: {
    created: "Sesja płatności utworzona pomyślnie",
    payment_processed: "Płatność przetworzona pomyślnie",
    title: "Płatność Pomyślna",
    redirecting: "Przekierowywanie do strony płatności...",
  },
  verification: {
    success: {
      title: "Płatność Zweryfikowana",
      description: "Twoja płatność została pomyślnie zweryfikowana",
    },
    error: {
      title: "Weryfikacja Płatności Nie Powiodła Się",
      description:
        "Wystąpił błąd podczas weryfikacji Twojej płatności. Spróbuj ponownie.",
    },
  },
  errors: {
    fetch_by_id_failed: "Nie udało się pobrać sesji płatności",
    fetch_by_user_id_failed:
      "Nie udało się pobrać sesji płatności dla użytkownika",
    create_failed: "Nie udało się utworzyć sesji płatności",
    update_failed: "Nie udało się zaktualizować sesji płatności",
  },
};
