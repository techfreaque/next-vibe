import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    studio: "Media Studio",
    history: "Historia",
  },
  get: {
    title: "Twoje generacje",
    titleShort: "Generacje",
    description:
      "Obrazy, wideo, muzyka, mowa i transkrypcje ze Studia, z czatu i przez API. Najnowsze na górze.",
    fields: {
      kind: {
        label: "Typ",
        description:
          "image, video, music, speech lub transcribe. Zostaw puste, żeby zobaczyć wszystko.",
      },
    },
    response: {
      items: "Generacje",
      id: "ID",
      kind: "Typ",
      title: "Prompt",
      createdAt: "Utworzono",
      status: "Status",
      url: "Plik",
      transcript: "Transkrypcja",
      credits: "Kredyty",
      model: "Model",
      settings: "Ustawienia",
      source: "Źródło",
      threadId: "Wątek",
      rootFolderId: "Folder",
    },
    success: {
      title: "Historia wczytana",
      description: "Oto Twoje generacje.",
    },
    errors: {
      validation: {
        title: "Nieprawidłowy filtr",
        description: "Sprawdź typ i stronę, potem spróbuj ponownie.",
      },
      unauthorized: {
        title: "Nie jesteś zalogowany",
        description: "Zaloguj się, żeby zobaczyć swoje generacje.",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Widzisz tylko własne generacje.",
      },
      notFound: {
        title: "Pusto",
        description: "Żadna generacja nie pasuje do tego filtra.",
      },
      server: {
        title: "Historia niedostępna",
        description: "Nie udało się wczytać historii. Spróbuj za chwilę.",
      },
      network: {
        title: "Brak połączenia",
        description: "Sprawdź połączenie i spróbuj ponownie.",
      },
      unknown: {
        title: "Coś poszło nie tak",
        description: "Nie udało się wczytać historii. Spróbuj ponownie.",
      },
      conflict: {
        title: "Historia się zmieniła",
        description: "Odśwież, żeby zobaczyć najnowsze wyniki.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Najpierw zapisz albo odrzuć zmiany.",
      },
    },
  },
  widget: {
    title: "Twoje generacje",
    titles: {
      image: "Twoje obrazy",
      video: "Twoje filmy",
      music: "Twoje utwory",
      speech: "Twoje nagrania głosowe",
      transcribe: "Twoje transkrypcje",
    },
    count: "{{count}} łącznie",
    error: "Nie udało się wczytać historii.",
    retry: "Odśwież",
    emptyTitle: "Jeszcze nic tu nie ma",
    emptyHint: "Każdy wynik trafia tutaj, gotowy do pobrania.",
    emptyKindHint:
      "Twój pierwszy wynik pojawi się tu, gdy tylko będzie gotowy.",
    runAgain: "Powtórz",
    download: "Pobierz",
    copyPrompt: "Kopiuj prompt",
    copied: "Skopiowano",
    copyFailed: "Kopiowanie zablokowane",
    openInChat: "Otwórz w czacie",
    continueInChat: "Kontynuuj w czacie",
    chatPrompt: "Oto, co zrobiłem: {{url}}\n\nPrompt: {{prompt}}",
    open: "Otwórz w pełnym rozmiarze",
    credits: "{{amount}} kredytów",
    source: {
      studio: "w Studio",
      chat: "w czacie",
      api: "przez API",
    },
    status: {
      queued: "W kolejce",
      running: "Generuję",
      saving: "Zapisuję plik",
      completed: "Gotowe",
      failed: "Nie udało się",
    },
    pendingHint: "Wideo i muzyka mogą zająć kilka minut.",
    kinds: {
      image: "Obraz",
      video: "Wideo",
      music: "Muzyka",
      speech: "Mowa",
      transcribe: "Transkrypcja",
    },
  },
};
