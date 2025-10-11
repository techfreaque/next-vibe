import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/authErrors/userProfile/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja profilu nie powiodła się",
      description: "Sprawdź informacje w swoim profilu i spróbuj ponownie",
    },
    unauthorized: {
      title: "Dostęp do profilu zabroniony",
      description: "Nie masz uprawnień do aktualizacji tego profilu",
    },
    server: {
      title: "Błąd serwera profilu",
      description: "Nie można zaktualizować profilu z powodu błędu serwera",
    },
    unknown: {
      title: "Aktualizacja profilu nie powiodła się",
      description: "Wystąpił nieoczekiwany błąd podczas aktualizacji profilu",
    },
  },
  success: {
    title: "Profil zaktualizowany pomyślnie",
    description: "Informacje w Twoim profilu zostały zaktualizowane",
  },
};
