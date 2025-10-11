import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/authErrors/userMe/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja profilu użytkownika nie powiodła się",
      description: "Sprawdź informacje w swoim profilu i spróbuj ponownie",
    },
    unauthorized: {
      title: "Dostęp do profilu zabroniony",
      description: "Nie masz uprawnień do dostępu do tego profilu",
    },
    server: {
      title: "Błąd serwera profilu",
      description: "Nie można załadować profilu z powodu błędu serwera",
    },
    unknown: {
      title: "Dostęp do profilu nie powiódł się",
      description: "Wystąpił nieoczekiwany błąd podczas dostępu do profilu",
    },
  },
  success: {
    title: "Profil zaktualizowany pomyślnie",
    description: "Twój profil został zaktualizowany",
  },
};
