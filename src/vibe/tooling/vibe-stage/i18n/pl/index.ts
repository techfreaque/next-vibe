import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Vibe Stage",
  titleShort: "Vibe Stage",
  description:
    "Automatycznie staguje pliki boilerplate (route.ts, i18n/*/index.ts) przechodzące sprawdzenie wzorca. Staguje też pliki ze zmianami tylko w importach lub częściowo — wyłącznie hunki importowe z plików z mieszanymi zmianami.",

  fields: {
    dryRun: {
      label: "Próbny przebieg",
      description:
        "Podgląd plików, które zostałyby stagowane, bez faktycznego uruchamiania git add",
    },
    paths: {
      label: "Ogranicz do ścieżek",
      description:
        "Uwzględniaj tylko kandydatów pod tymi ścieżkami. Pozostaw puste, aby skanować wszystkie niestageowane zmiany.",
      placeholder: "np. src",
    },
  },

  response: {
    staged: "Stagowane",
    partiallyStaged: "Częściowo stagowane (tylko importy)",
    skipped: "Pominięte (naruszenia)",
    renamed: "Zmienione nazwy (przeniesienia)",
    deleted: "Usunięte (generowane/fixtures)",
    noChanges: "Nie znaleziono stagowanych plików w drzewie roboczym",
    dryRunNote:
      "Próbny przebieg - żadne pliki nie zostały faktycznie stagowane",
  },

  errors: {
    validation: {
      title: "Nieprawidłowe parametry",
      description: "Parametry vibe stage są nieprawidłowe",
    },
    internal: {
      title: "Błąd wewnętrzny",
      description: "Wystąpił błąd podczas uruchamiania vibe stage",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Musisz być zalogowany, aby uruchomić vibe stage",
    },
    forbidden: {
      title: "Zabronione",
      description: "Dostęp do vibe stage jest zabroniony",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Nie znaleziono repozytorium git",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd serwera podczas vibe stage",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas vibe stage",
    },
    unsaved: {
      title: "Niezapisane zmiany",
      description: "Wykryto niezapisane zmiany",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas vibe stage",
    },
  },

  success: {
    title: "Stage zakończony",
    description: "Pliki boilerplate zostały pomyślnie stagowane",
  },

  widget: {
    title: "Vibe Stage",
    subtitle:
      "Automatyczne stagowanie plików boilerplate, które przechodzą sprawdzenie wzorca",
    submit: "Uruchom Stage",
    dryRun: "Próbny przebieg",
    staged: "Stagowane",
    partiallyStaged: "Częściowo stagowane",
    skipped: "Pominięte",
    renamed: "Zmienione nazwy",
    deleted: "Usunięte",
    stagedCount: "pliki stagowane",
    partiallyStaged_count: "pliki częściowo stagowane (tylko importy)",
    skippedCount: "pliki pominięte (naruszenia)",
    renamedCount: "przeniesienia stagowane",
    deletedCount: "usunięcia stagowane",
    renameFile: "przeniesiony",
    deleteFile: "usunięty",
    noChanges: "Nie znaleziono stagowanych plików",
    noChangesHint:
      "Pliki boilerplate, zmiany tylko w importach lub pliki z hunkami importowymi pojawią się tutaj",
    dryRunBadge: "Próbny przebieg",
    dryRunNote: "Tylko podgląd — żadne pliki nie zostały stagowane",
    cleanFile: "czysty",
    partialFile: "tylko importy",
    violationsFile: "naruszenia",
    loading: "Skanowanie drzewa roboczego...",
  },
};
