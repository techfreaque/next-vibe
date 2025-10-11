import type { putTranslations as EnglishPutTranslations } from "../../../../en/sections/templateErrors/template/put";

export const putTranslations: typeof EnglishPutTranslations = {
  error: {
    validation: {
      title: "Walidacja aktualizacji szablonu nie powiodła się",
      description: "Sprawdź aktualizacje swojego szablonu i spróbuj ponownie",
    },
    network: {
      title: "Błąd sieciowy aktualizacji szablonu",
      description: "Nie można zaktualizować szablonu z powodu błędu sieci",
    },
    unauthorized: {
      title: "Aktualizacja szablonu nieautoryzowana",
      description: "Nie masz uprawnień do aktualizacji szablonów",
    },
    forbidden: {
      title: "Aktualizacja szablonu zabroniona",
      description: "Dostęp do aktualizacji tego szablonu jest zabroniony",
    },
    notFound: {
      title: "Szablon nie znaleziony",
      description:
        "Szablon, który próbujesz zaktualizować, nie został znaleziony",
    },
    server: {
      title: "Błąd serwera aktualizacji szablonu",
      description: "Nie można zaktualizować szablonu z powodu błędu serwera",
    },
    unknown: {
      title: "Aktualizacja szablonu nie powiodła się",
      description: "Wystąpił nieoczekiwany błąd podczas aktualizacji szablonu",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany szablonu",
      description: "Masz niezapisane zmiany w swoim szablonie",
    },
    conflict: {
      title: "Konflikt aktualizacji szablonu",
      description:
        "Szablon został zmodyfikowany przez innego użytkownika. Odśwież i spróbuj ponownie",
    },
  },
};
