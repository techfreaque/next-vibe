// oxlint-disable-next-line oxlint-plugin-boilerplate/i18n-pattern
import { translations as modelTranslations } from "../../../../models/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widget: {
    selectEndpoint: "Wybierz endpoint...",
    searchEndpoints: "Szukaj endpointów...",
    value: "{{value}}",
    selectEndpointHint: "Wybierz endpoint, aby skonfigurować parametry.",
    resolvingEndpoint: "Rozwiązywanie endpointu...",
    preCallsDescription:
      "Wywołania narzędzi przed promptem. Wyniki wstrzykiwane jako kontekst.",
    addPreCall: "Dodaj Pre-Call",
    preCalls: "Pre-calle",
    instructions: "Instrukcje",
    instructionsTooltip: "Nadpisz instrukcje systemowe",
    preCallsTooltip: "Wywołania narzędzi przed wykonaniem",
    more: "Więcej",
    moreTooltip: "Zaawansowane opcje",
    emptyState: {
      title: "Wybierz skill lub ulubiony",
      description:
        "Użyj selektora poniżej, aby wybrać skill lub załadować zapisany ulubiony. Model zostanie automatycznie dobrany.",
    },
    noResponse: "Brak odpowiedzi",
    cli: {
      submitting: "…",
      promptPrefix: "› ",
      skillPrefix: "skill ",
      promptHint: "Enter: wyślij  ·  Esc: wyjdź  ·  Tab: zmień pole",
      promptPlaceholder: "Wpisz prompt...",
      skillLabel: "skill: {{skill}}",
    },
  },
  models: { names: modelTranslations.names },
};
