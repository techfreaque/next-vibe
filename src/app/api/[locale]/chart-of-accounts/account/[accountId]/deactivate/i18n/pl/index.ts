import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Dezaktywuj konto",
    description:
      "Miękka dezaktywacja konta. Nie można dezaktywować kont systemowych ani kont z zaksięgowanymi wierszami.",
    accountId: {
      label: "ID konta",
      description: "Konto do dezaktywacji",
      placeholder: "UUID konta",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane logowanie",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe ID konta",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Kont systemowych nie można dezaktywować",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się dezaktywować konta",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      conflict: {
        title: "Ma transakcje",
        description: "Nie można dezaktywować konta z wierszami dziennika",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Konto nie znalezione",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Konto dezaktywowane",
      description: "Konto jest teraz nieaktywne",
    },
    widget: {
      confirmWarning:
        "To konto zostanie dezaktywowane. Dla kont ze zaksięgowanymi transakcjami nie można tego cofnąć.",
      doneLabel: "Gotowe",
      confirmTitle: "Dezaktywować konto?",
      confirmDescription:
        "To konto zostanie dezaktywowane i nie będzie można go używać do nowych zapisów. Istniejące zapisy pozostają niezmienione.",
      confirmButton: "Tak, dezaktywuj",
      cancelButton: "Anuluj",
    },
  },
  title: "Dezaktywuj konto",
  description: "Miękka dezaktywacja konta",
  category: "Plan kont",
  tag: "Konto",
};
