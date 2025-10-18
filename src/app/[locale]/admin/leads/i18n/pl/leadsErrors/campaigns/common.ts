import type { translations as EnglishCommonTranslations } from "../../../en/leadsErrors/campaigns/common";

export const translations: typeof EnglishCommonTranslations = {
  error: {
    validation: {
      title: "Walidacja kampanii nie powiodła się",
      description: "Sprawdź dane kampanii i spróbuj ponownie",
    },
    unauthorized: {
      title: "Dostęp do kampanii odmówiony",
      description: "Nie masz uprawnień do dostępu do kampanii",
    },
    server: {
      title: "Błąd serwera kampanii",
      description: "Nie można przetworzyć kampanii z powodu błędu serwera",
    },
    unknown: {
      title: "Operacja kampanii nie powiodła się",
      description: "Wystąpił nieoczekiwany błąd podczas operacji kampanii",
    },
    forbidden: {
      title: "Dostęp do kampanii zabroniony",
      description: "Nie masz uprawnień do wykonania tej operacji kampanii",
    },
    notFound: {
      title: "Kampania nie znaleziona",
      description: "Żądana kampania nie została znaleziona",
    },
  },
};
