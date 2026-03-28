import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    apiKeyNotConfigured: "Klucz API nie jest skonfigurowany",
    noImageUrl: "Brak adresu URL obrazu zwróconego przez dostawcę",
    noAudioUrl: "Brak adresu URL audio zwróconego przez dostawcę",
    externalServiceError: "Błąd zewnętrznej usługi: {{message}}",
    requestFailed: "Żądanie nie powiodło się: {{message}}",
    requestAborted: "Żądanie anulowane",
    requestTimedOut: "Przekroczono limit czasu żądania",
    generationFailed: "Generowanie nie powiodło się",
    pollFailed: "Odpytywanie nie powiodło się: HTTP {{status}}",
  },
};
