export const translations = {
  title: "Google Sheets",
  description:
    "Automatycznie dodawaj każdego nowego leada jako wiersz w swoim arkuszu Google. Podłącz konto Google — bez kluczy API.",
  connect: {
    label: "Połącz konto Google",
    description: "Zaloguj się przez Google, aby autoryzować dostęp do arkuszy",
  },
  connected: {
    label: "Połączono",
    description: "Twoje konto Google jest połączone",
  },
  spreadsheetId: {
    label: "Arkusz",
    description: "Wybierz arkusz, do którego będą dodawane nowe leady",
    placeholder: "Wybierz arkusz…",
  },
  sheetTab: {
    label: "Zakładka (opcjonalnie)",
    description:
      "Nazwa zakładki w arkuszu. Zostaw puste, aby użyć pierwszej zakładki.",
    placeholder: "np. Leady",
  },
  saveTag: "lead-magnet-google-sheets",
  saveTitle: "Zapisz konfigurację Google Sheets",
  saveDescription: "Połącz swój arkusz Google z formularzem leadów",
  saveSuccess: {
    title: "Połączono",
    description: "Nowe leady będą pojawiać się jako wiersze w Twoim arkuszu.",
  },
  oauthStart: {
    title: "Połącz Google Sheets",
    description:
      "Rozpocznij proces OAuth Google, aby autoryzować dostęp do arkuszy",
  },
  oauthCallback: {
    title: "Callback OAuth Google Sheets",
    description: "Obsługuje wymianę kodu OAuth po przekierowaniu z Google",
  },
  sheetsList: {
    title: "Lista arkuszy",
    description:
      "Zwraca listę arkuszy dostępnych dla podłączonego konta Google",
  },
  errors: {
    validation: { title: "Błąd walidacji", description: "Sprawdź swoje dane" },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Zaloguj się, aby kontynuować",
    },
    forbidden: { title: "Zabronione", description: "Brak dostępu" },
    notFound: {
      title: "Nie znaleziono",
      description: "Zasób nie został znaleziony",
    },
    conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
    network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany",
    },
    internal: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd",
    },
    unknown: { title: "Nieznany błąd", description: "Wystąpił nieznany błąd" },
    oauthFailed: "Autoryzacja Google nie powiodła się. Spróbuj ponownie.",
    noRefreshToken:
      "Google nie zwróciło tokenu odświeżania. Odłącz i ponownie połącz konto.",
    sheetsApiFailed:
      "Nie można załadować arkuszy. Sprawdź połączenie z Google.",
    appendFailed:
      "Nie można zapisać do arkusza Google. Token może być wygasły.",
  },
  response: {
    provider: "Dostawca",
    isActive: "Aktywny",
    spreadsheetId: "ID arkusza",
    sheetTab: "Zakładka",
    sheets: "Arkusze",
    connected: "Połączono",
  },
  widget: {
    connectTitle: "Połącz Google Sheets",
    connectDescription:
      "Zaloguj się przez Google, aby automatycznie dodawać każdego leada jako wiersz w Twoim arkuszu.",
    redirectNote:
      "Zostaniesz przekierowany do Google w celu udzielenia dostępu do arkuszy.",
    reconnect: "Połącz ponownie",
    loading: "Ładowanie arkuszy…",
    noSheets: "Nie znaleziono arkuszy",
    refresh: "Odśwież listę",
    selectRequired: "Wybierz arkusz",
    saveFailed: "Zapisanie nie powiodło się. Spróbuj ponownie.",
    saving: "Zapisywanie…",
  },
};
