import { translations as repositoryTranslations } from "../../repository/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Reorganizuj tłumaczenia",
    description: "Reorganizuj pliki tłumaczeń i usuń nieużywane klucze",
    form: {
      title: "Opcje reorganizacji",
      description: "Skonfiguruj parametry reorganizacji tłumaczeń",
    },
    container: {
      title: "Reorganizacja tłumaczeń",
      description: "Reorganizuj i optymalizuj pliki tłumaczeń",
    },
    fields: {
      removeUnused: {
        title: "Usuń nieużywane klucze",
        description: "Usuń klucze tłumaczeń, które nie są używane w kodzie",
      },
      dryRun: {
        title: "Próbny przebieg",
        description: "Podgląd zmian bez modyfikowania plików",
      },
      backup: {
        title: "Utwórz kopię zapasową",
        description: "Utwórz kopię zapasową przed wprowadzeniem zmian",
      },
      regenerateStructure: {
        title: "Regeneruj strukturę",
        description: "Regeneruj strukturę plików tłumaczeń na podstawie użycia",
      },
      regenerateKeys: {
        title: "Regeneruj klucze",
        description: "Regeneruj klucze tłumaczeń na podstawie ścieżek plików",
      },
      success: {
        title: "Operacja zakończona sukcesem",
      },
      summary: {
        title: "Podsumowanie",
      },
      output: {
        title: "Wynik",
      },
      duration: {
        title: "Czas trwania",
      },
      backupPath: {
        title: "Ścieżka kopii zapasowej",
      },
      changes: {
        title: "Zmiany",
      },
    },
    messages: {
      foundKeys: "Znalezione klucze",
      removingKeys: "Usuwanie kluczy",
      regeneratedStructure: "Struktura zregenerowana",
      backupCreated: "Kopia zapasowa utworzona",
      starting: "Rozpoczynanie reorganizacji",
      scanningUsage: "Skanowanie użycia",
      loadingFiles: "Ładowanie plików",
      dryRunCompleted: "Próbny przebieg zakończony",
      removedKeysFromLanguage: "Usunięto klucze z języka",
      unusedKeysLabel: "Nieużywane klucze",
      regeneratingStructure: "Regenerowanie struktury",
      analyzingFrequency: "Analiza częstotliwości",
      groupingByLocation: "Grupowanie według lokalizacji",
      generatingFiles: "Generowanie plików",
      completed: "Zakończono",
      noKeysInUse: "Brak kluczy w użyciu",
    },
    response: {
      title: "Wynik reorganizacji",
      description: "Wyniki reorganizacji tłumaczeń",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry reorganizacji",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagana autentykacja",
      },
      forbidden: {
        title: "Zabronione",
        description: "Niewystarczające uprawnienia",
      },
    },
    success: {
      title: "Sukces",
      description: "Reorganizacja tłumaczeń zakończona pomyślnie",
    },
  },
  repository: repositoryTranslations,
};
