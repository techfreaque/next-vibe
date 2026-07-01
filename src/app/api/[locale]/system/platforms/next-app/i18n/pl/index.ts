import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  generate: {
    post: {
      title: "Generuj aplikację Next",
      titleShort: "Gen Next",
      description:
        "Generuje powłoki re-eksportu struktury aplikacji Next.js (page.tsx / route.ts) do src/generated/app ze źródła nadrzędnego. Respektuje 'use custom'.",
      tag: "generuj",
      response: {
        success: "Generowanie powiodło się",
        fields: {
          success: "Sukces",
          created: "Utworzone",
          skipped: "Pominięte",
          errors: "Błędy",
          message: "Wiadomość",
        },
      },
      errors: {
        validation: {
          title: "Nieprawidłowe parametry",
          description: "Parametry generowania są nieprawidłowe",
        },
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Nie masz uprawnień do uruchomienia tego generatora",
        },
        server: {
          title: "Błąd serwera",
          description: "Wystąpił błąd podczas generowania powłok",
        },
        network: {
          title: "Błąd sieci",
          description: "Wystąpił błąd sieci",
        },
        forbidden: {
          title: "Zabronione",
          description: "Dostęp do tego generatora jest zabroniony",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Nie znaleziono katalogu źródłowego",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieznany błąd",
        },
        conflict: {
          title: "Konflikt",
          description: "Podczas generowania wystąpił konflikt",
        },
        unsaved: {
          title: "Niezapisane zmiany",
          description: "Istnieją niezapisane zmiany",
        },
      },
      success: {
        title: "Sukces",
        description: "Powłoki aplikacji Next zostały pomyślnie wygenerowane",
      },
    },
  },
};
