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
    create: "Utwórz",
  },
  post: {
    title: "Utwórz firmę",
    titleShort: "Utwórz firmę",
    description:
      "Zarejestruj nową firmę. Automatycznie zostaniesz jej właścicielem.",
    name: {
      label: "Nazwa firmy",
      description: "Prawna nazwa firmy",
      placeholder: "Przykład Sp. z o.o.",
    },
    type: {
      label: "Typ firmy",
      description: "Model biznesowy — B2B, B2C lub osoba fizyczna",
      placeholder: "Wybierz typ",
    },
    vatNumber: {
      label: "NIP",
      description: "Numer identyfikacji podatkowej VAT",
      placeholder: "PL1234567890",
    },
    country: {
      label: "Kraj",
      description: "Kraj rejestracji firmy",
      placeholder: "Wybierz kraj",
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
        description: "Sprawdź pola formularza i spróbuj ponownie",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Zaloguj się, aby utworzyć firmę",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do tworzenia firmy",
      },
      conflict: {
        title: "Już istnieje",
        description: "Firma o tej nazwie już istnieje",
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
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Firma utworzona",
      description: "Firma jest gotowa. Dodaj członków, aby zacząć.",
    },
    response: {
      id: "ID firmy",
      name: "Nazwa firmy",
    },
    widget: {
      viewCompany: "Zobacz firmę",
      back: "Wróć do listy",
    },
  },
};
