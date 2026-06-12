import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    companies: "Firmy",
    members: "Członkowie",
    invite: "Zaproś",
  },
  post: {
    title: "Zaproś członka",
    titleShort: "Zaproś członka",
    description: "Zaproś zarejestrowanego użytkownika do firmy przez e-mail",
    companyId: {
      label: "ID firmy",
      description: "Firma, do której zapraszamy",
    },
    email: {
      label: "E-mail użytkownika",
      description: "E-mail zarejestrowanego użytkownika do zaproszenia",
      placeholder: "kolega@firma.pl",
    },
    role: {
      label: "Rola",
      description: "Rola przypisana nowemu członkowi",
      placeholder: "Wybierz rolę",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź e-mail i spróbuj ponownie",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Zaloguj się, aby zapraszać członków",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Wymagana rola Administratora lub Właściciela",
      },
      conflict: {
        title: "Już jest członkiem",
        description: "Ten użytkownik jest już członkiem firmy",
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
        title: "Użytkownik nie znaleziony",
        description: "Brak zarejestrowanego użytkownika z tym adresem e-mail",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Członek zaproszony",
      description: "Użytkownik został dodany do firmy",
    },
    response: {
      memberId: "ID członka",
      userId: "ID użytkownika",
      role: "Rola",
    },
    widget: {
      back: "Wróć do członków",
      invited: "Członek zaproszony",
    },
  },
};
