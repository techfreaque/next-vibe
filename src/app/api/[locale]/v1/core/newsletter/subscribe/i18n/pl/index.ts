import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Newsletter",
  tags: {
    newsletter: "Newsletter",
    subscription: "Subskrypcja",
  },
  email: {
    label: "Adres e-mail",
    description: "Twój adres e-mail do subskrypcji newslettera",
    placeholder: "użytkownik@przykład.pl",
    helpText: "Użyjemy tego adresu do wysyłania aktualizacji newslettera",
  },
  name: {
    label: "Imię",
    description: "Twoje imię (opcjonalne)",
    placeholder: "Jan Kowalski",
    helpText: "Pomóż nam spersonalizować Twoje doświadczenie z newsletterem",
  },
  preferences: {
    label: "Preferencje newslettera",
    description: "Wybierz rodzaje newsletterów, które chcesz otrzymywać",
    placeholder: "Wybierz swoje preferencje",
    helpText: "Możesz zmienić te preferencje w dowolnym momencie",
  },
  leadId: {
    label: "ID Lead",
    description: "Opcjonalny identyfikator lead",
    placeholder: "123e4567-e89b-12d3-a456-426614174000",
    helpText: "Tylko do użytku wewnętrznego",
  },
  response: {
    success: "Pomyślnie zasubskrybowano newsletter",
    message: "Wiadomość o sukcesie",
    leadId: "Identyfikator Lead",
    subscriptionId: "ID subskrypcji",
    userId: "ID użytkownika",
    alreadySubscribed:
      "Ten adres e-mail jest już zapisany do naszego newslettera",
  },
  errors: {
    badRequest: {
      title: "Nieprawidłowe żądanie",
      description: "Podano nieprawidłowe parametry żądania",
    },
    internal: {
      title: "Błąd wewnętrzny",
      description: "Wystąpił błąd podczas przetwarzania Twojej subskrypcji",
    },
  },
  post: {
    title: "Subskrybuj newsletter",
    description: "Ustaw subskrypcję newslettera",
    form: {
      title: "Subskrypcja newslettera",
      description: "Skonfiguruj subskrypcję newslettera",
    },
    response: {
      title: "Odpowiedź subskrypcji",
      description: "Dane odpowiedzi subskrypcji newslettera",
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
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił błąd podczas przetwarzania Twojej subskrypcji",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      conflict: {
        title: "Już zasubskrybowany",
        description:
          "Ten adres e-mail jest już zapisany do naszego newslettera",
      },
      badRequest: {
        title: "Nieprawidłowe żądanie",
        description: "Podano nieprawidłowe parametry żądania",
      },
    },
    success: {
      title: "Pomyślnie zasubskrybowano",
      description: "Zostałeś pomyślnie zapisany do naszego newslettera",
    },
  },
};
