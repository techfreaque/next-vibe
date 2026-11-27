import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  update: {
    post: {
      title: "Aktualizuj bazę krajów odwiedzających",
      titleShort: "Aktualizacja Geo IP",
      description:
        "Wczytuje miesięczną tabelę krajów DB-IP do bazy i uzupełnia kraj leadów, które go nie mają. Wyszukiwanie offline, bez wywołania API przy każdej wizycie.",
      tag: "Geo IP",
      container: {
        title: "Baza Geo IP",
        description:
          "Dane IP do kraju i ASN od DB-IP (CC BY 4.0). Lista ASN hostingu: bad-asn-list (MIT)",
      },
      fields: {
        force: {
          label: "Wymuś pobranie",
          description: "Pobierz bieżące wydanie, nawet jeśli jest już zapisane",
        },
      },
      response: {
        status: "Status",
        version: "Wydanie",
        asnVersion: "Wydanie ASN",
        v4Ranges: "Zakresy IPv4",
        v6Ranges: "Zakresy IPv6",
        backfilled: "Uzupełnione leady",
        unresolved: "Leady wciąż bez kraju",
      },
      errors: {
        unauthorized: {
          title: "Nie zalogowano",
          description: "Zaloguj się jako admin, aby zaktualizować bazę geo.",
        },
        forbidden: {
          title: "Brak uprawnień",
          description: "Tylko admini mogą aktualizować bazę geo.",
        },
        server: {
          title: "Aktualizacja nie powiodła się",
          description: "Nie udało się zaktualizować bazy geo. Sprawdź logi.",
        },
        unknown: {
          title: "Nieoczekiwany błąd",
          description: "Coś poszło nie tak podczas aktualizacji bazy geo.",
        },
        validation: {
          title: "Nieprawidłowe dane",
          description: "Sprawdź pola żądania.",
        },
        network: {
          title: "Błąd sieci",
          description: "Źródło geo jest nieosiągalne.",
        },
      },
      success: {
        title: "Baza geo sprawdzona",
        description: "Tabela krajów jest aktualna.",
      },
    },
    task: {
      description:
        "Miesięczna aktualizacja krajów DB-IP i cogodzinne uzupełnianie kraju leadów",
    },
  },
  enums: {
    updateStatus: {
      updated: "Zaktualizowano",
      current: "Już aktualne",
      unavailable: "Pobieranie nie powiodło się",
    },
  },
};
