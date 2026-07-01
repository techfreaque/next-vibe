import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Klient bezgłowy",
    titleShort: "headless",
    description: "Uruchom bezgłowy klient zdalnych połączeń",
    form: {
      title: "Klient bezgłowy",
      description:
        "Uruchamia połączenia reverse-WS i executor narzędzi. Bez serwera web.",
    },
    fields: {
      computerName: {
        title: "Nazwa komputera",
        description: "Identyfikator tej maszyny (domyślnie: hostname systemu)",
      },
      remoteUrl: {
        title: "Zdalny URL",
        description: "URL instancji chmurowej",
      },
      leadId: {
        title: "ID leada",
        description: "Twoje UUID leada na zdalnej instancji",
      },
      token: {
        title: "Token",
        description: "Token uwierzytelniający połączenie",
      },
      output: { title: "Wyjście" },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe dane",
      },
      network: { title: "Błąd sieci", description: "Błąd sieci" },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Brak autoryzacji",
      },
      forbidden: { title: "Zabronione", description: "Zabronione" },
      notFound: { title: "Nie znaleziono", description: "Nie znaleziono" },
      server: { title: "Błąd serwera", description: "Błąd serwera" },
      unknown: { title: "Nieznany błąd", description: "Nieznany błąd" },
      conflict: { title: "Konflikt", description: "Konflikt" },
      migrationFailed: "Migracja nie powiodła się",
      migrationError: "Błąd migracji",
    },
    success: {
      title: "Klient bezgłowy uruchomiony",
      description:
        "Połączenia reverse-WS otwarte, oczekiwanie na żądania narzędzi",
    },
  },
};
