import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  task: {
    description:
      "Oczyszczanie wygasłych sesji użytkowników w celu utrzymania bezpieczeństwa systemu",
    purpose: "Usuwa wygasłe sesje w celu utrzymania bezpieczeństwa i wydajności",
    impact:
      "Poprawia wydajność systemu i bezpieczeństwo poprzez usuwanie przestarzałych danych sesji",
    rollback: "Rollback nie ma zastosowania dla operacji czyszczenia",
  },
  errors: {
    default: "Wystąpił błąd podczas czyszczenia sesji",
    execution_failed: {
      title: "Oczyszczanie sesji nie powiodło się",
      description: "Błąd podczas oczyszczania wygasłych sesji",
    },
    partial_failure: {
      title: "Częściowa awaria oczyszczania sesji",
      description: "Niektóre sesje nie mogły zostać oczyszczone",
    },
    unknown_error: {
      title: "Nieznany błąd oczyszczania sesji",
      description: "Wystąpił nieznany błąd podczas oczyszczania sesji",
    },
    invalid_session_retention: {
      title: "Nieprawidłowe przechowywanie sesji",
      description: "Określono nieprawidłowy okres przechowywania sesji",
    },
    invalid_token_retention: {
      title: "Nieprawidłowe przechowywanie tokenów",
      description: "Określono nieprawidłowy okres przechowywania tokenów",
    },
    invalid_batch_size: {
      title: "Nieprawidłowy rozmiar partii",
      description: "Określono nieprawidłowy rozmiar partii do oczyszczania",
    },
    validation_failed: {
      title: "Walidacja nie powiodła się",
      description: "Walidacja konfiguracji oczyszczania sesji nie powiodła się",
    },
  },
  success: {
    title: "Oczyszczanie sesji zakończone",
    description: "Pomyślnie oczyszczono wygasłe sesje",
  },
  monitoring: {
    alertTrigger: "Zadanie oczyszczania sesji nie powiodło się",
  },
  documentation: {
    overview:
      "To zadanie usuwa wygasłe sesje użytkowników z systemu w celu utrzymania bezpieczeństwa i wydajności",
  },
};
