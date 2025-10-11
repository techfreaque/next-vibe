import type { connectionTranslations as EnglishConnectionTranslations } from "../../../en/sections/imap/connection";

export const connectionTranslations: typeof EnglishConnectionTranslations = {
  test: {
    success: "Test połączenia zakończony sukcesem",
    failed: "Test połączenia nie powiódł się",
    timeout: "Przekroczono limit czasu połączenia",
  },
};
