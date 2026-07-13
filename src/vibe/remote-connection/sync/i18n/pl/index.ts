import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "System",
  tags: {
    remoteSync: "Zdalna synchronizacja",
  },
  taskSync: {
    post: {
      title: "Zdalna synchronizacja",
      titleShort: "Sync",
      description:
        "Dwukierunkowa synchronizacja oparta na kursorach między instancjami.",
      instanceId: {
        label: "ID instancji",
        description: "Identyfikator wywołującej instancji",
      },
      syncCursors: {
        label: "Kursory synchronizacji",
        description:
          "Kursory per-domena wskazujące ostatnią pozycję synchronizacji",
      },
      capabilitiesVersion: {
        label: "Wersja capabilities",
        description: "Aktualny hash capabilities wywołującej instancji",
      },
      senderCapabilitiesVersion: {
        label: "Wersja capabilities nadawcy",
        description:
          "Wersja własnej migawki capabilities instancji wywołującej",
      },
      capabilitiesJson: {
        label: "Capabilities JSON",
        description: "Manifest narzędzi do rejestracji na tej instancji",
      },
      pushPayloads: {
        label: "Payloady push",
        description:
          "Rekordy wywołującego nowsze niż jego kursory push — stosowane przed serializacją odpowiedzi (dwukierunkowy push-pull)",
      },
      syncPayloads: {
        label: "Dane synchronizacji",
        description: "Rekordy nowsze niż kursor, per domena",
      },
      syncCounts: {
        label: "Liczba synchronizacji",
        description: "Liczba zwróconych rekordów per domena",
      },
      remoteCursors: {
        label: "Kursory zdalne",
        description: "Aktualne kursory tej instancji",
      },
      remoteCapabilitiesVersion: {
        label: "Zdalna wersja capabilities",
        description: "Aktualna wersja capabilities tej instancji",
      },
      capabilities: {
        label: "Capabilities",
        description: "Manifest narzędzi tej instancji",
      },
      serverTime: {
        label: "Czas serwera",
        description: "Aktualny znacznik czasu serwera",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe żądanie synchronizacji",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagane uwierzytelnienie",
        },
        internal: {
          title: "Błąd synchronizacji",
          description: "Wystąpił błąd podczas synchronizacji",
        },
        forbidden: {
          title: "Zabronione",
          description: "Brak uprawnień do synchronizacji",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Cel synchronizacji nie istnieje",
        },
        network: {
          title: "Błąd sieci",
          description: "Nie można dotrzeć do punktu końcowego synchronizacji",
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
          description: "Wykryto konflikt synchronizacji",
        },
      },
      success: {
        title: "Zsynchronizowano",
        description: "Synchronizacja zakończona pomyślnie",
      },
    },
  },
};
