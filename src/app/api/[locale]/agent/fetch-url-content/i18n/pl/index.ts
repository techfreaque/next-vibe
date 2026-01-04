export const translations = {
  category: "Informacja",
  get: {
    title: "Pobierz Zawartość URL",
    description:
      "Pobierz i wyodrębnij zawartość z dowolnego adresu URL, konwertując ją na czytelny format markdown. Użyj tego, gdy potrzebujesz przeczytać lub przeanalizować zawartość strony internetowej.",
    form: {
      title: "Parametry Pobierania URL",
      description: "Skonfiguruj adres URL, z którego ma zostać pobrana zawartość",
    },
    fields: {
      url: {
        title: "URL",
        description: "Pełny adres URL do pobrania (musi zawierać http:// lub https://)",
        placeholder: "https://przyklad.pl",
      },
    },
    response: {
      message: {
        title: "Wiadomość",
        description: "Status operacji pobierania",
      },
      content: {
        title: "Zawartość",
        description: "Wyodrębniona zawartość w formacie markdown",
      },
      url: {
        title: "Zobacz oryginał",
        description: "Pobrany adres URL",
      },
      statusCode: {
        title: "Kod Statusu",
        description: "Kod statusu HTTP odpowiedzi",
      },
      timeElapsed: {
        title: "Czas Wykonania (ms)",
        description: "Czas potrzebny na pobranie zawartości w milisekundach",
      },
    },
    errors: {
      validation: {
        title: "Błąd Walidacji",
        description: "Adres URL jest nieprawidłowy lub brakujący",
      },
      internal: {
        title: "Błąd Pobierania",
        description: "Wystąpił błąd podczas pobierania adresu URL",
      },
    },
    success: {
      title: "Pobieranie Zakończone Sukcesem",
      description: "Zawartość URL została pomyślnie pobrana",
    },
  },
  tags: {
    scraping: "Scraping",
    web: "Internet",
    content: "Zawartość",
  },
};
