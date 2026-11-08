import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Czat",
  tags: {
    moderation: "Moderacja",
  },
  get: {
    title: "Zgłoszone treści",
    titleShort: "Kolejka moderacji",
    description:
      "Zgłoszone i ukryte posty z kanału oraz udostępnione wątki, najpilniejsze pierwsze",
    fields: {
      minReports: {
        label: "Min. zgłoszeń",
        description: "Minimalna liczba otwartych zgłoszeń (domyślnie: 1)",
      },
      limit: {
        label: "Limit",
        description: "Maksymalna liczba zwracanych wątków",
      },
      offset: {
        label: "Przesunięcie",
        description: "Liczba wątków do pominięcia",
      },
    },
    response: {
      threads: {
        id: { content: "ID wątku" },
        title: { content: "Tytuł" },
        rootFolderId: { content: "Folder" },
        authorId: { content: "ID autora" },
        authorName: { content: "Autor" },
        authorBanned: { content: "Autor zbanowany" },
        moderationStatus: { content: "Status" },
        reportCount: { content: "Zgłoszenia" },
        reasons: { content: "Powody" },
        latestNote: { content: "Ostatnia notatka" },
        updatedAt: { content: "Zaktualizowano" },
      },
      totalCount: { content: "Razem" },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe żądanie",
      },
      network: {
        title: "Błąd sieci",
        description: "Połączenie nie powiodło się",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagany dostęp administratora",
      },
      forbidden: {
        title: "Zabronione",
        description: "Wymagany dostęp administratora",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono wątku",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się załadować kolejki moderacji",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt danych" },
    },
    success: {
      title: "Kolejka załadowana",
      description: "Zgłoszone treści pobrane pomyślnie",
    },
    note: "„{{note}}”",
    empty: "Brak zgłoszeń. Społeczność wygląda zdrowo.",
    status: {
      visible: "Widoczny",
      underReview: "W weryfikacji",
      removed: "Usunięty",
      authorBanned: "Autor zbanowany",
    },
    reasons: {
      spam: "Spam",
      illegal: "Nielegalne",
      abuse: "Nadużycie",
      csamFlag: "Bezpieczeństwo dzieci",
      other: "Inne",
    },
    action: {
      dismiss: "Odrzuć",
      remove: "Usuń",
      banAuthor: "Usuń + zbanuj autora",
    },
    backButton: {
      label: "Wstecz",
    },
  },
  patch: {
    title: "Moderuj treść",
    titleShort: "Moderuj",
    description:
      "Odrzuć zgłoszenia i przywróć wątek, usuń go albo usuń i zbanuj autora",
    fields: {
      id: {
        label: "ID wątku",
        description: "ID moderowanego wątku",
      },
      action: {
        label: "Akcja",
        description:
          "dismiss = przywróć i wyczyść zgłoszenia, remove = ukryj na stałe, ban = usuń i zbanuj autora",
      },
    },
    actions: {
      dismiss: "Odrzuć zgłoszenia (przywróć)",
      remove: "Usuń treść",
      banAuthor: "Usuń i zbanuj autora",
    },
    response: {
      patchId: { content: "ID wątku" },
      patchStatus: { content: "Nowy status" },
      patchReportCount: { content: "Liczba zgłoszeń" },
      authorBanned: { content: "Autor zbanowany" },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe żądanie",
      },
      network: {
        title: "Błąd sieci",
        description: "Połączenie nie powiodło się",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagany dostęp administratora",
      },
      forbidden: {
        title: "Zabronione",
        description: "Wymagany dostęp administratora",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono wątku",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zmoderować wątku",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt danych" },
      noAuthor: {
        title: "Brak zarejestrowanego autora",
        description: "Wątek dodał gość, więc nie ma konta do zbanowania",
      },
    },
    success: {
      title: "Treść zmoderowana",
      description: "Akcja zastosowana pomyślnie",
    },
  },
};
