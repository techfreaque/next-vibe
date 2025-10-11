import type { errorsTranslations as EnglishErrorsTranslations } from "../../../en/sections/leads/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  create: {
    conflict: {
      title: "Lead już istnieje",
      description: "Lead z tym adresem e-mail już istnieje w systemie.",
    },
    validation: {
      title: "Nieprawidłowe dane leada",
      description: "Sprawdź informacje o leadzie i spróbuj ponownie.",
    },
  },
  get: {
    notFound: {
      title: "Lead nie znaleziony",
      description: "Żądany lead nie mógł zostać znaleziony.",
    },
  },
  update: {
    notFound: {
      title: "Lead nie znaleziony",
      description:
        "Lead, który próbujesz zaktualizować, nie mógł zostać znaleziony.",
    },
    validation: {
      title: "Nieprawidłowe dane aktualizacji",
      description: "Sprawdź informacje aktualizacji i spróbuj ponownie.",
    },
  },
  import: {
    badRequest: {
      title: "Nieprawidłowy plik CSV",
      description: "Format pliku CSV jest nieprawidłowy lub pusty.",
    },
    validation: {
      title: "Błąd walidacji CSV",
      description: "Niektóre wiersze w pliku CSV zawierają nieprawidłowe dane.",
    },
  },
};
