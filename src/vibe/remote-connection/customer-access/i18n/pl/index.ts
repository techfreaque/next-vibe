import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  denied: {
    notPaid:
      "Podłączenie własnej instancji wymaga płatnego konta. Odblokuje je dowolny pakiet kredytów lub subskrypcja.",
    noConnection:
      "To konto nie ma aktywnego połączenia. Najpierw podłącz swoją instancję, potem spróbuj ponownie.",
    connectionLimit:
      "Osiągnięto limit połączeń: {{max}} instancje na konto. Odłącz jedną, aby dodać kolejną.",
    rateLimited:
      "Za dużo żądań z Twojej instancji. Spróbuj ponownie za {{seconds}} s.",
    invalidUrl:
      "Adres instancji musi być samym originem, np. https://moj-serwer.example.com, bez ścieżki i parametrów.",
  },
};
