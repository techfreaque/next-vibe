import type { putTranslations as EnglishPutTranslations } from "../../../../en/sections/usersErrors/users/put";

export const putTranslations: typeof EnglishPutTranslations = {
  error: {
    validation: {
      title: "Walidacja aktualizacji użytkownika nie powiodła się",
      description: "Sprawdź informacje o użytkowniku i spróbuj ponownie",
    },
    unauthorized: {
      title: "Aktualizacja użytkownika nieautoryzowana",
      description: "Nie masz uprawnień do aktualizacji użytkowników",
    },
    forbidden: {
      title: "Aktualizacja użytkownika zabroniona",
      description: "Nie masz uprawnień do aktualizacji tego użytkownika",
    },
    not_found: {
      title: "Użytkownik nie znaleziony",
      description:
        "Użytkownik, którego próbujesz zaktualizować, nie mógł zostać znaleziony",
    },
    duplicate: {
      title: "E-mail już w użyciu",
      description: "Inny użytkownik już używa tego adresu e-mail",
    },
    server: {
      title: "Błąd serwera aktualizacji użytkownika",
      description: "Nie można zaktualizować użytkownika z powodu błędu serwera",
    },
    unknown: {
      title: "Aktualizacja użytkownika nie powiodła się",
      description:
        "Wystąpił nieoczekiwany błąd podczas aktualizacji użytkownika",
    },
  },
  success: {
    title: "Użytkownik zaktualizowany pomyślnie",
    description: "Informacje o użytkowniku zostały pomyślnie zaktualizowane",
  },
};
