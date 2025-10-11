import type { deleteTranslations as EnglishDeleteTranslations } from "../../../../en/sections/usersErrors/users/delete";

export const deleteTranslations: typeof EnglishDeleteTranslations = {
  error: {
    validation: {
      title: "Walidacja usuwania użytkownika nie powiodła się",
      description: "Sprawdź swoje żądanie i spróbuj ponownie",
    },
    unauthorized: {
      title: "Usuwanie użytkownika nieautoryzowane",
      description: "Nie masz uprawnień do usuwania użytkowników",
    },
    forbidden: {
      title: "Usuwanie użytkownika zabronione",
      description: "Nie masz uprawnień do usunięcia tego użytkownika",
    },
    not_found: {
      title: "Użytkownik nie znaleziony",
      description:
        "Użytkownik, którego próbujesz usunąć, nie mógł zostać znaleziony",
    },
    server: {
      title: "Błąd serwera usuwania użytkownika",
      description: "Nie można usunąć użytkownika z powodu błędu serwera",
    },
    unknown: {
      title: "Usuwanie użytkownika nie powiodło się",
      description: "Wystąpił nieoczekiwany błąd podczas usuwania użytkownika",
    },
  },
  success: {
    title: "Użytkownik usunięty pomyślnie",
    description: "Użytkownik został trwale usunięty z systemu",
  },
};
