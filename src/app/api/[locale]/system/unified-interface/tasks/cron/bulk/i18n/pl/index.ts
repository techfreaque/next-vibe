import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Punkt końcowy API",
  tags: {
    tasks: "Tasks",
    cron: "Cron",
    bulk: "Zbiorczo",
  },
  post: {
    title: "Zbiorcza akcja na zadaniach",
    description:
      "Wykonaj zbiorczą akcję (usuń, włącz, wyłącz, uruchom) na wielu zadaniach cron",
    fields: {
      ids: {
        label: "ID zadań",
        description: "Lista ID zadań, na których ma być wykonana akcja",
      },
      action: {
        label: "Akcja",
        description: "Akcja do wykonania na wybranych zadaniach",
        options: {
          delete: "Usuń",
          enable: "Włącz",
          disable: "Wyłącz",
          run: "Uruchom teraz",
        },
      },
      succeeded: {
        label: "Udane",
        description: "Liczba pomyślnie przetworzonych zadań",
      },
      failed: {
        label: "Nieudane",
        description: "Liczba zadań, które nie zostały przetworzone",
      },
      errors: {
        label: "Błędy",
        description: "Lista błędów dla poszczególnych zadań",
      },
    },
    errors: {
      fetchFailed: "Nie udało się pobrać ID zadań dla zbiorczej akcji",
      validation: {
        title: "Walidacja nie powiodła się",
        description: "Podane dane zbiorczej akcji są nieprawidłowe",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Nie masz uprawnień do wykonywania zbiorczych akcji",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił błąd podczas wykonywania zbiorczej akcji",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp do tego zasobu jest zabroniony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas przetwarzania zbiorczej akcji",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Jedno lub więcej zadań nie zostało znalezionych",
      },
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
    },
    success: {
      completed: {
        title: "Zbiorcza akcja zakończona",
        description: "Zbiorcza akcja została zastosowana do wybranych zadań",
      },
    },
  },
};
