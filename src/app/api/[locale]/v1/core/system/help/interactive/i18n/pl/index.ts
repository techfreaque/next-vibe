export default {
  post: {
    summary: "Uruchom tryb interaktywny",
    description: "Uruchom interaktywny interfejs wiersza poleceń do przeglądania dostępnych poleceń",
    response: {
      success: {
        title: "Tryb interaktywny uruchomiony",
        description: "Tryb interaktywny jest teraz aktywny",
      },
    },
    errors: {
      unauthorized: {
        title: "Wymagana autoryzacja",
        description: "Musisz być uwierzytelniony, aby korzystać z trybu interaktywnego",
      },
      server_error: {
        title: "Nie udało się uruchomić",
        description: "Nie można uruchomić trybu interaktywnego",
      },
    },
  },
};
