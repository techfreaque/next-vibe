import type { basicStreamTranslations as EnglishBasicStreamTranslations } from "../../../en/sections/streamingErrors/basicStream";

export const basicStreamTranslations: typeof EnglishBasicStreamTranslations = {
  error: {
    validation: {
      title: "Błąd walidacji Basic Stream",
      description: "Sprawdź parametry streamingu i spróbuj ponownie",
    },
    network: {
      title: "Błąd sieci Basic Stream",
      description: "Nie udało się połączyć z usługą streamingu",
    },
    unauthorized: {
      title: "Basic Stream nieautoryzowany",
      description: "Nie masz uprawnień do dostępu do basic streamingu",
    },
    server: {
      title: "Błąd serwera Basic Stream",
      description: "Wystąpił błąd podczas przetwarzania zapytania o stream",
    },
    unknown: {
      title: "Nieznany błąd Basic Stream",
      description: "Wystąpił nieoczekiwany błąd podczas streamingu",
    },
    initialization: "Nie udało się zainicjalizować połączenia streamingu",
    processing: "Nie udało się przetworzyć zapytania o streaming",
    noReader: "Brak dostępnego czytnika treści odpowiedzi",
    httpStatus: {
      "400": "Błędne zapytanie",
      "401": "Nieautoryzowany",
      "403": "Zabroniony",
      "404": "Nie znaleziono",
      "500": "Błąd wewnętrzny serwera",
    },
  },
  success: {
    title: "Sukces Basic Stream",
    description: "Basic streaming zakończony pomyślnie",
  },
};
