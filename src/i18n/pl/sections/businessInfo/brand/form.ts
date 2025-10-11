import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/businessInfo/brand/form";

export const formTranslations: typeof EnglishFormTranslations = {
  title: "Tożsamość Marki",
  description: "Zdefiniuj wartości marki, osobowość i wytyczne wizualne.",
  validation: {
    brandDescriptionRequired: "Opis marki jest wymagany",
  },
  success: {
    title: "Tożsamość marki została pomyślnie zaktualizowana",
    description: "Tożsamość Twojej marki została zapisana.",
  },
  error: {
    title: "Błąd podczas zapisywania tożsamości marki",
    description: "Nie udało się zaktualizować tożsamości marki",
    validation: {
      title: "Walidacja marki nie powiodła się",
      description: "Sprawdź informacje o marce i spróbuj ponownie",
    },
    unauthorized: {
      title: "Dostęp zabroniony",
      description: "Nie masz uprawnień do aktualizacji tożsamości marki",
    },
    server: {
      title: "Błąd serwera",
      description: "Nie można zapisać tożsamości marki z powodu błędu serwera",
    },
    unknown: {
      title: "Nieoczekiwany błąd",
      description:
        "Wystąpił nieoczekiwany błąd podczas zapisywania tożsamości marki",
    },
  },
  get: {
    success: {
      title: "Tożsamość marki została pomyślnie załadowana",
      description: "Informacje o tożsamości Twojej marki zostały pobrane",
    },
  },
  identity: {
    title: "Tożsamość Marki",
    description: "Podstawowe elementy definiujące Twoją markę",
  },
  personality: {
    title: "Osobowość Marki",
    description: "Jak Twoja marka komunikuje się i jest odbierana",
  },
  sections: {
    identity: {
      title: "Tożsamość Marki",
      description: "Podstawowe elementy definiujące Twoją markę",
    },
    personality: {
      title: "Osobowość Marki",
      description: "Jak Twoja marka komunikuje się i jest odbierana",
    },
  },
  fields: {
    brandDescription: {
      label: "Opis Marki",
      placeholder:
        "Opisz co reprezentuje i za czym opowiada się Twoja marka...",
      description: "Kompleksowy opis Twojej marki",
    },
    brandMission: {
      label: "Misja Marki",
      placeholder: "Jaka jest misja i cel Twojej marki?",
      description: "Podstawowa misja i cel Twojej marki",
    },
    brandVision: {
      label: "Wizja Marki",
      placeholder: "Jaka jest długoterminowa wizja dla marki?",
      description: "Długoterminowa wizja i aspiracje Twojej marki",
    },
    brandValues: {
      label: "Wartości Marki",
      placeholder: "Jakie podstawowe wartości reprezentuje Twoja marka?",
      description:
        "Fundamentalne wartości, za którymi opowiada się Twoja marka",
    },
    brandPersonality: {
      label: "Osobowość Marki",
      placeholder: "Jak opisałbyś osobowość Twojej marki?",
      description: "Cechy osobowości, które ucieleśnia Twoja marka",
    },
    brandVoice: {
      label: "Głos Marki",
      placeholder: "Jak Twoja marka przemawia do swoich odbiorców?",
      description: "Ton i styl komunikacji Twojej marki",
    },
    brandTone: {
      label: "Ton Marki",
      placeholder: "Jakiego tonu powinna używać komunikacja Twojej marki?",
      description: "Specyficzny ton dla przekazów Twojej marki",
    },
    brandColors: {
      label: "Kolory Marki",
      placeholder:
        "Jakie kolory reprezentują Twoją markę? (np. #FF5733, Niebieski, itp.)",
      description: "Paleta kolorów i schemat kolorystyczny Twojej marki",
    },
    brandFonts: {
      label: "Czcionki Marki",
      placeholder:
        "Jakich czcionek używa Twoja marka? (np. Arial, Helvetica, itp.)",
      description: "Typografia i wybór czcionek dla Twojej marki",
    },
    logoDescription: {
      label: "Opis Logo",
      placeholder: "Opisz projekt, styl i znaczenie Twojego logo...",
      description:
        "Szczegóły dotyczące logo i tożsamości wizualnej Twojej marki",
    },
    visualStyle: {
      label: "Styl Wizualny",
      placeholder: "Opisz ogólny styl wizualny i estetykę Twojej marki...",
      description:
        "Podejście do projektowania wizualnego i wytyczne stylistyczne Twojej marki",
    },
    brandPromise: {
      label: "Obietnica Marki",
      placeholder: "Jaką obietnicę składa Twoja marka klientom?",
      description: "Zobowiązanie, które Twoja marka składa swoim odbiorcom",
    },
    brandDifferentiators: {
      label: "Wyróżniki Marki",
      placeholder: "Co czyni Twoją markę wyjątkową i różną od konkurencji?",
      description: "Kluczowe czynniki wyróżniające Twoją markę",
    },
    brandGuidelines: {
      label: "Mam wytyczne marki",
      description:
        "Zaznacz, jeśli masz istniejące wytyczne marki lub przewodniki stylistyczne",
    },
    hasStyleGuide: {
      label: "Przewodnik Stylistyczny",
      description: "Mam kompleksowy przewodnik stylistyczny",
    },
    hasLogoFiles: {
      label: "Pliki Logo",
      description: "Mam pliki logo w różnych formatach",
    },
    hasBrandAssets: {
      label: "Zasoby Marki",
      description: "Mam inne zasoby marki (obrazy, szablony, itp.)",
    },
    additionalNotes: {
      label: "Dodatkowe Uwagi",
      placeholder: "Dodatkowe informacje o tożsamości Twojej marki...",
      description: "Dodatkowe informacje lub uwagi związane z marką",
    },
  },
  visual: {
    title: "Tożsamość Wizualna",
    description: "Zdefiniuj elementy wizualne i system projektowy Twojej marki",
  },
  positioning: {
    title: "Pozycjonowanie Marki",
    description: "Zdefiniuj co czyni Twoją markę wyjątkową i wartościową",
  },
  assets: {
    title: "Zasoby Marki",
    description: "Zarządzaj istniejącymi materiałami marki i wytycznymi",
  },
  submit: {
    save: "Zapisz Tożsamość Marki",
    saving: "Zapisywanie...",
  },
};
