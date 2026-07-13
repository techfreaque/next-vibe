import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  patch: {
    title: "Edytuj konto",
    titleShort: "Edytuj konto",
    description:
      "Zmień nazwę, opis lub kolejność konta. Typ i podtyp kont systemowych są zablokowane.",
    accountId: {
      label: "Konto",
      description: "Konto do edycji",
      placeholder: "UUID konta",
    },
    code: {
      label: "Kod",
      description: "Numer konta",
    },
    type: {
      label: "Typ",
      description: "Typ konta",
    },
    subtype: {
      label: "Podtyp",
      description: "Podtyp konta",
    },
    isSystem: {
      label: "Konto systemowe",
      description: "Czy to konto systemowe",
    },
    isActive: {
      label: "Aktywne",
      description: "Czy konto jest aktywne",
    },
    name: {
      label: "Nazwa konta",
      description: "Wyświetlana nazwa konta",
      placeholder: "np. Należności od odbiorców",
    },
    accountDescription: {
      label: "Opis",
      description: "Opcjonalne uwagi o przeznaczeniu konta",
      placeholder: "np. Śledzi kwoty należne od klientów",
    },
    sortOrder: {
      label: "Kolejność",
      description:
        "Kolejność wyświetlania w grupie nadrzędnej — mniejsze liczby pojawiają się pierwsze",
      placeholder: "np. 10",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane logowanie",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź wszystkie pola",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie można modyfikować pól konta systemowego",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zaktualizować konta",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      conflict: { title: "Konflikt", description: "Konflikt danych" },
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
    success: { title: "Konto zaktualizowane", description: "Zmiany zapisane" },
    widget: {
      savedLabel: "Zapisano",
      failedLabel: "Nie powiodło się",
      back: "Wstecz",
      submit: "Zapisz zmiany",
      viewAccount: "Zobacz konto",
      successTitle: "Zmiany zapisane",
      successDesc: "Konto zostało zaktualizowane.",
      systemNotice: "Konto systemowe — typ i podtyp są zablokowane.",
      inactiveNotice: "To konto jest nieaktywne.",
      selectPrompt: "Wybierz konto do edycji",
    },
  },
  title: "Edytuj konto",
  description: "Edytuj szczegóły konta",
  category: "Plan kont",
  tag: "Konto",
};
