import type { postTranslations as EnglishPostTranslations } from "../../../../en/sections/leadsErrors/leadsImport/post";

export const postTranslations: typeof EnglishPostTranslations = {
  success: {
    title: "Akcja zadania importu zakończona",
    description: "Żądana akcja została wykonana",
    job_stopped: "Zadanie zatrzymane pomyślnie",
    job_queued_retry: "Zadanie dodane do kolejki ponownych prób",
    job_deleted: "Zadanie usunięte pomyślnie",
  },
  error: {
    validation: {
      title: "Walidacja importu potencjalnych klientów nie powiodła się",
      description: "Sprawdź swój plik CSV i spróbuj ponownie",
      failed: "Walidacja wiersza CSV nie powiodła się",
      invalidData: "Nieprawidłowe dane w wierszu CSV",
      missingFields: "Brakuje wymaganych pól",
      invalidEmail: "Nieprawidłowy adres e-mail w wierszu CSV",
      email_required: "E-mail jest wymagany",
      invalid_email_format: "Nieprawidłowy format e-maila",
    },
    unauthorized: {
      title: "Import potencjalnych klientów nieautoryzowany",
      description: "Nie masz uprawnień do importowania potencjalnych klientów",
    },
    server: {
      title: "Błąd serwera importu potencjalnych klientów",
      description:
        "Nie można zaimportować potencjalnych klientów z powodu błędu serwera",
    },
    unknown: {
      title: "Import potencjalnych klientów nie powiódł się",
      description:
        "Wystąpił nieoczekiwany błąd podczas importowania potencjalnych klientów",
    },
    forbidden: {
      title: "Import potencjalnych klientów zabroniony",
      description: "Nie masz uprawnień do importowania potencjalnych klientów",
    },
    not_found: {
      title: "Zadanie importu nie znalezione",
      description: "Żądane zadanie importu nie mogło zostać znalezione",
    },
    stopped_by_user: "Zatrzymane przez użytkownika",
  },
};
