import type { errorsTranslations as EnglishErrorsTranslations } from "../../../en/sections/newsletter/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  subscription_failed: "Nie udało się zasubskrybować newslettera",
  email_already_exists: "Ten e-mail już subskrybuje nasz newsletter",
  invalid_email: "Podaj prawidłowy adres e-mail",
  database_error:
    "Wystąpił błąd bazy danych podczas przetwarzania Twojego żądania",
  unsubscribe_failed: "Nie udało się wypisać z newslettera",
  preferences_update_failed:
    "Nie udało się zaktualizować preferencji newslettera",
  campaign_creation_failed: "Nie udało się utworzyć kampanii newslettera",
  campaign_sending_failed: "Nie udało się wysłać kampanii newslettera",
  confirmation_failed: "Nie udało się potwierdzić subskrypcji newslettera",
  confirmation_token_invalid:
    "Token potwierdzenia jest nieprawidłowy lub wygasł",
  email_generation_failed: "Nie udało się wygenerować e-maila",
  subscription_not_found:
    "Nie mogliśmy znaleźć subskrypcji newslettera dla tego e-maila",
  subscription_check_failed:
    "Nie udało się sprawdzić statusu subskrypcji newslettera",
  already_subscribed: "Ten e-mail już subskrybuje nasz newsletter",
  status_check_failed:
    "Nie udało się sprawdzić statusu subskrypcji newslettera",
};
