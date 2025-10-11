import type { postTranslations as EnglishPostTranslations } from "../../../../en/sections/leadsErrors/leadsEngagement/post";

export const postTranslations: typeof EnglishPostTranslations = {
  error: {
    validation: {
      title: "Walidacja zaangażowania potencjalnych klientów nie powiodła się",
      description: "Sprawdź swoje dane zaangażowania i spróbuj ponownie",
    },
    unauthorized: {
      title: "Zaangażowanie potencjalnych klientów nieautoryzowane",
      description:
        "Nie masz uprawnień do rejestrowania zaangażowania potencjalnych klientów",
    },
    server: {
      title: "Błąd serwera zaangażowania potencjalnych klientów",
      description:
        "Nie można zarejestrować zaangażowania potencjalnych klientów z powodu błędu serwera",
    },
    unknown: {
      title: "Zaangażowanie potencjalnych klientów nie powiodło się",
      description:
        "Wystąpił nieoczekiwany błąd podczas rejestrowania zaangażowania potencjalnych klientów",
    },
    forbidden: {
      title: "Zaangażowanie potencjalnego klienta zabronione",
      description:
        "Nie masz uprawnień do śledzenia zaangażowania potencjalnych klientów",
    },
  },
  success: {
    title: "Zaangażowanie potencjalnych klientów zarejestrowane",
    description:
      "Zaangażowanie potencjalnych klientów pomyślnie zarejestrowane",
  },
};
