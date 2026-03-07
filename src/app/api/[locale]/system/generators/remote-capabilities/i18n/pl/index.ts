export const translations = {
  category: "Generatory",

  post: {
    title: "Generuj zdalne możliwości",
    description:
      "Generuj pliki migawek zdalnych możliwości do odkrywania narzędzi",
    container: {
      title: "Konfiguracja zdalnych możliwości",
    },
    fields: {
      outputDir: {
        label: "Katalog wyjściowy",
        description: "Katalog do zapisu plików możliwości",
      },
      dryRun: {
        label: "Próbny przebieg",
        description: "Podgląd bez zapisu",
      },
      success: { title: "Sukces" },
      message: { title: "Wiadomość" },
      duration: { title: "Czas trwania" },
      endpointsFound: { title: "Znalezione punkty końcowe" },
      filesWritten: { title: "Zapisane pliki" },
    },
    success: {
      title: "Sukces",
      description: "Zdalne możliwości wygenerowane pomyślnie",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagana autoryzacja",
      },
      server: { title: "Błąd serwera", description: "Wewnętrzny błąd serwera" },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Połączenie sieciowe nie powiodło się",
      },
      forbidden: { title: "Zabroniony", description: "Odmowa dostępu" },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie znaleziony",
      },
      conflict: { title: "Konflikt", description: "Konflikt zasobów" },
    },
  },
  success: {
    generated: "Zdalne możliwości wygenerowane pomyślnie",
  },
};
