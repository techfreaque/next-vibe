import type { formTranslations as EnglishFormTranslations } from "../../../../en/sections/paymentErrors/invoice/form";

export const formTranslations: typeof EnglishFormTranslations = {
  error: {
    validation: {
      title: "Walidacja faktury nie powiodła się",
      description: "Nie można zwalidować żądania faktury",
    },
    unauthorized: {
      title: "Dostęp do faktury nieautoryzowany",
      description: "Nie masz uprawnień do dostępu do tej faktury",
    },
    server: {
      title: "Błąd serwera faktury",
      description: "Nie można załadować faktury z powodu błędu serwera",
    },
    unknown: {
      title: "Dostęp do faktury nie powiódł się",
      description: "Wystąpił nieoczekiwany błąd podczas ładowania faktury",
    },
  },
  success: {
    title: "Faktura utworzona pomyślnie",
    description: "Twoja faktura została wygenerowana",
  },
};
