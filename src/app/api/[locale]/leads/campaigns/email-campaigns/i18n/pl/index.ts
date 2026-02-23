import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zarządzanie Kampaniami",

  tag: "Kampanie e-mailowe",
  task: {
    description:
      "Wysyła automatyczne kampanie e-mailowe do leadów na podstawie ich etapu i harmonogramu",
  },
  post: {
    title: "Kampanie e-mailowe",
    description: "Przetwarzaj kampanie e-mailowe",
    form: {
      title: "Konfiguracja kampanii e-mailowych",
      description: "Skonfiguruj parametry kampanii e-mailowych",
    },
    container: {
      title: "Konfiguracja kampanii e-mailowych",
      description: "Skonfiguruj parametry kampanii e-mailowych",
    },
    fields: {
      batchSize: {
        label: "Rozmiar partii",
        description: "Liczba leadów do przetworzenia na partię",
      },
      maxEmailsPerRun: {
        label: "Maks. e-maili na przebieg",
        description: "Maksymalna liczba e-maili do wysłania na przebieg",
      },
      dryRun: {
        label: "Próbny przebieg",
        description: "Uruchom bez wysyłania e-maili",
      },
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi kampanii e-mailowych",
      emailsScheduled: "Zaplanowane e-maile",
      emailsSent: "Wysłane e-maile",
      emailsFailed: "Nieudane e-maile",
      leadsProcessed: "Przetworzone leady",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
};
