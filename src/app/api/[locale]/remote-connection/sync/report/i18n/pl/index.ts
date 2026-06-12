import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "System",
  tags: {
    remoteSync: "Zdalna synchronizacja",
  },
  taskReport: {
    post: {
      title: "Raport zadania",
      titleShort: "Raport",
      description: "Przyjmij wyniki wykonania od zdalnych instancji.",
      taskId: {
        label: "ID zadania",
        description: "ID raportowanego zadania",
      },
      executionId: {
        label: "ID wykonania",
        description: "ID konkretnego uruchomienia",
      },
      status: {
        label: "Status",
        description: "Końcowy status wykonania zadania",
      },
      durationMs: {
        label: "Czas (ms)",
        description: "Czas wykonania w milisekundach",
      },
      summary: {
        label: "Podsumowanie",
        description: "Czytelne podsumowanie wyniku wykonania",
      },
      error: {
        label: "Błąd",
        description: "Komunikat błędu w przypadku niepowodzenia",
      },
      serverTimezone: {
        label: "Strefa czasowa serwera",
        description: "Strefa czasowa wykonującego serwera",
      },
      executedByInstance: {
        label: "Wykonane przez",
        description: "ID instancji, która wykonała zadanie",
      },
      output: {
        label: "Dane wyjściowe",
        description: "Ustrukturyzowane dane wyjściowe zadania",
      },
      startedAt: {
        label: "Rozpoczęto o",
        description: "Znacznik czasu ISO początku wykonania",
      },
      wakeUpContext: {
        label: "Kontekst wznowienia",
        description:
          "Kontekst wznowienia wątku z żądania wykonania — pozwala wznowić bez lokalnego rekordu zadania",
      },
      processed: {
        label: "Przetworzone",
        description: "Czy raport został zaakceptowany",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowy raport",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagane uwierzytelnienie",
        },
        internal: {
          title: "Błąd przetwarzania",
          description: "Błąd podczas przetwarzania raportu",
        },
        forbidden: {
          title: "Zabronione",
          description: "Brak uprawnień do przesyłania raportów",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Zadanie nie istnieje",
        },
        network: {
          title: "Błąd sieci",
          description: "Nie można dotrzeć do punktu końcowego raportu",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        unsaved: {
          title: "Niezapisane zmiany",
          description: "Są niezapisane zmiany",
        },
        conflict: {
          title: "Konflikt",
          description: "Wykryto konflikt raportu",
        },
      },
      success: {
        title: "Raport zaakceptowany",
        description: "Raport zadania przetworzony pomyślnie",
      },
    },
  },
};
