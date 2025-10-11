import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/authErrors/userAvatar/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja awatara nie powiodła się",
      description: "Sprawdź plik awatara i spróbuj ponownie",
    },
    unauthorized: {
      title: "Przesyłanie awatara nieautoryzowane",
      description: "Nie masz uprawnień do przesłania awatara",
    },
    server: {
      title: "Błąd serwera przesyłania awatara",
      description: "Nie można przesłać awatara z powodu błędu serwera",
    },
    unknown: {
      title: "Przesyłanie awatara nie powiodło się",
      description: "Wystąpił nieoczekiwany błąd podczas przesyłania awatara",
    },
  },
  success: {
    title: "Awatar zaktualizowany pomyślnie",
    description: "Awatar Twojego profilu został zaktualizowany",
  },
};
