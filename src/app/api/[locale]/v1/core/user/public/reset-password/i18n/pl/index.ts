import { translations as confirmTranslations } from "../../confirm/i18n/pl";
import { translations as requestTranslations } from "../../request/i18n/pl";
import { translations as validateTranslations } from "../../validate/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  confirm: confirmTranslations,
  request: requestTranslations,
  validate: validateTranslations,
  errors: {
    tokenValidationFailed: "Walidacja tokenu nie powiodła się",
    userLookupFailed: "Nie udało się znaleźć użytkownika",
    tokenDeletionFailed: "Nie udało się usunąć tokenu",
    userDeletionFailed: "Nie udało się usunąć użytkownika",
    resetFailed: "Resetowanie hasła nie powiodło się",
    tokenCreationFailed: "Nie udało się utworzyć tokenu resetowania",
    noDataReturned: "Brak danych zwróconych z bazy danych",
    tokenInvalid: "Token resetowania jest nieprawidłowy",
    tokenExpired: "Token resetowania wygasł",
    tokenVerificationFailed: "Weryfikacja tokenu nie powiodła się",
    userNotFound: "Użytkownik nie znaleziony",
    passwordUpdateFailed: "Nie udało się zaktualizować hasła",
    passwordResetFailed: "Resetowanie hasła nie powiodło się",
    requestFailed: "Żądanie resetowania nie powiodło się",
    emailMismatch: "E-mail nie pasuje",
    confirmationFailed: "Potwierdzenie resetowania hasła nie powiodło się",
  },
};
