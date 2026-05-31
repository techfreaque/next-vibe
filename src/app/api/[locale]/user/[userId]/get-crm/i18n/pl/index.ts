import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Pobierz profil CRM użytkownika",
    description: "Pobierz pola rozliczeniowe i liczbę notatek użytkownika",
    fields: {
      userId: {
        label: "ID użytkownika",
        description: "Użytkownik do pobrania",
        placeholder: "UUID użytkownika",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe ID użytkownika",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz dostępu do danych CRM tego użytkownika",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Użytkownik nie istnieje",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt",
      },
      network: {
        title: "Błąd sieci",
        description: "Żądanie sieciowe nie powiodło się",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Błąd serwera — spróbuj ponownie",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
    },
    success: {
      title: "Profil CRM załadowany",
      description: "Dane CRM użytkownika pobrane",
    },
    widget: {
      addNote: "Dodaj notatkę",
      viewNotes: "Zobacz notatki",
    },
    response: {
      id: "ID użytkownika",
      email: "E-mail",
      privateName: "Imię i nazwisko",
      companyBillingName: "Firma / nazwa rozliczeniowa",
      vatNumber: "Numer VAT",
      taxId: "NIP / REGON",
      phone: "Telefon",
      addressLine1: "Adres (wiersz 1)",
      addressLine2: "Adres (wiersz 2)",
      city: "Miasto",
      region: "Województwo / region",
      postalCode: "Kod pocztowy",
      billingCountry: "Kraj",
      defaultCurrency: "Domyślna waluta",
      paymentTermsDays: "Termin płatności (dni)",
      notesCount: "Łączna liczba notatek",
    },
  },
  tag: "CRM",
};
