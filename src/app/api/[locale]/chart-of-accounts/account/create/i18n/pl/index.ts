import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Utwórz konto",
    description: "Dodaj niestandardowe konto do planu kont firmy",
    companyId: {
      label: "ID firmy",
      description: "Firma, do której dodawane jest konto",
      placeholder: "Podaj UUID firmy",
    },
    code: {
      label: "Numer konta",
      description: "Unikalny numer konta",
      placeholder: "np. 1150",
    },
    name: {
      label: "Nazwa konta",
      description: "Opisowa nazwa konta",
      placeholder: "np. Kasa podręczna",
    },
    type: {
      label: "Typ konta",
      description: "Nadrzędna klasyfikacja konta",
      placeholder: "Wybierz typ",
    },
    subtype: {
      label: "Podtyp konta",
      description: "Szczegółowa klasyfikacja w ramach typu",
      placeholder: "Wybierz podtyp",
    },
    parentId: {
      label: "Konto nadrzędne",
      description: "Opcjonalne konto nadrzędne dla hierarchii",
      placeholder: "UUID konta nadrzędnego (opcjonalne)",
    },
    response: {
      id: "ID konta",
      code: "Numer",
      name: "Nazwa",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane logowanie",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź wszystkie wymagane pola",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Niewystarczające uprawnienia",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się utworzyć konta",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      conflict: {
        title: "Numer zajęty",
        description: "Konto o tym numerze już istnieje",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Firma nie znaleziona",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: { title: "Konto utworzone", description: "Konto zostało dodane" },
    widget: {
      viewButton: "Pokaż konto",
      addAnotherButton: "Dodaj kolejne",
      back: "Wstecz",
    },
  },
  title: "Utwórz konto",
  description: "Dodaj niestandardowe konto",
  category: "Plan kont",
  tag: "Konto",
};
