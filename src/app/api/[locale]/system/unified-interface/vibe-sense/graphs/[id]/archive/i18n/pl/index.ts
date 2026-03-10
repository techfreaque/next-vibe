import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Archiwizuj graf",
    description:
      "Miekkie usuwanie grafu (dezaktywacja i oznaczenie jako zarchiwizowany)",
    fields: {
      id: {
        label: "ID grafu",
        description: "UUID grafu do archiwizacji",
      },
    },
    response: {
      archivedId: "ID zarchiwizowanego grafu",
    },
    widget: {
      confirmDescription:
        "To dezaktywuje graf i oznaczy go jako zarchiwizowany. Nie bedzie juz uruchamiany zgodnie z harmonogramem. Mozna to cofnac.",
      archivedIdLabel: "Zarchiwizowane ID:",
      backToList: "Back to graphs",
    },
    success: {
      title: "Graf zarchiwizowany",
      description: "Graf zostal pomyslnie zarchiwizowany",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Nie mozna archiwizowac grafow systemowych",
      },
      server: {
        title: "Blad serwera",
        description: "Nie udalo sie zarchiwizowac grafu",
      },
      unknown: {
        title: "Nieznany blad",
        description: "Wystapil nieoczekiwany blad",
      },
      validation: {
        title: "Walidacja nie powiodla sie",
        description: "Nieprawidlowe parametry",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Graf nie znaleziony",
      },
      conflict: { title: "Konflikt", description: "Konflikt zasobow" },
      network: {
        title: "Blad sieci",
        description: "Zadanie sieciowe nie powiodlo sie",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Najpierw zapisz zmiany",
      },
    },
  },
};
