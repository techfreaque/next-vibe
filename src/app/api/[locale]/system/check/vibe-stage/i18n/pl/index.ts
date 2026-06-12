import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Vibe Stage",
  titleShort: "Vibe Stage",
  description:
    "Automatycznie staguje pliki boilerplate (route.ts, i18n/*/index.ts), które przechodzą sprawdzenie wzorca. Uruchamia wtyczkę oxlint boilerplate na wszystkich niestageowanych kandydatach i git-adduje tylko pliki bez naruszeń.",

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
      placeholder: "np. src/app/api",
    },
  },

  response: {
    staged: "Stagowane",
    skipped: "Pominięte (naruszenia)",
    noChanges:
      "Nie znaleziono stagowanych plików boilerplate w drzewie roboczym",
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
    skipped: "Pominięte",
    stagedCount: "pliki stagowane",
    skippedCount: "pliki pominięte (naruszenia)",
    noChanges: "Nie znaleziono stagowanych plików boilerplate",
    noChangesHint:
      "Zmodyfikowane pliki route.ts i i18n/*/index.ts, które przechodzą sprawdzenie wzorca, pojawią się tutaj",
    dryRunBadge: "Próbny przebieg",
    dryRunNote: "Tylko podgląd — żadne pliki nie zostały stagowane",
    cleanFile: "czysty",
    violationsFile: "naruszenia",
    loading: "Skanowanie drzewa roboczego...",
  },
};
