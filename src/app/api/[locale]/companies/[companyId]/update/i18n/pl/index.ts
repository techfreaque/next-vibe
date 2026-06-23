import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    companyType: {
      b2b: "B2B",
      b2c: "B2C",
      individual: "Osoba fizyczna",
    },
    companyMemberRole: {
      owner: "Właściciel",
      admin: "Administrator",
      member: "Członek",
      accountant: "Księgowy",
      viewer: "Obserwator",
    },
  },
  tags: {
    companies: "Firmy",
    update: "Edytuj",
    management: "Zarządzanie",
  },
  patch: {
    title: "Edytuj firmę",
    titleShort: "Edytuj firmę",
    description:
      "Edytuj dane firmy. Wymagana rola Administratora lub Właściciela.",
    companyId: {
      label: "ID firmy",
      description: "Firma do edycji",
    },
    name: {
      label: "Nazwa firmy",
      description: "Prawna nazwa firmy",
      placeholder: "Przykład Sp. z o.o.",
    },
    type: {
      label: "Typ firmy",
      description: "Model biznesowy",
      placeholder: "Wybierz typ",
    },
    vatNumber: {
      label: "NIP",
      description: "Numer identyfikacji podatkowej VAT",
      placeholder: "PL1234567890",
    },
    country: {
      label: "Kraj",
      description: "Kraj rejestracji",
      placeholder: "PL",
    },
    currency: {
      label: "Domyślna waluta",
      description: "Główna waluta do fakturowania",
      placeholder: "EUR",
    },
    email: {
      label: "E-mail firmy",
      description: "Główny firmowy adres e-mail",
      placeholder: "kontakt@firma.pl",
    },
    phone: {
      label: "Telefon firmy",
      description: "Główny firmowy numer telefonu",
      placeholder: "+48 22 123 4567",
    },
    website: {
      label: "Strona internetowa",
      description: "Adres strony internetowej firmy",
      placeholder: "https://firma.pl",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź formularz i spróbuj ponownie",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Zaloguj się, aby edytować dane firmy",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Wymagana rola Administratora lub Właściciela",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt danych",
      },
      server: {
        title: "Błąd serwera",
        description: "Coś poszło nie tak — spróbuj ponownie",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Sprawdź połączenie i spróbuj ponownie",
      },
      notFound: {
        title: "Firma nie znaleziona",
        description: "Ta firma nie istnieje",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Firma zaktualizowana",
      description: "Dane firmy zapisane pomyślnie",
    },
    response: {
      id: "ID firmy",
      name: "Nazwa firmy",
    },
    widget: {
      back: "Wróć",
      successLabel: "Firma zaktualizowana",
      viewCompany: "Zobacz firmę",
    },
  },
};
