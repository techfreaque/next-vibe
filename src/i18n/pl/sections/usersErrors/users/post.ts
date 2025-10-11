import type { postTranslations as EnglishPostTranslations } from "../../../../en/sections/usersErrors/users/post";

export const postTranslations: typeof EnglishPostTranslations = {
  error: {
    validation: {
      title: "Walidacja tworzenia użytkownika nie powiodła się",
      description: "Sprawdź informacje o użytkowniku i spróbuj ponownie",
    },
    unauthorized: {
      title: "Tworzenie użytkownika nieautoryzowane",
      description: "Nie masz uprawnień do tworzenia użytkowników",
    },
    forbidden: {
      title: "Tworzenie użytkownika zabronione",
      description: "Nie masz uprawnień do tworzenia użytkowników",
    },
    duplicate: {
      title: "Użytkownik już istnieje",
      description: "Użytkownik z tym adresem e-mail już istnieje w systemie",
    },
    server: {
      title: "Błąd serwera tworzenia użytkownika",
      description: "Nie można utworzyć użytkownika z powodu błędu serwera",
    },
    unknown: {
      title: "Tworzenie użytkownika nie powiodło się",
      description: "Wystąpił nieoczekiwany błąd podczas tworzenia użytkownika",
    },
  },
  success: {
    title: "Użytkownik utworzony pomyślnie",
    description: "Nowy użytkownik został utworzony i dodany do systemu",
  },
};
