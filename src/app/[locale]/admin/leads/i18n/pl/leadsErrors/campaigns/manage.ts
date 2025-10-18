import type { translations as EnglishManageTranslations } from "../../../en/leadsErrors/campaigns/manage";

export const translations: typeof EnglishManageTranslations = {
  error: {
    validation: {
      title: "Walidacja zarządzania kampanią nie powiodła się",
      description: "Sprawdź dane kampanii i spróbuj ponownie",
    },
    unauthorized: {
      title: "Dostęp do zarządzania kampanią odmówiony",
      description: "Nie masz uprawnień do zarządzania kampaniami",
    },
    server: {
      title: "Błąd serwera zarządzania kampanią",
      description: "Nie można zarządzać kampanią z powodu błędu serwera",
    },
    unknown: {
      title: "Operacja zarządzania kampanią nie powiodła się",
      description: "Wystąpił nieoczekiwany błąd podczas zarządzania kampanią",
    },
    forbidden: {
      title: "Dostęp do zarządzania kampanią zabroniony",
      description: "Nie masz uprawnień do zarządzania kampaniami",
    },
    notFound: {
      title: "Kampania nie znaleziona",
      description: "Żądana kampania nie została znaleziona",
    },
    campaignActive: "Nie można usunąć aktywnej kampanii. Najpierw ją wyłącz.",
  },
  post: {
    success: {
      title: "Kampania utworzona",
      description: "Kampania została pomyślnie utworzona",
    },
  },
  put: {
    success: {
      title: "Kampania zaktualizowana",
      description: "Status kampanii został pomyślnie zaktualizowany",
    },
  },
  delete: {
    success: {
      title: "Kampania usunięta",
      description: "Kampania została pomyślnie usunięta",
    },
  },
};
