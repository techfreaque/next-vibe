import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "System",
  tags: {
    remoteSync: "Synchronizacja zdalna",
  },
  remoteEventBridge: {
    post: {
      title: "Most zdarzeń zdalnych",
      titleShort: "Most zdarzeń",
      description:
        "Odbiera i przekazuje zdalne zdarzenia peer. Wywoływany przez HTTP (direct-http) lub przez reverse-WS.",
      eventName: {
        label: "Nazwa zdarzenia",
        description: "Typ zdarzenia wire do przetworzenia",
      },
      leadId: {
        label: "Lead ID",
        description: "Tożsamość między-instancyjna wysyłającego peera",
      },
      originInstanceId: {
        label: "Instancja źródłowa",
        description:
          "Instancja, która wygenerowała zdarzenie (zapobieganie echo)",
      },
      payload: {
        label: "Ładunek",
        description: "Surowy ładunek zdarzenia z instancji zdalnej",
      },
      received: {
        label: "Odebrano",
        description: "Czy zdarzenie zostało zaakceptowane i przetworzone",
      },
      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowy ładunek zdarzenia",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Wymagane uwierzytelnienie",
        },
        internal: {
          title: "Błąd przetwarzania",
          description: "Wystąpił błąd podczas przetwarzania zdarzenia",
        },
        forbidden: {
          title: "Zabronione",
          description: "Brak uprawnień do przesyłania zdarzeń",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Cel nie znaleziony",
        },
        network: {
          title: "Błąd sieci",
          description: "Nie można połączyć się z mostem zdarzeń",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        unsaved: {
          title: "Niezapisane zmiany",
          description: "Istnieją niezapisane zmiany",
        },
        conflict: {
          title: "Konflikt",
          description: "Wykryto konflikt zdarzeń",
        },
      },
      success: {
        title: "Zdarzenie odebrane",
        description: "Zdarzenie zdalne przetworzone pomyślnie",
      },
    },
  },
};
