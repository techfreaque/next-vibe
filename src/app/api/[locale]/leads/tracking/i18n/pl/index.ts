import { translations as engagementTranslations } from "../../engagement/i18n/pl";
import { translations as pixelTranslations } from "../../pixel/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  engagement: engagementTranslations,
  pixel: pixelTranslations,
  existing: {
    found: "Znaleziono istniejące śledzenie leadu",
  },
  component: {
    initialized: "Komponent śledzenia leadu zainicjowany",
  },
  error: "Błąd w śledzeniu leadu",
  errors: {
    default: "Wystąpił błąd",
    missingId: "Brak identyfikatora śledzenia",
    invalidUrl: "Nieprawidłowy URL",
  },
  data: {
    captured: "Dane śledzenia leadu przechwycone",
    capture: {
      error: "Błąd podczas przechwytywania danych śledzenia leadu",
    },
    retrieve: {
      error: "Błąd podczas pobierania danych śledzenia leadu",
    },
    loaded: {
      signup: "Dane śledzenia leadu załadowane do rejestracji",
    },
    load: {
      error: {
        noncritical: "Błąd podczas ładowania danych śledzenia leadu (niekrytyczny)",
      },
    },
    stored: "Dane śledzenia leadu zapisane",
    store: {
      error: "Błąd podczas zapisywania danych śledzenia leadu",
    },
    cleared: "Dane śledzenia leadu wyczyszczone",
    clear: {
      error: "Błąd podczas czyszczenia danych śledzenia leadu",
    },
    format: {
      error: "Błąd podczas formatowania danych śledzenia",
    },
  },
  params: {
    validate: {
      error: "Błąd podczas walidacji parametrów śledzenia",
    },
  },
};
