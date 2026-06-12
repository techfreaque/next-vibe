import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  widget: {
    title: "Aktywne terminale",
    back: "Wróć",
    lastCommand: "Ostatnie polecenie",
    noTerminals: "Brak aktywnych terminali",
    noTerminalsHint:
      "Uruchom polecenie przez Wykonaj polecenie, aby rozpocząć sesję terminala.",
    openExec: "Wykonaj polecenie",
    terminalCount: "terminali",
    machineLabel: "Maszyna",
    cwdLabel: "Katalog",
    statusLabel: "Status",
    openedLabel: "Otwarto",
    openTerminal: "Otwórz",
    manageConnections: "Połączenia",
    activeStatus: "Aktywny",
  },
  get: {
    title: "Lista terminali",
    titleShort: "Terminale",
    description:
      "Wyświetl aktywne sesje terminali z bieżącymi katalogami roboczymi.",
    dynamicTitle: "Terminale: {{path}}",
    status: {
      loading: "Ładowanie...",
      done: "Załadowano",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Maszyna",
        description:
          "Filtruj do konkretnej maszyny, np. /ssh/local-machine. Puste dla wszystkich.",
      },
    },
    response: {
      terminals: {
        terminalId: { content: "ID terminala" },
        connectionSlug: { content: "Maszyna" },
        cwd: { content: "Katalog roboczy" },
        name: { content: "Nazwa" },
        openedAt: { content: "Otwarto" },
        lastCommandAt: { content: "Ostatnie polecenie" },
        status: { content: "Status" },
      },
      total: { text: "Razem" },
    },
    errors: {
      validation: {
        title: "Błędne dane",
        description: "Sprawdź ścieżkę",
      },
      network: { title: "Offline", description: "Brak połączenia z serwerem" },
      unauthorized: {
        title: "Niezalogowany",
        description: "Najpierw się zaloguj",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Niedozwolone",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono terminali",
      },
      server: { title: "Błąd serwera", description: "Coś poszło nie tak" },
      unknown: { title: "Błąd", description: "Coś poszło nie tak" },
      unsavedChanges: {
        title: "Niezapisane",
        description: "Najpierw zapisz lub odrzuć",
      },
      conflict: {
        title: "Konflikt",
        description: "Sprzeczna operacja",
      },
    },
    success: {
      title: "Terminale załadowane",
      description: "Aktywne terminale załadowane",
    },
  },
};
