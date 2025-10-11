import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    confirmation: "Potwierdzenie",
    automation: "Automatyzacja",
  },
  post: {
    title: "Odpowiedź na potwierdzenie człowieka",
    description:
      "Odpowiedz na żądanie potwierdzenia człowieka (zatwierdź/odrzuć)",
    form: {
      title: "Odpowiedź potwierdzenia",
      description: "Podaj swoją odpowiedź potwierdzenia",
    },
    id: {
      label: "ID potwierdzenia",
      description: "ID żądania potwierdzenia",
    },
    confirmationId: {
      label: "ID potwierdzenia",
      description: "ID żądania potwierdzenia, na które należy odpowiedzieć",
    },
    action: {
      label: "Akcja",
      description: "Zatwierdź lub odrzuć żądanie potwierdzenia",
    },
    reason: {
      label: "Powód",
      description: "Opcjonalny powód Twojej decyzji",
      placeholder: "Wprowadź powód zatwierdzenia/odrzucenia...",
    },
    metadata: {
      label: "Metadane",
      description: "Dodatkowe metadane dla odpowiedzi",
      placeholder: "Wprowadź metadane JSON...",
    },
    response: {
      title: "Wynik odpowiedzi",
      description: "Wynik odpowiedzi potwierdzenia",
      success: "Odpowiedź pomyślna",
      message: "Odpowiedź potwierdzenia została pomyślnie przetworzona",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagana autoryzacja do odpowiadania na potwierdzenia",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Podano nieprawidłowe dane odpowiedzi potwierdzenia",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera podczas potwierdzania",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas potwierdzania",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas przetwarzania potwierdzenia",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do odpowiedzi potwierdzenia jest zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono żądania potwierdzenia",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description:
          "Istnieją niezapisane zmiany, które należy najpierw zapisać",
      },
      conflict: {
        title: "Konflikt potwierdzenia",
        description: "Potwierdzenie zostało już udzielone lub wygasło",
      },
    },
    success: {
      title: "Potwierdzenie przesłane",
      description: "Twoja odpowiedź potwierdzenia została pomyślnie przesłana",
    },
  },
  enums: {
    action: {
      approve: "Zatwierdź",
      reject: "Odrzuć",
    },
  },
  imapErrors: {
    agent: {
      confirmation: {
        error: {
          not_found: {
            description: "Nie znaleziono żądania potwierdzenia",
          },
          conflict: {
            description: "Potwierdzenie zostało już udzielone",
          },
          expired: {
            description: "Żądanie potwierdzenia wygasło",
          },
          server: {
            description: "Nie udało się przetworzyć odpowiedzi potwierdzenia",
          },
        },
        success: {
          approved: "Potwierdzenie zostało pomyślnie zatwierdzone",
          rejected: "Potwierdzenie zostało pomyślnie odrzucone",
        },
      },
    },
  },
};
