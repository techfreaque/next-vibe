import type { errorsTranslations as EnglishErrorsTranslations } from "../../../en/sections/orders/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  failed_to_get_user_roles: "Nie udało się pobrać ról użytkownika",
  failed_to_get_orders: "Nie udało się pobrać zamówień",
  failed_to_create: "Nie udało się utworzyć zamówienia",
  failed_to_update: "Nie udało się zaktualizować zamówienia",
  failed_to_update_total: "Nie udało się zaktualizować sumy zamówienia",
  failed_to_delete: "Nie udało się usunąć zamówienia",
  unknown: "Wystąpił nieznany błąd",
  not_found: "Zamówienie nie zostało znalezione",
  invalid_data: "Nieprawidłowe dane zamówienia",
  unauthorized: "Nie masz uprawnień do wykonania tej akcji",
};
