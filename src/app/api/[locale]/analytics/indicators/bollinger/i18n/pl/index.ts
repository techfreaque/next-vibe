import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Wstęgi Bollingera",
    description:
      "Wstęgi Bollingera — górna, środkowa (SMA) i dolna wstęga z odchyleniem standardowym",
    fields: {
      source: { label: "Źródło", description: "Wejściowa seria czasowa" },
      resolution: {
        label: "Rozdzielczość",
        description: "Ramy czasowe obliczeń",
      },
      range: { label: "Zakres", description: "Zakres czasu do obliczenia" },
      lookback: {
        label: "Cofnięcie",
        description: "Dodatkowe słupki przed początkiem zakresu do rozgrzewki",
      },
      period: {
        label: "Okres",
        description: "Liczba okresów (2–200)",
      },
      stdDev: {
        label: "Mnożnik odchylenia standardowego",
        description: "Mnożnik odchylenia standardowego (0,1–5)",
      },
      upper: {
        label: "Górna wstęga",
        description: "Górna wstęga Bollingera seria czasowa",
      },
      middle: {
        label: "Środkowa wstęga",
        description: "Środkowa wstęga (SMA) seria czasowa",
      },
      lower: {
        label: "Dolna wstęga",
        description: "Dolna wstęga Bollingera seria czasowa",
      },
      meta: { label: "Meta", description: "Metadane wykonania węzła" },
    },
    success: {
      title: "Wstęgi Bollingera obliczone",
      description: "Serie górnej, środkowej i dolnej wstęgi zwrócone",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Wymagany dostęp administratora",
      },
      server: {
        title: "Błąd serwera",
        description: "Obliczenie wstęg Bollingera nie powiodło się",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      validation: {
        title: "Walidacja nie powiodła się",
        description: "Nieprawidłowe parametry żądania",
      },
      notFound: { title: "Nie znaleziono", description: "Nie znaleziono" },
      conflict: { title: "Konflikt", description: "Konflikt" },
      network: {
        title: "Błąd sieci",
        description: "Żądanie sieciowe nie powiodło się",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Najpierw zapisz zmiany",
      },
    },
  },
};
