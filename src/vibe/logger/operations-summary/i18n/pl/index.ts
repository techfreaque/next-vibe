import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  snapshot: "Stan na {{date}}",
  reviewErrors: "Sprawdź błędy",
  reviewTasks: "Sprawdź nieudane zadania",
  reviewConnections: "Sprawdź połączenia",
  title: "Przegląd operacji",
  description:
    "Sprawdź otwarte błędy, nieudane zadania i stan połączonych instancji.",
  errors: "Otwarte klasy błędów",
  tasks: "Nieudane zadania",
  connections: "Problemy z połączeniem",
  errorAlert: "Otwarte klasy błędów bez ostrzeżeń ({{count}})",
  taskAlert: "Nieudane zadania cykliczne ({{count}})",
  connectionAlert: "Połączenia wymagające uwagi ({{count}})",
  attention: "Wymaga uwagi",
  clear: "Te kontrole nie wykazały otwartych problemów.",
  unavailable: "Niektóre kontrole stanu są niedostępne.",
  recent: "Ostatnia aktywność",
  loading: "Wczytywanie stanu systemu",
  retry: "Spróbuj ponownie",
};
