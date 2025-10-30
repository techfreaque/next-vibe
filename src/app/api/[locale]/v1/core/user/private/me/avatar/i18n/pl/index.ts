import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "awatar",
  errors: {
    user_not_found: "Użytkownik nie znaleziony",
    failed_to_upload_avatar: "Nie udało się przesłać awatara",
    failed_to_delete_avatar: "Nie udało się usunąć awatara",
    invalid_file_type: "Nieprawidłowy typ pliku",
    file_too_large: "Plik zbyt duży",
  },
  debug: {
    uploadingUserAvatar: "Przesyłanie awatara użytkownika",
    errorUploadingUserAvatar: "Błąd podczas przesyłania awatara użytkownika",
    deletingUserAvatar: "Usuwanie awatara użytkownika",
    errorDeletingUserAvatar: "Błąd podczas usuwania awatara użytkownika",
  },
  success: {
    uploaded: "Awatar przesłany pomyślnie",
    deleted: "Awatar usunięty pomyślnie",
    nextSteps: {
      visible: "Twój awatar jest teraz widoczny w Twoim profilu",
      update:
        "Możesz go zaktualizować w dowolnym momencie w ustawieniach profilu",
      default: "Twój profil teraz pokazuje domyślny awatar",
      uploadNew:
        "Możesz przesłać nowy awatar w dowolnym momencie w ustawieniach profilu",
    },
  },
  upload: {
    title: "Prześlij Awatar",
    description: "Prześlij zdjęcie profilowe",
    groups: {
      fileUpload: {
        title: "Przesyłanie Pliku",
        description: "Wybierz i prześlij zdjęcie awatara",
      },
    },
    fields: {
      file: {
        label: "Zdjęcie Awatara",
        description: "Wybierz plik obrazu dla swojego awatara",
        placeholder: "Wybierz plik obrazu...",
        help: "Prześlij plik obrazu (JPG, PNG, GIF) do 5MB",
        validation: {
          maxSize: "Rozmiar pliku musi być mniejszy niż 5MB",
          imageOnly: "Dozwolone są tylko pliki obrazów",
        },
      },
    },
    response: {
      title: "Odpowiedź Przesyłania",
      label: "Wynik Przesyłania",
      description: "Odpowiedź przesyłania awatara",
      success: "Przesyłanie Pomyślne",
      message: "Twój awatar został pomyślnie przesłany",
      avatarUrl: "URL Awatara",
      uploadTime: "Czas Przesyłania",
      nextSteps: {
        item: "Następny Krok",
      },
    },
    errors: {
      validation: {
        title: "Błąd Walidacji",
        description: "Przesłany plik jest nieprawidłowy lub uszkodzony",
      },
      unauthorized: {
        title: "Brak Autoryzacji",
        description: "Musisz być zalogowany, aby przesłać awatar",
      },
      server: {
        title: "Błąd Serwera",
        description: "Nie udało się przetworzyć przesyłania awatara",
      },
      internal: {
        title: "Błąd Wewnętrzny",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieoczekiwany błąd podczas przesyłania",
      },
      network: {
        title: "Błąd Sieci",
        description: "Wystąpił błąd sieci podczas przesyłania",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do przesyłania awatara",
      },
      notFound: {
        title: "Nie Znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      unsaved: {
        title: "Niezapisane Zmiany",
        description: "Istnieją niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas przesyłania",
      },
    },
    success: {
      title: "Awatar Przesłany",
      description: "Twoje zdjęcie profilowe zostało pomyślnie przesłane",
    },
  },
  delete: {
    title: "Usuń Awatar",
    description: "Usuń obecne zdjęcie profilowe",
    response: {
      title: "Odpowiedź Usuwania",
      label: "Wynik Usuwania",
      description: "Odpowiedź usuwania awatara",
      success: "Usuwanie Pomyślne",
      message: "Twój awatar został pomyślnie usunięty",
      nextSteps: {
        item: "Następny Krok",
      },
    },
    errors: {
      validation: {
        title: "Błąd Walidacji",
        description: "Żądanie usunięcia awatara jest nieprawidłowe",
      },
      unauthorized: {
        title: "Brak Autoryzacji",
        description: "Musisz być zalogowany, aby usunąć swój awatar",
      },
      server: {
        title: "Błąd Serwera",
        description: "Nie udało się usunąć awatara",
      },
      internal: {
        title: "Błąd Wewnętrzny",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieoczekiwany błąd podczas usuwania",
      },
      network: {
        title: "Błąd Sieci",
        description: "Wystąpił błąd sieci podczas usuwania",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do usuwania tego awatara",
      },
      notFound: {
        title: "Nie Znaleziono",
        description: "Awatar do usunięcia nie został znaleziony",
      },
      unsaved: {
        title: "Niezapisane Zmiany",
        description: "Istnieją niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas usuwania",
      },
    },
    success: {
      title: "Awatar Usunięty",
      description: "Twoje zdjęcie profilowe zostało pomyślnie usunięte",
    },
  },
};
