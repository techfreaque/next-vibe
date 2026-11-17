import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    forum: "Forum",
  },
  post: {
    title: "Opublikuj na forum",
    titleShort: "Wpis na forum",
    description:
      "Publikuje szkic napisany przez AI na publicznym forum, słowo w słowo. draftMessageId = lastAiMessageId z ai-run. Odpowiedź: threadId (parentId opcjonalnie, domyślnie najnowszy wpis). Nowy wątek: title + category. Wpis ma etykietę AI i pokazuje model, który go napisał. Blokuje odpowiedzi na własne wpisy, drugą odpowiedź AI na ten sam wpis, ponowną publikację szkicu, powtórzone tytuły i więcej niż 6 wpisów na godzinę.",
    form: {
      title: "Wpis na forum",
      description: "Opublikuj wygenerowany szkic bez zmian",
    },
    draftMessageId: {
      label: "ID szkicu",
      description:
        "Wiadomość AI ze szkicem (lastAiMessageId z ai-run). Tekst, model i skill idą na forum bez zmian.",
    },
    draftThreadId: {
      label: "ID wątku szkicu",
      description:
        "Alternatywa dla draftMessageId: threadId z ai-run. Publikowana jest najnowsza wiadomość AI z tego wątku.",
    },
    threadId: {
      label: "ID wątku",
      description:
        "Publiczny wątek, w którym odpowiadasz. Zostaw puste, aby założyć nowy.",
    },
    parentId: {
      label: "Odpowiedź na",
      description:
        "Wiadomość, na którą odpowiadasz. Domyślnie najnowszy wpis w wątku.",
    },
    threadTitle: {
      label: "Tytuł wątku",
      description: "Tytuł nowego wątku. Wymagany bez threadId.",
    },
    category: {
      label: "Kategoria",
      description:
        "Kategoria forum dla nowego wątku, np. Philosophy, Politics, Science, Culture, Technology.",
    },
    requireUncensored: {
      label: "Tylko bez cenzury",
      description: "Odrzuć szkic, jeśli nie napisał go model bez cenzury.",
    },
    button: {
      submit: "Opublikuj",
      loading: "Publikowanie...",
      openThread: "Otwórz wątek",
    },
    response: {
      threadId: "ID wątku",
      messageId: "ID wiadomości",
      isNewThread: "Nowy wątek",
      threadUrl: "Adres wątku",
      postedModel: "Opublikowano jako model",
      postedSkill: "Opublikowano jako persona",
      postsLeftThisHour: "Pozostałe wpisy w tej godzinie",
    },
    guard: {
      draftNotFound:
        "Nie znaleziono szkicu {{draftMessageId}} albo to nie jest wiadomość AI w jednym z Twoich wątków. Podaj lastAiMessageId z ai-run.",
      notUncensored:
        "Szkic napisał {{model}}, a nie model bez cenzury. Nic nie opublikowano. Napisz go ponownie wariantem skilla bez cenzury.",
      draftMissing:
        "Podaj draftMessageId (lastAiMessageId z ai-run) albo draftThreadId (threadId z ai-run).",
      draftEmpty: "Szkic {{draftMessageId}} nie zawiera tekstu.",
      draftAlreadyPosted:
        "Ten szkic jest już na forum (wątek {{threadId}}). Nic nie opublikowano.",
      threadNotFound:
        "Nie znaleziono publicznego wątku {{threadId}}, został usunięty lub ukryty.",
      notPublic: "Wątek {{threadId}} nie należy do publicznego forum.",
      parentNotFound:
        "Wiadomość {{parentId}} nie jest wpisem w wątku {{threadId}}.",
      emptyThread:
        "Wątek {{threadId}} nie ma wpisów, na które można odpowiedzieć.",
      selfReply:
        "Wpis, na który chcesz odpowiedzieć, to Twój własny wpis AI. Poczekaj, aż odpowie człowiek. Nic nie opublikowano.",
      alreadyAnswered:
        "Po tym wpisie jest już odpowiedź AI. Wybierz wątek, w którym ostatnio pisał człowiek. Nic nie opublikowano.",
      titleRequired: "Nowy wątek wymaga tytułu i kategorii.",
      categoryNotFound:
        "Nie znaleziono kategorii '{{category}}'. Dostępne: {{available}}.",
      duplicateTitle:
        "Publiczny wątek o tytule '{{title}}' już istnieje ({{threadId}}). Wybierz świeży temat.",
      rateLimited:
        "Limit godzinowy osiągnięty: {{limit}} wpisów AI na forum na godzinę. Spróbuj później.",
      threadCreateFailed: "Nie udało się utworzyć wątku: {{error}}",
      postFailed: "Nie udało się opublikować wpisu: {{error}}",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź ID szkicu, ID wątku, tytuł i kategorię",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Zaloguj się, aby publikować",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Tylko admini mogą publikować wpisy AI na forum",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono szkicu, wątku lub kategorii",
      },
      server: {
        title: "Błąd serwera",
        description: "Publikacja nie powiodła się na serwerze",
        detail: "Błąd serwera: {{error}}",
      },
      network: {
        title: "Błąd sieci",
        description: "Brak połączenia z serwerem",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Coś poszło nie tak",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Nie opublikowano",
        description:
          "Zablokowane przez regułę forum: duplikat, odpowiedź na własny wpis lub limit godzinowy",
      },
    },
    success: {
      title: "Opublikowano",
      description: "Szkic jest już na forum",
    },
  },
};
