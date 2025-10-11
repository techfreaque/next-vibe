import type { connectionTranslations as EnglishConnectionTranslations } from "../../../en/sections/imapErrors/connection";

export const connectionTranslations: typeof EnglishConnectionTranslations = {
  timeout: {
    title: "Timeout połączenia",
    description: "Połączenie z serwerem IMAP przekroczyło limit czasu.",
  },
  refused: {
    title: "Połączenie odrzucone",
    description: "Serwer IMAP odrzucił połączenie.",
  },
  auth_failed: {
    title: "Uwierzytelnianie nieudane",
    description: "Nieprawidłowa nazwa użytkownika lub hasło.",
  },
  ssl_error: {
    title: "Błąd SSL/TLS",
    description: "Wystąpił błąd podczas bezpiecznego połączenia.",
  },
  failed: "Połączenie IMAP nie powiodło się",
  test: {
    failed: "Test połączenia IMAP nie powiódł się",
  },
  close: {
    failed: "Nie udało się zamknąć połączenia IMAP",
  },
  folders: {
    list: {
      failed: "Nie udało się wyświetlić folderów IMAP",
    },
  },
  messages: {
    list: {
      failed: "Nie udało się wyświetlić wiadomości IMAP",
    },
  },
};
