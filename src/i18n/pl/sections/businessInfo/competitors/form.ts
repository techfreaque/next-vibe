import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/businessInfo/competitors/form";

export const formTranslations: typeof EnglishFormTranslations = {
  title: "Analiza Konkurencji",
  description: "Przeanalizuj swoją konkurencję i pozycję na rynku.",
  validation: {
    competitorsRequired: "Główni konkurenci są wymagani",
  },
  success: {
    title: "Analiza konkurencji została pomyślnie zaktualizowana",
    description: "Twoja analiza konkurencji została zapisana.",
  },
  error: {
    title: "Błąd podczas zapisywania analizy konkurencji",
    description: "Nie udało się zaktualizować analizy konkurencji",
    validation: {
      title: "Walidacja konkurencji nie powiodła się",
      description: "Sprawdź analizę konkurencji i spróbuj ponownie",
    },
    unauthorized: {
      title: "Dostęp zabroniony",
      description: "Nie masz uprawnień do aktualizacji analizy konkurencji",
    },
    server: {
      title: "Błąd serwera",
      description:
        "Nie można zapisać analizy konkurencji z powodu błędu serwera",
    },
    unknown: {
      title: "Nieoczekiwany błąd",
      description:
        "Wystąpił nieoczekiwany błąd podczas zapisywania analizy konkurencji",
    },
  },
  get: {
    success: {
      title: "Analiza konkurencji została pomyślnie załadowana",
      description: "Twoja analiza konkurencji została pobrana",
    },
  },
  sections: {
    identification: {
      title: "Identyfikacja Konkurentów",
      description: "Kim są Twoi główni konkurenci?",
    },
    analysis: {
      title: "Analiza Konkurencyjna",
      description: "Przeanalizuj swoją pozycję względem konkurentów",
    },
  },
  fields: {
    mainCompetitors: {
      label: "Główni Konkurenci",
      placeholder: "Wymień swoich głównych konkurentów...",
      description: "Lista najważniejszych konkurentów w Twojej branży",
    },
    competitors: {
      label: "Wszyscy Konkurenci",
      placeholder: "Wymień wszystkich istotnych konkurentów na Twoim rynku...",
      description: "Kompleksowa lista konkurentów",
    },
    competitiveAdvantages: {
      label: "Przewagi Konkurencyjne",
      placeholder: "Jakie są Twoje przewagi nad konkurencją?",
      description: "Co wyróżnia Cię na tle konkurencji",
    },
    competitiveDisadvantages: {
      label: "Słabości Konkurencyjne",
      placeholder: "W czym konkurenci mają przewagę nad Tobą?",
      description: "Obszary, w których konkurenci są silniejsi",
    },
    competitorStrengths: {
      label: "Mocne Strony Konkurencji",
      placeholder: "Jakie są mocne strony Twojej konkurencji?",
      description: "Obszary, w których konkurencja jest silna",
    },
    competitorWeaknesses: {
      label: "Słabe Strony Konkurencji",
      placeholder: "Jakie są słabe strony konkurencji?",
      description: "Obszary, w których konkurencja ma braki",
    },
    marketPosition: {
      label: "Pozycja na Rynku",
      placeholder: "Jak postrzegasz swoją pozycję na rynku?",
      description: "Twoja obecna pozycja względem konkurencji",
    },
    differentiators: {
      label: "Kluczowe Różnicujące",
      placeholder: "Co czyni Cię wyjątkowym od konkurentów?",
      description: "Co wyróżnia Cię na tle konkurencji",
    },
    marketGaps: {
      label: "Luki Rynkowe",
      placeholder: "Jakie luki istnieją na rynku?",
      description: "Możliwości nie wykorzystane przez konkurentów",
    },
    additionalNotes: {
      label: "Dodatkowe Uwagi",
      placeholder: "Dodatkowe informacje o konkurencji...",
      description: "Dodatkowe spostrzeżenia dotyczące konkurencji",
    },
  },
  identification: {
    title: "Identyfikacja Konkurentów",
    description: "Kim są Twoi główni konkurenci?",
  },
  analysis: {
    title: "Analiza Konkurencyjna",
    description: "Przeanalizuj swoją pozycję względem konkurentów",
  },
  additional: {
    title: "Dodatkowe Spostrzeżenia",
    description: "Inne spostrzeżenia lub obserwacje dotyczące konkurencji",
  },
  submit: {
    save: "Zapisz Analizę Konkurencji",
    saving: "Zapisywanie...",
  },
};
