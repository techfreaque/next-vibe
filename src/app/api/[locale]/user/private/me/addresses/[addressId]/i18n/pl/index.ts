import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Adresy",
  tag: "addresses",

  update: {
    title: "Edytuj adres",
    description: "Zmień zapisany adres",
    fields: {
      addressId: { label: "ID adresu", description: "Adres do edycji" },
      label: {
        label: "Nazwa",
        description: "Nazwij ten adres",
        placeholder: "Dom",
      },
      fullName: {
        label: "Imię i nazwisko",
        description: "Osoba kontaktowa",
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
      updated: "Zaktualizowano",
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
      forbidden: {
        title: "Zabronione",
        description: "Ten adres nie należy do Ciebie",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Adres nie znaleziony",
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
    success: {
      title: "Adres zaktualizowany",
      description: "Adres zapisany pomyślnie",
    },
    widget: {
      updated: "Adres zaktualizowany.",
      backToAddresses: "Wróć do adresów",
    },
  },

  delete: {
    title: "Usuń adres",
    description: "Usuń zapisany adres z konta",
    fields: {
      addressId: { label: "ID adresu", description: "Adres do usunięcia" },
    },
    response: {
      deleted: "Usunięto",
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
      forbidden: {
        title: "Zabronione",
        description: "Ten adres nie należy do Ciebie",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Adres nie znaleziony",
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
    success: { title: "Adres usunięty", description: "Adres usunięty z konta" },
    widget: {
      deleted: "Adres usunięty.",
      backToAddresses: "Wróć do adresów",
    },
  },
};
