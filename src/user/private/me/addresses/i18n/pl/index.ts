import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Adresy",
  tag: "addresses",

  list: {
    title: "Moje adresy",
    titleShort: "Moje adresy",
    description: "Lista zapisanych adresów",
    response: {
      addresses: "Adresy",
    },
    widget: {
      back: "Wstecz",
      addAddress: "Dodaj adres",
      edit: "Edytuj",
      delete: "Usuń",
      billing: "Rozliczeniowy",
      delivery: "Dostawczy",
      empty: "Brak zapisanych adresów",
      emptyHint: "Zapisz adresy, by szybciej składać zamówienia",
      emptyCta: "Dodaj pierwszy adres",
      loading: "Ładowanie adresów…",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe żądanie",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane logowanie",
      },
      forbidden: { title: "Zabronione", description: "Brak dostępu" },
      notFound: { title: "Nie znaleziono", description: "Brak adresów" },
      conflict: { title: "Konflikt", description: "Konflikt danych" },
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
      internal: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
    },
    success: { title: "Sukces", description: "Adresy pobrane" },
  },

  create: {
    title: "Dodaj adres",
    titleShort: "Dodaj adres",
    description: "Zapisz nowy adres na koncie",
    fields: {
      label: {
        label: "Nazwa",
        description: "Nazwij ten adres (np. Dom, Biuro)",
        placeholder: "Dom",
      },
      fullName: {
        label: "Imię i nazwisko",
        description: "Osoba kontaktowa dla adresu",
        placeholder: "Jan Kowalski",
      },
      company: {
        label: "Firma",
        description: "Nazwa firmy (opcjonalnie)",
        placeholder: "Przykład Sp. z o.o.",
      },
      phone: {
        label: "Telefon",
        description: "Numer kontaktowy",
        placeholder: "+48 22 000 00 00",
      },
      vatNumber: {
        label: "NIP",
        description: "Numer identyfikacji podatkowej VAT",
        placeholder: "PL1234567890",
      },
      taxId: {
        label: "REGON",
        description: "Krajowy identyfikator podatkowy",
        placeholder: "123456789",
      },
      addressLine1: {
        label: "Adres (linia 1)",
        description: "Ulica i numer",
        placeholder: "ul. Przykładowa 1",
      },
      addressLine2: {
        label: "Adres (linia 2)",
        description: "Mieszkanie, piętro (opcjonalnie)",
        placeholder: "m. 5",
      },
      city: { label: "Miasto", description: "Miasto", placeholder: "Warszawa" },
      region: {
        label: "Województwo / Region",
        description: "Województwo lub region (opcjonalnie)",
        placeholder: "Mazowieckie",
      },
      postalCode: {
        label: "Kod pocztowy",
        description: "Kod pocztowy",
        placeholder: "00-001",
      },
      country: {
        label: "Kraj",
        description: "Kod kraju ISO 3166-1 alpha-2",
        placeholder: "PL",
      },
      isDefaultBilling: {
        label: "Domyślny adres rozliczeniowy",
        description: "Użyj jako domyślny adres rozliczeniowy",
      },
      isDefaultDelivery: {
        label: "Domyślny adres dostawy",
        description: "Użyj jako domyślny adres dostawy",
      },
    },
    response: {
      id: "ID adresu",
      label: "Nazwa",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź wymagane pola",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane logowanie",
      },
      forbidden: { title: "Zabronione", description: "Brak dostępu" },
      notFound: {
        title: "Nie znaleziono",
        description: "Użytkownik nie znaleziony",
      },
      conflict: { title: "Konflikt", description: "Konflikt danych" },
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
      internal: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
    },
    success: { title: "Adres zapisany", description: "Adres dodany do konta" },
    widget: {
      saved: "Adres zapisany.",
      backToAddresses: "Wróć do adresów",
    },
  },
};
