import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Interaktywny eksplorator API",
  description:
    "Przeglądaj i testuj wszystkie definicje endpointów interaktywnie",
  grouping: {
    category: "Kategoria",
    tags: "Tagi",
    path: "Ścieżka",
  },
  search: {
    placeholder: "Szukaj endpointów...",
  },
  noEndpoints: "Nie znaleziono endpointów",
  selectEndpoint: "Wybierz endpoint, aby zobaczyć szczegóły",
  errors: {
    cliOnly: {
      title: "Tylko CLI",
    },
  },
};
