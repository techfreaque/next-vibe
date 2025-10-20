import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Przywróć kopię zapasową tłumaczeń",
    description: "Przywróć pliki tłumaczeń z kopii zapasowej",
    container: {
      title: "Przywróć kopię zapasową",
      description: "Przywróć pliki tłumaczeń z określonej kopii zapasowej",
    },
    fields: {
      backupPath: {
        title: "Ścieżka kopii zapasowej",
        description:
          "Ścieżka do katalogu kopii zapasowej, z którego ma zostać przywrócona",
      },
      validateOnly: {
        title: "Tylko walidacja",
        description: "Tylko zwaliduj kopię zapasową bez przywracania",
      },
      createBackupBeforeRestore: {
        title: "Utwórz kopię zapasową przed przywróceniem",
        description:
          "Utwórz kopię zapasową bieżącego stanu przed przywróceniem",
      },
    },
    messages: {
      validationSuccessful:
        "Walidacja kopii zapasowej zakończona pomyślnie - kopia zapasowa jest prawidłowa i może zostać przywrócona",
      restoreSuccessful: "Kopia zapasowa przywrócona pomyślnie",
      backupNotFound: "Nie znaleziono kopii zapasowej w określonej ścieżce",
    },
    response: {
      title: "Wynik przywracania",
      description: "Wyniki przywracania kopii zapasowej",
      message: "Komunikat przywracania",
      backupInfo: {
        title: "Informacje o kopii zapasowej",
        description: "Informacje o przywróconej kopii zapasowej",
        backupPath: "Ścieżka kopii zapasowej",
        backupDate: "Data kopii zapasowej",
        filesRestored: "Przywrócone pliki",
        newBackupCreated: "Utworzono nową kopię zapasową",
      },
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowa ścieżka kopii zapasowej lub parametry",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono kopii zapasowej",
        description: "Określona kopia zapasowa nie istnieje",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas przywracania kopii zapasowej",
      },
    },
    success: {
      title: "Kopia zapasowa przywrócona",
      description: "Kopia zapasowa tłumaczeń przywrócona pomyślnie",
    },
  },
};
