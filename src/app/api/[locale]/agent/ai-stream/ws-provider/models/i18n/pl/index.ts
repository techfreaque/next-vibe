/**
 * Polish translations for WS Provider Models endpoint
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Modele AI",
  tags: {
    models: "modele",
    aiModels: "modele-ai",
  },
  get: {
    title: "Lista modeli AI",
    description:
      "Zwraca wszystkie dostepne modele AI z informacjami o cenach i mozliwosciach",
    response: {
      models: {
        title: "Modele",
      },
      id: {
        content: "ID modelu",
      },
      name: {
        content: "Nazwa",
      },
      provider: {
        content: "Dostawca",
      },
      category: {
        content: "Kategoria",
      },
      description: {
        content: "Opis",
      },
      contextWindow: {
        content: "Okno kontekstowe",
      },
      supportsTools: {
        content: "Obsluguje narzedzia",
      },
      creditCost: {
        content: "Koszt kredytowy",
      },
    },
    success: {
      title: "Modele pobrane",
      description: "Lista modeli AI pobrana pomyslnie",
    },
    errors: {
      validation: {
        title: "Blad walidacji",
        description: "Nieprawidlowe parametry zadania",
      },
      network: {
        title: "Blad sieci",
        description: "Nie udalo sie polaczyc z serwerem",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabronione",
        description: "Odmowa dostepu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono modeli",
      },
      server: {
        title: "Blad serwera",
        description: "Nie udalo sie pobrac modeli",
      },
      unknown: {
        title: "Nieznany blad",
        description: "Wystapil nieoczekiwany blad",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystapil konflikt",
      },
    },
  },
};
